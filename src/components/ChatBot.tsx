import { useState, useRef, useEffect, useMemo } from "react";
import { MessageSquare, X, Send, Bot, User, Sparkles } from "lucide-react";
import DOMPurify from "dompurify";

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
  "What is the CFAA?",
  "Tell me about US cybersecurity laws",
  "How do I protect against ransomware?",
  "What is HIPAA compliance?",
];

// Greeting patterns
const greetingPatterns = [
  "hello", "hi", "hey", "greetings", "good morning", "good afternoon", 
  "good evening", "howdy", "what's up", "whats up", "sup", "yo", "hola"
];

const isGreeting = (text: string): boolean => {
  const lower = text.toLowerCase().trim();
  return greetingPatterns.some(greeting => 
    lower === greeting || 
    lower.startsWith(greeting + " ") || 
    lower.startsWith(greeting + "!") ||
    lower.startsWith(greeting + ",")
  );
};

// Common typo corrections and synonyms mapping
const typoCorrections: Record<string, string[]> = {
  "hipaa": ["hippa", "hipa", "hipaa", "hippa", "hepa", "hpaa", "hippa"],
  "cfaa": ["cfaa", "cfa", "cffa", "cfaaa", "cfaa"],
  "ecpa": ["ecpa", "epa", "ecpaa", "eca"],
  "glba": ["glba", "glb", "glbaa", "gramm"],
  "gdpr": ["gdpr", "gdrp", "gdp", "gpr"],
  "phishing": ["phishing", "phising", "fishing", "phising", "phissing"],
  "ransomware": ["ransomware", "ransom", "ransomeware", "ransonware"],
  "malware": ["malware", "malwear", "malwere", "malaware"],
  "authentication": ["authentication", "auth", "authetication", "authentification"],
  "authorization": ["authorization", "authorisation", "auth"],
  "vulnerability": ["vulnerability", "vulnerabilities", "vulnurability", "vulnarability"],
  "encryption": ["encryption", "encription", "encrytion"],
  "firewall": ["firewall", "firwall", "firewal"],
  "penetration": ["penetration", "pentest", "pen test", "pentesting", "penetation"],
  "compliance": ["compliance", "complience", "compliace"],
  "devsecops": ["devsecops", "dev sec ops", "devsecop", "dev-sec-ops"],
  "sql injection": ["sql injection", "sql injections", "sqli", "sql inject"],
  "ddos": ["ddos", "dos", "ddoss", "denial of service"],
  "soc 2": ["soc 2", "soc2", "soc-2", "sock 2", "soc two"],
  "identity theft": ["identity theft", "id theft", "identy theft"],
  "cybersecurity": ["cybersecurity", "cyber security", "cyber-security", "cybersecuirty"],
  "security": ["security", "secutiry", "secuirty", "securty"],
};

// Fuzzy match score using Levenshtein-like approach
const fuzzyMatch = (input: string, target: string): boolean => {
  const inputLower = input.toLowerCase();
  const targetLower = target.toLowerCase();
  
  // Exact match
  if (inputLower.includes(targetLower)) return true;
  
  // Check character similarity (simple fuzzy)
  const minLength = Math.min(inputLower.length, targetLower.length);
  if (minLength < 3) return inputLower === targetLower;
  
  let matches = 0;
  for (let i = 0; i < minLength; i++) {
    if (inputLower[i] === targetLower[i]) matches++;
  }
  
  // 70% similarity threshold
  return matches / targetLower.length > 0.7;
};

// Normalize text with typo corrections
const normalizeText = (text: string): string => {
  let normalized = text.toLowerCase();
  
  for (const [correct, typos] of Object.entries(typoCorrections)) {
    for (const typo of typos) {
      if (normalized.includes(typo) || fuzzyMatch(normalized, typo)) {
        normalized = normalized.replace(new RegExp(typo, 'gi'), correct);
      }
    }
  }
  
  return normalized;
};

// Check if the question is related to cybersecurity (with fuzzy matching)
const isCybersecurityRelated = (text: string): boolean => {
  const normalized = normalizeText(text);
  const cybersecurityKeywords = [
    "security", "cyber", "hack", "vulnerability", "threat", "attack", "malware",
    "ransomware", "phishing", "breach", "encryption", "firewall", "password",
    "authentication", "authorization", "compliance", "gdpr", "hipaa", "soc",
    "pci", "iso", "nist", "cfaa", "ecpa", "glba", "privacy", "data protection",
    "penetration", "audit", "risk", "incident", "forensic", "intrusion",
    "ddos", "dos", "sql injection", "xss", "csrf", "api", "oauth", "jwt",
    "zero trust", "siem", "soc", "devsecops", "secure", "protect", "defense",
    "law", "legal", "regulation", "legislation", "federal", "statute", "act",
    "identity theft", "fraud", "wire fraud", "espionage", "trade secret",
    "ftc", "sec", "fbi", "cisa", "network", "endpoint", "cloud security",
    "vulnerability", "patch", "update", "backup", "disaster recovery",
    "business continuity", "access control", "mfa", "2fa", "biometric",
    "certificate", "ssl", "tls", "https", "vpn", "iam", "pam", "sso",
    "securvio", "services", "contact", "help", "consultant", "assessment",
    "tell me more", "explain", "what about", "how about", "can you"
  ];
  return cybersecurityKeywords.some(keyword => normalized.includes(keyword));
};

