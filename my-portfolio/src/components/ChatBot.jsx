import { useEffect, useMemo, useRef, useState } from "react";

const QUICK_PROMPTS = [
  "What can Ali build?",
  "Show me projects",
  "How can I contact Ali?",
  "What are his skills?",
];

function scrollToSection(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

async function readApiResponse(response) {
  const raw = await response.text();
  if (!raw) return {};

  try {
    return JSON.parse(raw);
  } catch {
    return {
      error: raw.length > 180 ? `${raw.slice(0, 180)}...` : raw,
    };
  }
}

export default function ChatBot({ info, projects = [] }) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hi, I am Ali's portfolio assistant. Ask me about projects, skills, or contact details.",
    },
  ]);
  const listRef = useRef(null);

  const projectContext = useMemo(() => projects.filter(Boolean), [projects]);

  useEffect(() => {
    if (!open) return;
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open, typing]);

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const sendMessage = async (value = input) => {
    const text = value.trim();
    if (!text || typing) return;

    const nextMessages = [...messages, { role: "user", text }];
    setMessages(nextMessages);
    setInput("");
    setTyping(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          messages: messages
            .filter((message) => message.role === "user" || message.role === "assistant")
            .slice(-8)
            .map((message) => ({ role: message.role, content: message.text })),
          info,
          projects: projectContext,
        }),
      });

      const data = await readApiResponse(response);
      if (!response.ok) {
        const message = response.status === 429
          ? "Gemini quota or rate limit is reached right now. Please try again later."
          : data.error || `Chat request failed with status ${response.status}`;
        throw new Error(message);
      }

      setMessages((current) => [
        ...current,
        { role: "assistant", text: data.reply || "I could not create a response. Please try again." },
      ]);
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          text: error instanceof Error ? error.message : "The Gemini chat is not connected yet. Please check deployment settings.",
          error: error instanceof Error ? error.message : "Unknown error",
        },
      ]);
    } finally {
      setTyping(false);
    }
  };

  const handleJump = (id) => {
    setOpen(false);
    window.setTimeout(() => scrollToSection(id), 80);
  };

  return (
    <div className="portfolio-chatbot" aria-live="polite">
      {open && (
        <section className="chat-panel" aria-label="Portfolio chatbot">
          <header className="chat-header">
            <div>
              <div className="chat-eyebrow">AI Assistant</div>
              <h2>Ask About Ali</h2>
            </div>
            <button className="chat-icon-btn" onClick={() => setOpen(false)} aria-label="Close chatbot">
              x
            </button>
          </header>

          <div className="chat-messages" ref={listRef}>
            {messages.map((message, index) => (
              <div
                className={`chat-message ${message.role === "user" ? "user" : "bot"}`}
                key={`${message.role}-${index}`}
                title={message.error || undefined}
              >
                {message.text}
              </div>
            ))}
            {typing && <div className="chat-message bot">Thinking...</div>}
          </div>

          <div className="chat-quick-actions">
            {QUICK_PROMPTS.map((prompt) => (
              <button key={prompt} onClick={() => sendMessage(prompt)}>
                {prompt}
              </button>
            ))}
          </div>

          <div className="chat-jumps">
            <button onClick={() => handleJump("projects")}>Projects</button>
            <button onClick={() => handleJump("skills")}>Skills</button>
            <button onClick={() => handleJump("contact")}>Contact</button>
          </div>

          <form
            className="chat-form"
            onSubmit={(event) => {
              event.preventDefault();
              sendMessage();
            }}
          >
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask about projects, skills, contact..."
              aria-label="Message"
              disabled={typing}
            />
            <button type="submit" aria-label="Send message" disabled={typing}>
              {typing ? "Wait" : "Send"}
            </button>
          </form>
        </section>
      )}

      <button
        className="chat-launcher"
        onClick={() => setOpen((value) => !value)}
        aria-label={open ? "Close chatbot" : "Open chatbot"}
      >
        <span>{open ? "x" : "AI"}</span>
      </button>
    </div>
  );
}
