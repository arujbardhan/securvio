import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Bot, User, ArrowRight, Sparkles } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface ChatBotProps {
  isOpen: boolean;
  onToggle: () => void;
}

const quickLinks = [
  { label: "View Services", href: "#services" },
  { label: "DevSecOps Integration", href: "#devsecops" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Contact Us", href: "mailto:a.bardhan2004@gmail.com" },
];

const suggestedQuestions = [
  "What are the best practices for API security?",
  "How do I implement secure authentication?",
  "What is DevSecOps?",
  "How can I protect against SQL injection?",
];

// Simulated AI responses for demo
const getAIResponse = (question: string): string => {
  const lowerQuestion = question.toLowerCase();
  
  if (lowerQuestion.includes("api security") || lowerQuestion.includes("api")) {
    return "Great question! Here are key API security best practices:\n\n• **Authentication**: Use OAuth 2.0 or JWT tokens\n• **Rate Limiting**: Prevent abuse with request limits\n• **Input Validation**: Sanitize all inputs\n• **HTTPS**: Always encrypt data in transit\n• **API Keys**: Rotate regularly and never expose in client code\n\nWant me to elaborate on any of these? You can also check our [Services](#services) for a comprehensive security assessment.";
  }
  
  if (lowerQuestion.includes("authentication") || lowerQuestion.includes("auth")) {
    return "For secure authentication, I recommend:\n\n• **Multi-Factor Authentication (MFA)**: Add a second layer beyond passwords\n• **Password Policies**: Enforce strong passwords, use bcrypt for hashing\n• **Session Management**: Secure cookies, short expiration times\n• **OAuth 2.0/OIDC**: For third-party authentication\n\nOur [DevSecOps Integration](#devsecops) can help automate security checks in your auth flow.";
  }
  
  if (lowerQuestion.includes("devsecops")) {
    return "DevSecOps integrates security into every phase of development:\n\n• **Shift Left**: Catch vulnerabilities early in the SDLC\n• **Automation**: Security scans in CI/CD pipelines\n• **Continuous Monitoring**: Real-time threat detection\n• **Collaboration**: Security is everyone's responsibility\n\nCheck out our [DevSecOps section](#devsecops) to learn how we integrate security into your workflow!";
  }
  
  if (lowerQuestion.includes("sql injection") || lowerQuestion.includes("injection")) {
    return "To prevent SQL injection:\n\n• **Parameterized Queries**: Never concatenate user input\n• **ORM Usage**: Use frameworks like Prisma, Sequelize\n• **Input Validation**: Whitelist allowed characters\n• **Least Privilege**: DB accounts with minimal permissions\n• **WAF**: Web Application Firewall for additional protection\n\nNeed a security assessment? [Contact us](mailto:a.bardhan2004@gmail.com)!";
  }
  
  return "Thanks for your question! As an AI security consultant, I can help with:\n\n• Security best practices and frameworks\n• DevSecOps implementation strategies\n• Compliance guidance (SOC 2, GDPR, HIPAA)\n• Vulnerability assessment approaches\n\nCould you provide more details about your specific security concern? Or explore our [Services](#services) to see how we can help!";
};

const ChatBot = ({ isOpen, onToggle }: ChatBotProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "👋 Hi! I'm Securvio, your AI security consultant. Ask me anything about security best practices, DevSecOps, compliance, or explore our resources below!",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: getAIResponse(input),
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleQuickQuestion = (question: string) => {
    setInput(question);
    setTimeout(() => handleSend(), 100);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        onClick={onToggle}
        className={`fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-glow-lg transition-all duration-300 ${
          isOpen
            ? "bg-secondary text-foreground scale-90"
            : "bg-primary text-primary-foreground animate-glow-pulse hover:scale-110"
        }`}
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-3rem)] h-[600px] max-h-[calc(100vh-8rem)] glass-card border-primary/30 flex flex-col animate-fade-up shadow-glow-lg">
          {/* Header */}
          <div className="p-4 border-b border-border/50 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-display font-semibold">Securvio AI</h3>
              <p className="text-xs text-muted-foreground">Your security consultant</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}
              >
                <div
                  className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-foreground"
                  }`}
                >
                  {message.role === "user" ? (
                    <User className="w-4 h-4" />
                  ) : (
                    <Bot className="w-4 h-4" />
                  )}
                </div>
                <div
                  className={`max-w-[80%] p-3 rounded-xl text-sm leading-relaxed ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-sm"
                      : "bg-secondary text-foreground rounded-bl-sm"
                  }`}
                  dangerouslySetInnerHTML={{
                    __html: message.content
                      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-primary underline">$1</a>')
                      .replace(/\n/g, "<br />"),
                  }}
                />
              </div>
            ))}
            
            {isTyping && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-secondary p-3 rounded-xl rounded-bl-sm">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                    <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-100" />
                    <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Links */}
          <div className="px-4 py-2 border-t border-border/50">
            <p className="text-xs text-muted-foreground mb-2">Quick links:</p>
            <div className="flex flex-wrap gap-2">
              {quickLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => link.href.startsWith("#") && onToggle()}
                  className="text-xs px-2 py-1 rounded bg-secondary hover:bg-secondary/80 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Suggested Questions */}
          {messages.length === 1 && (
            <div className="px-4 py-2 border-t border-border/50">
              <p className="text-xs text-muted-foreground mb-2">Try asking:</p>
              <div className="flex flex-wrap gap-2">
                {suggestedQuestions.map((q) => (
                  <button
                    key={q}
                    onClick={() => handleQuickQuestion(q)}
                    className="text-xs px-2 py-1 rounded bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-left"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-border/50">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask a security question..."
                className="flex-1 px-4 py-2 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:border-primary/50 transition-colors"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className="p-2 bg-primary text-primary-foreground rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;