// Extract topic from conversation history for context
const extractConversationContext = (messages: Message[]): string[] => {
  const topics: string[] = [];
  const topicKeywords: Record<string, string[]> = {
    "hipaa": ["hipaa", "health", "phi", "healthcare"],
    "cfaa": ["cfaa", "computer fraud", "abuse act"],
    "ecpa": ["ecpa", "electronic communications", "wiretap"],
    "glba": ["glba", "gramm", "financial"],
    "gdpr": ["gdpr", "european", "data protection regulation"],
    "phishing": ["phishing", "email scam"],
    "ransomware": ["ransomware", "ransom", "malware"],
    "authentication": ["authentication", "auth", "login", "password"],
    "devsecops": ["devsecops", "dev sec ops", "pipeline"],
    "penetration": ["penetration", "pentest", "pen test"],
    "sql injection": ["sql injection", "sqli", "injection"],
    "ddos": ["ddos", "denial of service"],
    "soc 2": ["soc 2", "soc2"],
    "compliance": ["compliance", "compliant", "regulation"],
    "api": ["api", "rest", "endpoint"],
  };
  
  for (const message of messages) {
    const normalized = normalizeText(message.content);
    for (const [topic, keywords] of Object.entries(topicKeywords)) {
      if (keywords.some(kw => normalized.includes(kw)) && !topics.includes(topic)) {
        topics.push(topic);
      }
    }
  }
  
  return topics;
};

// Simulated AI responses for demo with conversation context
const getAIResponse = (question: string, conversationHistory: Message[]): string => {
  const normalizedQuestion = normalizeText(question);
  const contextTopics = extractConversationContext(conversationHistory);
  
  // Handle greetings
  if (isGreeting(question)) {
    const greetings = [
      "Hello! 👋 Welcome to Securvio! I'm your AI security consultant, here to help with cybersecurity questions, compliance guidance, and security best practices. How can I assist you today?",
      "Hi there! 👋 Great to see you! I'm Securvio, your cybersecurity assistant. I can help you with security best practices, US cybersecurity laws, DevSecOps, and more. What would you like to know?",
      "Hey! 👋 Welcome! I'm here to help with all things cybersecurity - from compliance frameworks to threat prevention. What's on your mind?",
      "Greetings! 👋 I'm Securvio, your dedicated security consultant. Whether you need help with CFAA compliance, security assessments, or DevSecOps integration, I'm here to help!"
    ];
    return greetings[Math.floor(Math.random() * greetings.length)];
  }
  
  // Handle follow-up questions with conversation context
  const followUpPatterns = ["tell me more", "more about", "explain more", "what else", "anything else", "continue", "go on", "more details", "elaborate"];
  const isFollowUp = followUpPatterns.some(pattern => normalizedQuestion.includes(pattern));
  
  if (isFollowUp && contextTopics.length > 0) {
    const lastTopic = contextTopics[contextTopics.length - 1];
    return getTopicResponse(lastTopic, true);
  }
  
  // Handle "what about X" patterns with context
  if (normalizedQuestion.includes("what about") || normalizedQuestion.includes("how about")) {
    const topicMatch = detectTopic(normalizedQuestion);
    if (topicMatch) {
      return getTopicResponse(topicMatch, false);
    }
    // If asking "what about" without a clear topic, use conversation context
    if (contextTopics.length > 0) {
      return `Based on our conversation about **${contextTopics[contextTopics.length - 1].toUpperCase()}**, would you like me to cover:\n\n• Implementation best practices\n• Common pitfalls to avoid\n• Compliance requirements\n• Real-world examples\n\nJust let me know which aspect interests you most!`;
    }
  }
  
  // Check if question is out of scope
  if (!isCybersecurityRelated(question)) {
    return "I appreciate your question, but that's outside my area of expertise. 🔒 I'm Securvio, an AI specialized in **cybersecurity consulting**.\n\nI can help you with:\n• Security best practices & frameworks\n• US Cybersecurity laws (CFAA, ECPA, GLBA, HIPAA)\n• DevSecOps implementation\n• Compliance guidance (SOC 2, GDPR, PCI-DSS)\n• Vulnerability assessments\n• Threat prevention strategies\n\nFeel free to ask me anything related to cybersecurity!";
  }
  
  // Detect topic and return appropriate response
  const topic = detectTopic(normalizedQuestion);
  if (topic) {
    return getTopicResponse(topic, false);
  }
  
  return "Thanks for your question! As an AI security consultant, I can help with:\n\n• **US Cybersecurity Laws** (CFAA, ECPA, GLBA, HIPAA)\n• **Security best practices** and frameworks\n• **DevSecOps** implementation strategies\n• **Compliance guidance** (SOC 2, GDPR, PCI-DSS)\n• **Vulnerability assessment** approaches\n• **Threat prevention** strategies\n\nCould you provide more details about your specific security concern? Or explore our [Services](#services) to see how we can help!";
};

