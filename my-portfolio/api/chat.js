const DEFAULT_MODEL = "nex-agi/nex-n2-pro:free";
const MAX_MESSAGES = 10;
const MAX_PROJECTS = 8;

function cleanText(value, fallback = "") {
  return String(value || fallback).replace(/\s+/g, " ").trim();
}

function compactProject(project) {
  return {
    title: cleanText(project.title),
    type: cleanText(project.type),
    category: cleanText(project.category || project.platform),
    year: cleanText(project.year),
    description: cleanText(project.description || project.tagline).slice(0, 260),
    technologies: cleanText(project.technologies),
  };
}

function buildPortfolioContext(info = {}, projects = []) {
  const safeProjects = Array.isArray(projects)
    ? projects.filter(Boolean).slice(0, MAX_PROJECTS).map(compactProject)
    : [];

  return {
    profile: {
      name: cleanText(info.name, "Ali Hassan"),
      tagline: cleanText(info.tagline),
      bio: cleanText(info.bio),
      about: cleanText(info.about_bio),
      university: cleanText(info.university),
      location: cleanText(info.location),
      email: cleanText(info.email),
      linkedin: cleanText(info.linkedin),
      github: cleanText(info.github),
      available: Boolean(info.available),
      years_exp: info.years_exp || 2,
      projects_count: info.projects_count || safeProjects.length,
    },
    projects: safeProjects,
  };
}

function normalizeMessages(messages) {
  if (!Array.isArray(messages)) return [];

  return messages
    .filter((message) => message && ["user", "assistant"].includes(message.role))
    .slice(-MAX_MESSAGES)
    .map((message) => ({
      role: message.role,
      content: cleanText(message.content || message.text).slice(0, 900),
    }))
    .filter((message) => message.content);
}

function getReply(data) {
  return data.choices?.[0]?.message?.content?.trim() || "";
}

function getOpenRouterError(status, data) {
  const raw = data.error?.message || data.message || "OpenRouter request failed";
  if (status === 401 || status === 403) {
    return "OpenRouter rejected the API key. Regenerate the key, update Vercel, and redeploy.";
  }
  if (status === 402) {
    return "OpenRouter needs credits or a free model. Add credits or use an available :free model.";
  }
  if (status === 429) {
    return "OpenRouter rate limit was reached. Wait a little, then try again.";
  }
  if (status === 404) {
    return "The selected OpenRouter model was not found. Check OPENROUTER_MODEL in Vercel.";
  }
  return raw;
}

export default async function handler(req, res) {
  const env = globalThis.process?.env || {};
  const apiKey = env.OPENROUTER_API_KEY || env.OPENROUTER_KEY;
  const model = env.OPENROUTER_MODEL || DEFAULT_MODEL;

  if (req.method === "GET") {
    return res.status(200).json({
      ok: true,
      provider: "openrouter",
      configured: Boolean(apiKey),
      model,
    });
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!apiKey) {
    return res.status(500).json({ error: "OPENROUTER_API_KEY is not configured" });
  }

  try {
    const { message, messages, info, projects } = req.body || {};
    const latestMessage = cleanText(message).slice(0, 900);

    if (!latestMessage) {
      return res.status(400).json({ error: "Message is required" });
    }

    const portfolioContext = buildPortfolioContext(info, projects);
    const systemPrompt = [
      "You are Ali Hassan's portfolio chatbot on his personal website.",
      "Answer as a helpful, concise assistant for visitors, recruiters, and clients.",
      "Use only the portfolio context provided below. If something is not in the context, say you do not have that detail and suggest contacting Ali.",
      "Keep answers under 90 words unless the visitor asks for detail.",
      "Do not invent project names, employment history, prices, private contact details, or credentials.",
      `Portfolio context: ${JSON.stringify(portfolioContext)}`,
    ].join("\n");

    const openRouterResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": env.SITE_URL || "https://my-portfolio.vercel.app",
        "X-Title": "Ali Hassan Portfolio",
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: systemPrompt },
          ...normalizeMessages(messages),
          { role: "user", content: latestMessage },
        ],
        max_tokens: 260,
        temperature: 0.6,
      }),
    });

    const data = await openRouterResponse.json();

    if (!openRouterResponse.ok) {
      return res.status(openRouterResponse.status).json({
        error: getOpenRouterError(openRouterResponse.status, data),
        status: openRouterResponse.status,
      });
    }

    const reply = getReply(data);
    return res.status(200).json({
      reply: reply || "I could not create a response. Please try again.",
    });
  } catch (error) {
    return res.status(500).json({
      error: error instanceof Error ? error.message : "Unexpected server error",
    });
  }
}
