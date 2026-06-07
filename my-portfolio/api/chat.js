const DEFAULT_MODEL = "gemini-2.0-flash";
const MAX_MESSAGES = 10;
const MAX_PROJECTS = 8;
const env = globalThis.process?.env || {};

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
      role: message.role === "assistant" ? "model" : "user",
      parts: [{ text: cleanText(message.content || message.text).slice(0, 900) }],
    }))
    .filter((message) => message.parts[0].text);
}

function getOutputText(data) {
  return (data.candidates || [])
    .flatMap((candidate) => candidate.content?.parts || [])
    .map((part) => part.text || "")
    .join("\n")
    .trim();
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!env.GEMINI_API_KEY) {
    return res.status(500).json({ error: "GEMINI_API_KEY is not configured" });
  }

  try {
    const { message, messages, info, projects } = req.body || {};
    const latestMessage = cleanText(message).slice(0, 900);

    if (!latestMessage) {
      return res.status(400).json({ error: "Message is required" });
    }

    const portfolioContext = buildPortfolioContext(info, projects);
    const conversation = normalizeMessages(messages);
    const contents = [
      ...conversation,
      { role: "user", parts: [{ text: latestMessage }] },
    ];
    const systemPrompt = [
      "You are Ali Hassan's real-time portfolio chatbot on his personal website.",
      "Answer as a helpful, concise assistant for visitors, recruiters, and clients.",
      "Use only the portfolio context provided below. If something is not in the context, say you do not have that detail and suggest contacting Ali.",
      "Keep answers under 90 words unless the visitor asks for detail.",
      "Do not invent project names, employment history, prices, private contact details, or credentials.",
      `Portfolio context: ${JSON.stringify(portfolioContext)}`,
    ].join("\n");
    const model = env.GEMINI_MODEL || DEFAULT_MODEL;

    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
      {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": env.GEMINI_API_KEY,
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: systemPrompt }],
        },
        contents,
        generationConfig: {
          maxOutputTokens: 260,
          temperature: 0.6,
        },
      }),
    }
    );

    const data = await geminiResponse.json();

    if (!geminiResponse.ok) {
      return res.status(geminiResponse.status).json({
        error: data.error?.message || "Gemini request failed",
      });
    }

    const reply = getOutputText(data);
    return res.status(200).json({
      reply: reply || "I could not create a response. Please try again.",
    });
  } catch (error) {
    return res.status(500).json({
      error: error instanceof Error ? error.message : "Unexpected server error",
    });
  }
}