// Detect the main topic from normalized text
const detectTopic = (text: string): string | null => {
  const topicPatterns: [string, string[]][] = [
    ["cfaa", ["cfaa", "computer fraud", "computer abuse", "abuse act"]],
    ["ecpa", ["ecpa", "electronic communications privacy", "wiretap", "stored communications"]],
    ["glba", ["glba", "gramm-leach-bliley", "gramm leach bliley", "financial privacy"]],
    ["hipaa", ["hipaa", "health insurance portability", "healthcare compliance", "phi", "protected health"]],
    ["us_laws", ["us law", "federal law", "cybersecurity law", "legislation", "regulation", "cyber law"]],
    ["phishing", ["phishing", "phish", "email scam", "spear phishing"]],
    ["ransomware", ["ransomware", "ransom", "malware", "virus", "trojan"]],
    ["identity_theft", ["identity theft", "identity fraud", "id theft", "stolen identity"]],
    ["ddos", ["ddos", "denial of service", "dos attack", "distributed denial"]],
    ["penetration", ["penetration test", "pentest", "pen test", "ethical hacking"]],
    ["api", ["api security", "api", "rest api", "api protection"]],
    ["authentication", ["authentication", "auth", "login security", "mfa", "2fa", "multi-factor"]],
    ["devsecops", ["devsecops", "dev sec ops", "security pipeline", "cicd security"]],
    ["sql_injection", ["sql injection", "sqli", "injection attack", "database injection"]],
    ["soc2", ["soc 2", "soc2", "soc-2", "service organization"]],
    ["gdpr", ["gdpr", "general data protection", "european privacy"]],
    ["encryption", ["encryption", "encrypt", "cryptography", "aes", "rsa"]],
    ["zero_trust", ["zero trust", "zero-trust", "never trust"]],
    ["xss", ["xss", "cross site scripting", "cross-site scripting"]],
    ["csrf", ["csrf", "cross site request", "request forgery"]],
  ];
  
  for (const [topic, patterns] of topicPatterns) {
    if (patterns.some(pattern => text.includes(pattern))) {
      return topic;
    }
  }
  
  return null;
};

// Get response for a specific topic
const getTopicResponse = (topic: string, isFollowUp: boolean): string => {
  const responses: Record<string, { main: string; followUp: string }> = {
    cfaa: {
      main: "The **Computer Fraud and Abuse Act (CFAA)**, 18 U.S.C. § 1030, is the primary federal statute for prosecuting cybercrime:\n\n**Key Prohibitions:**\n• **Unauthorized access** to computers with national security info (up to 10 years imprisonment)\n• **Exceeding authorized access** to obtain information (up to 1 year)\n• **Accessing government computers** without authorization (up to 1 year)\n• **Fraud through computer access** (up to 5 years)\n• **Intentional damage** to computers (up to 5-10 years)\n• **Password trafficking** (up to 1 year)\n• **Cyber-extortion** (up to 5 years)\n\n**Important:** After *Van Buren v. U.S.* (2020), CFAA no longer applies to insider threats.\n\nNeed help with CFAA compliance? Check our [Services](#services)!",
      followUp: "**More on CFAA:**\n\n**Civil Remedies:**\n• Private parties can sue for damages\n• Injunctive relief available\n• Attorney fees may be recovered\n\n**Key Cases:**\n• *Van Buren v. U.S.* (2020) - Narrowed \"exceeds authorized access\"\n• *hiQ Labs v. LinkedIn* - Public data scraping\n\n**Compliance Tips:**\n• Clear access policies for employees\n• Written authorization for testing\n• Regular access reviews\n\nWant details on any specific aspect?"
    },
    ecpa: {
      main: "The **Electronic Communications Privacy Act (ECPA)** protects communications in storage and transit:\n\n**Title I - Wiretap Act:**\n• Prohibits intentional interception of electronic communications\n• Exceptions for law enforcement and service providers\n• Penalties: up to 5 years imprisonment\n\n**Title II - Stored Communications Act (SCA):**\n• Protects emails and stored data\n• Prohibits unauthorized access to electronic communication services\n• Penalties: up to 1-10 years for violations\n\n**Title III - Pen Register Act:**\n• Regulates collection of metadata\n• Requires court orders for pen registers/trap-and-trace devices\n\nThis law is crucial for email privacy and electronic surveillance compliance. [Contact us](mailto:a.bardhan2004@gmail.com) for guidance!",
      followUp: "**More on ECPA:**\n\n**Employer Considerations:**\n• May monitor company systems with proper notice\n• Employee consent requirements vary by state\n• Document monitoring policies clearly\n\n**Service Provider Exceptions:**\n• Can access communications for system protection\n• Must comply with valid legal requests\n\n**Recent Developments:**\n• Cloud storage implications\n• International data requests\n\nNeed more details on a specific aspect?"
    },
    glba: {
      main: "The **Gramm-Leach-Bliley Act (GLBA)** applies to financial institutions:\n\n**Key Requirements:**\n• **Safeguards Rule**: Implement written security policies\n• **Privacy Rule**: Provide privacy notices to customers\n• **Pretexting Protection**: Prohibit obtaining customer info through false pretenses\n\n**Security Requirements:**\n• Designate security coordinator\n• Conduct risk assessments\n• Implement safeguards for customer data\n• Oversee service provider security\n• Evaluate and adjust security programs\n\n**Applies to:** Banks, securities firms, insurance companies, and other financial services.\n\nNeed GLBA compliance help? View our [Services](#services)!",
      followUp: "**More on GLBA Compliance:**\n\n**Safeguards Rule Updates (2023):**\n• Periodic risk assessments required\n• Multi-factor authentication mandated\n• Encryption of customer data\n• Change management procedures\n\n**Privacy Notice Requirements:**\n• Initial and annual notices\n• Opt-out rights for information sharing\n• Clear, conspicuous format\n\nWant help with implementation?"
    },
    hipaa: {
      main: "**HIPAA** (Health Insurance Portability and Accountability Act) protects healthcare data:\n\n**Security Rule Requirements:**\n• **Administrative Safeguards**: Security management, workforce training, incident procedures\n• **Physical Safeguards**: Facility access controls, workstation security\n• **Technical Safeguards**: Access controls, audit controls, encryption, integrity controls\n\n**Key Provisions:**\n• Protect Protected Health Information (PHI)\n• Breach notification within 60 days\n• Business Associate Agreements required\n• Penalties: $100-$50,000 per violation (up to $1.5M annually)\n\n**Covered Entities:** Healthcare providers, health plans, clearinghouses.\n\nNeed HIPAA compliance guidance? [Contact us](mailto:a.bardhan2004@gmail.com)!",
      followUp: "**More on HIPAA:**\n\n**Common Violations:**\n• Unauthorized PHI access by employees\n• Lost/stolen unencrypted devices\n• Improper disposal of records\n• Lack of risk assessments\n\n**Breach Response:**\n• Individual notification within 60 days\n• HHS notification (varies by size)\n• Media notification if 500+ affected\n\n**Tips for Compliance:**\n• Annual security training\n• Encrypted communications\n• Regular access audits\n\nNeed help with any specific area?"
    },
    us_laws: {
      main: "**Key US Cybersecurity Laws:**\n\n• **CFAA** (Computer Fraud and Abuse Act): Primary federal cybercrime statute\n• **ECPA** (Electronic Communications Privacy Act): Protects electronic communications\n• **GLBA** (Gramm-Leach-Bliley Act): Financial sector security requirements\n• **HIPAA**: Healthcare data protection\n• **SOX** (Sarbanes-Oxley): Public company IT controls\n• **FISMA**: Federal information security management\n• **CISA**: Cybersecurity Information Sharing Act\n\n**Regulatory Bodies:**\n• **FTC**: Enforces security under Section 5\n• **SEC**: Cybersecurity disclosure requirements\n• **CISA**: Federal cybersecurity coordination\n\n**State Laws:** Most states have data breach notification laws and computer crime statutes.\n\nAsk me about any specific law for details!",
      followUp: "**More on US Cybersecurity Framework:**\n\n**Sector-Specific Laws:**\n• **FERPA**: Educational records\n• **COPPA**: Children's online privacy\n• **FCRA**: Consumer credit information\n• **CCPA/CPRA**: California privacy rights\n\n**Enforcement Trends:**\n• Increased FTC actions\n• SEC cyber disclosure rules\n• State AG enforcement rising\n\nWhich area would you like to explore?"
    },
    phishing: {
      main: "**Phishing** is a criminal offense under multiple US laws:\n\n**Legal Framework:**\n• **CFAA** 18 U.S.C. § 1030(a)(5)(A): Intentional damage\n• **Wire Fraud** 18 U.S.C. § 1343: Up to 20 years imprisonment\n• **California Anti-Phishing Act of 2005**: State-level protections\n\n**Prevention Best Practices:**\n• Employee security awareness training\n• Email filtering and authentication (SPF, DKIM, DMARC)\n• Multi-factor authentication\n• Phishing simulation exercises\n• Incident response procedures\n\n**If You're Targeted:**\n• Report to IT security immediately\n• Don't click suspicious links\n• Report to FBI's IC3 (Internet Crime Complaint Center)\n\nNeed phishing protection assessment? Check our [Services](#services)!",
      followUp: "**More on Phishing Prevention:**\n\n**Technical Controls:**\n• SPF, DKIM, DMARC email authentication\n• URL rewriting and sandboxing\n• Browser isolation\n• DNS filtering\n\n**Human Controls:**\n• Regular training and testing\n• Clear reporting procedures\n• Reward reporting culture\n\n**Emerging Threats:**\n• AI-generated phishing\n• Voice phishing (vishing)\n• SMS phishing (smishing)\n\nWant more on any of these?"
    },
    ransomware: {
      main: "**Ransomware/Malware** attacks violate:\n\n**Legal Penalties:**\n• **CFAA** 18 U.S.C. § 1030(a)(5)(A): Up to 10 years for intentional damage\n• **Wire Fraud**: Up to 20 years imprisonment\n• **Extortion statutes**: Additional federal charges\n\n**Protection Strategies:**\n• Regular, tested backups (3-2-1 rule)\n• Network segmentation\n• Endpoint detection and response (EDR)\n• Patch management program\n• Email security gateways\n• User awareness training\n\n**If Attacked:**\n• Isolate affected systems immediately\n• Contact law enforcement (FBI, CISA)\n• Don't pay ransom without legal counsel\n• Engage incident response team\n\n[Contact us](mailto:a.bardhan2004@gmail.com) for ransomware readiness assessment!",
      followUp: "**More on Ransomware Defense:**\n\n**3-2-1 Backup Rule:**\n• 3 copies of data\n• 2 different media types\n• 1 offsite (air-gapped preferred)\n\n**Incident Response:**\n• Isolate, don't power off\n• Preserve evidence\n• Legal/insurance notification\n• Recovery from clean backups\n\n**Ransom Payment Considerations:**\n• OFAC sanctions risk\n• No guarantee of decryption\n• May fund further attacks\n\nNeed a ransomware tabletop exercise?"
    },
    identity_theft: {
      main: "**Identity Theft** is prosecuted under:\n\n**Federal Laws:**\n• **Identity Theft Penalty Enhancement Act** 18 U.S.C. § 1028: Primary statute\n• **CFAA**: When computers are used\n• **Wire Fraud**: 18 U.S.C. § 1343\n\n**Penalties:**\n• 2-year mandatory minimum for aggravated identity theft\n• Up to 15 years for basic identity theft\n• Up to 20 years if connected to other crimes\n\n**Prevention Measures:**\n• Strong access controls\n• Data minimization practices\n• Encryption of PII\n• Regular security audits\n• Employee background checks\n\nNeed identity theft protection assessment? View our [Services](#services)!",
      followUp: "**More on Identity Protection:**\n\n**Organizational Controls:**\n• Limit PII collection\n• Secure disposal procedures\n• Vendor due diligence\n• Access logging and monitoring\n\n**If Breach Occurs:**\n• Notify affected individuals\n• Offer credit monitoring\n• File with FTC/state AG\n• Document remediation\n\nWant more details on any area?"
    },
    ddos: {
      main: "**DDoS/DoS Attacks** are prosecuted under:\n\n**Legal Framework:**\n• **CFAA** 18 U.S.C. § 1030(a)(5)(A): Intentional damage\n• Penalty: Up to **10 years imprisonment**\n• State computer crime laws also apply\n\n**Protection Strategies:**\n• DDoS mitigation services (Cloudflare, AWS Shield)\n• Rate limiting and traffic analysis\n• Redundant infrastructure\n• Content Delivery Networks (CDNs)\n• Incident response planning\n\n**Response Steps:**\n• Activate DDoS mitigation\n• Document the attack\n• Report to law enforcement\n• Notify affected parties\n\nNeed DDoS protection assessment? Check our [Services](#services)!",
      followUp: "**More on DDoS Defense:**\n\n**Attack Types:**\n• Volumetric (bandwidth exhaustion)\n• Protocol (connection table)\n• Application layer (HTTP floods)\n\n**Mitigation Architecture:**\n• Edge protection\n• Anycast routing\n• Traffic scrubbing centers\n• Auto-scaling\n\n**During an Attack:**\n• Don't engage attackers\n• Preserve logs\n• Consider null routing as last resort\n\nNeed help with DDoS planning?"
    },
    penetration: {
      main: "**Penetration Testing** has important legal considerations:\n\n**⚠️ Without Authorization = Criminal:**\n• **CFAA** violations: § 1030(a)(1)-(5)\n• Up to 10 years imprisonment\n• Civil liability\n\n**Legal Penetration Testing Requires:**\n• Written authorization (Rules of Engagement)\n• Defined scope and boundaries\n• Get-out-of-jail letter\n• Liability insurance\n• Compliance with state laws\n\n**Best Practices:**\n• Clear contract terms\n• Document everything\n• Stay within scope\n• Secure communication channels\n• Detailed final reports\n\nNeed a professional penetration test? [Contact us](mailto:a.bardhan2004@gmail.com)!",
      followUp: "**More on Pen Testing:**\n\n**Types of Tests:**\n• Black box (no prior knowledge)\n• White box (full access)\n• Gray box (partial info)\n\n**Methodologies:**\n• OWASP Testing Guide\n• PTES (Penetration Testing Execution Standard)\n• NIST SP 800-115\n\n**Post-Test:**\n• Remediation guidance\n• Retest validation\n• Executive summary\n\nWant details on our pen testing services?"
    },
    api: {
      main: "Great question! Here are key API security best practices:\n\n• **Authentication**: Use OAuth 2.0 or JWT tokens\n• **Rate Limiting**: Prevent abuse with request limits\n• **Input Validation**: Sanitize all inputs\n• **HTTPS**: Always encrypt data in transit\n• **API Keys**: Rotate regularly and never expose in client code\n\nWant me to elaborate on any of these? You can also check our [Services](#services) for a comprehensive security assessment.",
      followUp: "**More on API Security:**\n\n**OWASP API Top 10:**\n• Broken Object Level Authorization\n• Broken Authentication\n• Excessive Data Exposure\n• Lack of Rate Limiting\n• Broken Function Level Authorization\n\n**Best Practices:**\n• API gateway implementation\n• Request signing\n• Schema validation\n• API versioning\n• Security testing in CI/CD\n\nNeed an API security assessment?"
    },
    authentication: {
      main: "For secure authentication, I recommend:\n\n• **Multi-Factor Authentication (MFA)**: Add a second layer beyond passwords\n• **Password Policies**: Enforce strong passwords, use bcrypt for hashing\n• **Session Management**: Secure cookies, short expiration times\n• **OAuth 2.0/OIDC**: For third-party authentication\n\nOur [DevSecOps Integration](#devsecops) can help automate security checks in your auth flow.",
      followUp: "**More on Authentication:**\n\n**MFA Options:**\n• TOTP apps (Google Authenticator)\n• Hardware keys (YubiKey)\n• Push notifications\n• Biometrics\n\n**Password Storage:**\n• bcrypt, scrypt, or Argon2\n• Never store plaintext\n• Salt each password uniquely\n\n**Session Security:**\n• HttpOnly, Secure flags\n• SameSite attribute\n• Regular rotation\n\nNeed implementation help?"
    },
    devsecops: {
      main: "DevSecOps integrates security into every phase of development:\n\n• **Shift Left**: Catch vulnerabilities early in the SDLC\n• **Automation**: Security scans in CI/CD pipelines\n• **Continuous Monitoring**: Real-time threat detection\n• **Collaboration**: Security is everyone's responsibility\n\nCheck out our [DevSecOps section](#devsecops) to learn how we integrate security into your workflow!",
      followUp: "**More on DevSecOps:**\n\n**Pipeline Security:**\n• SAST (Static Analysis)\n• DAST (Dynamic Analysis)\n• SCA (Software Composition)\n• Container scanning\n• IaC security\n\n**Culture:**\n• Security champions program\n• Blameless post-mortems\n• Security training for devs\n\n**Metrics:**\n• Mean time to remediate\n• Vulnerability escape rate\n• Security debt tracking\n\nWant help implementing DevSecOps?"
    },
    sql_injection: {
      main: "To prevent SQL injection:\n\n• **Parameterized Queries**: Never concatenate user input\n• **ORM Usage**: Use frameworks like Prisma, Sequelize\n• **Input Validation**: Whitelist allowed characters\n• **Least Privilege**: DB accounts with minimal permissions\n• **WAF**: Web Application Firewall for additional protection\n\nNeed a security assessment? [Contact us](mailto:a.bardhan2004@gmail.com)!",
      followUp: "**More on SQL Injection Prevention:**\n\n**Detection:**\n• SAST tools in CI/CD\n• DAST scanning\n• Code review checklists\n• WAF logging and alerts\n\n**If Exploited:**\n• Isolate database\n• Check for data exfiltration\n• Review all queries\n• Forensic investigation\n\n**Testing:**\n• SQLMap for authorized testing\n• Burp Suite\n• OWASP ZAP\n\nNeed more technical details?"
    },
    soc2: {
      main: "**SOC 2 Compliance** focuses on five Trust Service Criteria:\n\n• **Security**: Protection against unauthorized access\n• **Availability**: System accessibility as agreed\n• **Processing Integrity**: Accurate and timely processing\n• **Confidentiality**: Protection of confidential information\n• **Privacy**: Personal information handling\n\n**Type I vs Type II:**\n• Type I: Point-in-time assessment\n• Type II: Over a period (usually 6-12 months)\n\nNeed SOC 2 readiness assessment? View our [Services](#services)!",
      followUp: "**More on SOC 2:**\n\n**Common Controls:**\n• Access management\n• Change management\n• Risk assessment\n• Incident response\n• Vendor management\n\n**Audit Process:**\n• Readiness assessment\n• Gap remediation\n• Control implementation\n• Auditor engagement\n• Continuous monitoring\n\n**Cost Factors:**\n• Organization size\n• Scope of systems\n• Current maturity\n\nNeed help with SOC 2 preparation?"
    },
    gdpr: {
      main: "**GDPR** (General Data Protection Regulation) key requirements:\n\n• **Lawful Basis**: Consent, contract, legal obligation, etc.\n• **Data Subject Rights**: Access, erasure, portability\n• **Breach Notification**: 72 hours to supervisory authority\n• **Privacy by Design**: Built-in data protection\n• **DPO**: Data Protection Officer for certain organizations\n\n**Penalties:** Up to €20M or 4% of global annual revenue\n\nNeed GDPR compliance guidance? [Contact us](mailto:a.bardhan2004@gmail.com)!",
      followUp: "**More on GDPR:**\n\n**Data Subject Rights:**\n• Right to access\n• Right to rectification\n• Right to erasure\n• Right to data portability\n• Right to object\n\n**International Transfers:**\n• SCCs (Standard Contractual Clauses)\n• Adequacy decisions\n• Binding Corporate Rules\n\n**Documentation:**\n• Records of processing\n• DPIA for high-risk\n• Consent records\n\nNeed help with any specific requirement?"
    },
    encryption: {
      main: "**Encryption Best Practices:**\n\n**Data at Rest:**\n• AES-256 for symmetric encryption\n• Full disk encryption (BitLocker, FileVault)\n• Database-level encryption (TDE)\n\n**Data in Transit:**\n• TLS 1.3 minimum\n• Perfect forward secrecy\n• Certificate management\n\n**Key Management:**\n• HSM for sensitive keys\n• Regular key rotation\n• Secure key storage\n\n**Compliance Requirements:**\n• HIPAA requires encryption\n• PCI-DSS mandates it\n• GDPR recommends it\n\nNeed encryption guidance? [Contact us](mailto:a.bardhan2004@gmail.com)!",
      followUp: "**More on Encryption:**\n\n**Algorithm Selection:**\n• AES-256 (symmetric)\n• RSA-2048+ (asymmetric)\n• SHA-256+ (hashing)\n\n**Common Mistakes:**\n• Rolling own crypto\n• Weak key derivation\n• Insecure random generation\n• Key exposure in logs\n\n**Tools:**\n• OpenSSL\n• libsodium\n• AWS KMS/Azure Key Vault\n\nNeed technical implementation help?"
    },
    zero_trust: {
      main: "**Zero Trust Security Model:**\n\n**Core Principles:**\n• **Never trust, always verify**: Every request authenticated\n• **Least privilege access**: Minimum necessary permissions\n• **Assume breach**: Design for lateral movement prevention\n\n**Key Components:**\n• Identity verification (strong MFA)\n• Device health validation\n• Micro-segmentation\n• Continuous monitoring\n• Encrypted communications\n\n**Implementation:**\n• Start with identity\n• Map sensitive data flows\n• Segment networks\n• Add monitoring layers\n\nNeed help implementing Zero Trust? View our [Services](#services)!",
      followUp: "**More on Zero Trust:**\n\n**NIST SP 800-207 Framework:**\n• Policy Engine\n• Policy Administrator\n• Policy Enforcement Points\n\n**Quick Wins:**\n• Implement MFA everywhere\n• Remove VPN dependencies\n• Segment critical systems\n• Log all access attempts\n\n**Maturity Journey:**\n• Basic: Identity-focused\n• Intermediate: Device trust\n• Advanced: Full micro-segmentation\n\nWant a Zero Trust assessment?"
    },
    xss: {
      main: "**Cross-Site Scripting (XSS) Prevention:**\n\n**Types:**\n• **Stored XSS**: Malicious script saved in database\n• **Reflected XSS**: Script in URL parameters\n• **DOM-based XSS**: Client-side manipulation\n\n**Prevention:**\n• Output encoding (HTML, JS, URL)\n• Content Security Policy (CSP)\n• Input validation\n• HttpOnly cookies\n• Modern frameworks with auto-escaping\n\n**Legal Implications:**\n• CFAA violations possible\n• Privacy law implications\n• Civil liability for damages\n\nNeed XSS testing? [Contact us](mailto:a.bardhan2004@gmail.com)!",
      followUp: "**More on XSS Defense:**\n\n**CSP Implementation:**\n• default-src 'self'\n• script-src 'strict-dynamic'\n• Report-URI for monitoring\n\n**Testing:**\n• OWASP ZAP\n• Burp Suite\n• Browser DevTools\n\n**Remediation Priority:**\n• Stored XSS (highest)\n• Reflected XSS\n• DOM-based XSS\n\nNeed help with implementation?"
    },
    csrf: {
      main: "**Cross-Site Request Forgery (CSRF) Prevention:**\n\n**How It Works:**\n• Attacker tricks user into executing unwanted action\n• Leverages authenticated session\n• Can cause unauthorized transactions\n\n**Prevention:**\n• **CSRF Tokens**: Unique per-session/request\n• **SameSite Cookies**: Strict or Lax attribute\n• **Origin/Referer Validation**: Check request source\n• **Custom Headers**: For API calls\n\n**Framework Support:**\n• Most modern frameworks include protection\n• Django, Rails, Express have built-in CSRF\n\nNeed CSRF testing? Check our [Services](#services)!",
      followUp: "**More on CSRF Defense:**\n\n**Token Implementation:**\n• Synchronizer token pattern\n• Double submit cookies\n• Signed tokens (JWT-style)\n\n**API Considerations:**\n• Pre-flight checks for CORS\n• Custom headers requirement\n• Token in request body\n\n**Testing:**\n• Burp Suite CSRF PoC\n• OWASP ZAP\n• Manual verification\n\nNeed implementation guidance?"
    }
  };
  
  const response = responses[topic];
  if (response) {
    return isFollowUp ? response.followUp : response.main;
  }
  
  return "Thanks for your question! As an AI security consultant, I can help with:\n\n• **US Cybersecurity Laws** (CFAA, ECPA, GLBA, HIPAA)\n• **Security best practices** and frameworks\n• **DevSecOps** implementation strategies\n• **Compliance guidance** (SOC 2, GDPR, PCI-DSS)\n• **Vulnerability assessment** approaches\n• **Threat prevention** strategies\n\nCould you provide more details about your specific security concern? Or explore our [Services](#services) to see how we can help!";
};

// Safe URL validator - only allows http, https, mailto, and anchor links
const isValidUrl = (url: string): boolean => {
  const trimmedUrl = url.trim().toLowerCase();
  return (
    trimmedUrl.startsWith('http://') ||
    trimmedUrl.startsWith('https://') ||
    trimmedUrl.startsWith('mailto:') ||
    trimmedUrl.startsWith('#')
  );
};

// Safe markdown-like formatting with sanitization
const formatMessageContent = (content: string): string => {
  // First, escape any HTML in the content to prevent injection
  const escaped = content
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
  
  // Apply safe formatting
  const formatted = escaped
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\[(.*?)\]\((.*?)\)/g, (_, text, url) => {
      if (isValidUrl(url)) {
        const sanitizedUrl = url.replace(/"/g, '&quot;');
        return `<a href="${sanitizedUrl}" class="text-primary underline" rel="noopener noreferrer">${text}</a>`;
      }
      return text; // Return just the text if URL is invalid
    })
    .replace(/\n/g, '<br />');
  
  // Final sanitization with DOMPurify
  return DOMPurify.sanitize(formatted, {
    ALLOWED_TAGS: ['strong', 'a', 'br'],
    ALLOWED_ATTR: ['href', 'class', 'rel'],
  });
};

// Component for rendering message content safely
const MessageContent = ({ content, role }: { content: string; role: "user" | "assistant" }) => {
  const sanitizedHtml = useMemo(() => formatMessageContent(content), [content]);
  
  return (
    <div
      className={`max-w-[80%] p-3 rounded-xl text-sm leading-relaxed ${
        role === "user"
          ? "bg-primary text-primary-foreground rounded-br-sm"
          : "bg-secondary text-foreground rounded-bl-sm"
      }`}
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
    />
  );
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

    // Simulate AI response delay with conversation context
    const currentMessages = [...messages, userMessage];
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: getAIResponse(input, currentMessages),
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
                <MessageContent 
                  content={message.content} 
                  role={message.role}
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
