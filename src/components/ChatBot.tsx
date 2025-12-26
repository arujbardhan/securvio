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
  "What are the 2026 HIPAA updates?",
  "Explain SOC 2 compliance",
  "What is Zero Trust architecture?",
  "How do I protect against ransomware?",
];

// Greeting patterns for natural conversation
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

// Typo corrections and synonyms for fuzzy matching
const typoCorrections: Record<string, string[]> = {
  "hipaa": ["hippa", "hipa", "hipaa", "hepa", "hpaa", "hippa", "hippa compliance"],
  "cfaa": ["cfaa", "cfa", "cffa", "cfaaa"],
  "ecpa": ["ecpa", "epa", "ecpaa", "eca"],
  "glba": ["glba", "glb", "glbaa", "gramm"],
  "gdpr": ["gdpr", "gdrp", "gdp", "gpr"],
  "nist": ["nist", "nist framework", "nist csf", "nst"],
  "iso 27001": ["iso 27001", "iso27001", "iso-27001", "iso 27k", "iso27k"],
  "soc 2": ["soc 2", "soc2", "soc-2", "sock 2", "soc two", "soc type 2"],
  "phishing": ["phishing", "phising", "fishing", "phissing"],
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
  "identity theft": ["identity theft", "id theft", "identy theft"],
  "cybersecurity": ["cybersecurity", "cyber security", "cyber-security", "cybersecuirty"],
  "security": ["security", "secutiry", "secuirty", "securty"],
  "ai governance": ["ai governance", "ai gov", "artificial intelligence governance"],
  "zero trust": ["zero trust", "zero-trust", "zerotrust", "0 trust"],
  "phi": ["phi", "protected health information", "pii", "personal health"],
};

// Fuzzy match for typo tolerance
const fuzzyMatch = (input: string, target: string): boolean => {
  const inputLower = input.toLowerCase();
  const targetLower = target.toLowerCase();
  
  if (inputLower.includes(targetLower)) return true;
  
  const minLength = Math.min(inputLower.length, targetLower.length);
  if (minLength < 3) return inputLower === targetLower;
  
  let matches = 0;
  for (let i = 0; i < minLength; i++) {
    if (inputLower[i] === targetLower[i]) matches++;
  }
  
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

// Determine if question is within cybersecurity/compliance scope
const isInScope = (text: string): boolean => {
  const normalized = normalizeText(text);
  const scopeKeywords = [
    // Compliance frameworks
    "security", "cyber", "compliance", "gdpr", "hipaa", "soc", "soc 2", "nist", "iso",
    "pci", "pci-dss", "ferpa", "ccpa", "cpra", "glba", "ecpa", "cfaa",
    // Security concepts
    "hack", "vulnerability", "threat", "attack", "malware", "ransomware", "phishing",
    "breach", "encryption", "firewall", "password", "authentication", "authorization",
    "penetration", "audit", "risk", "incident", "forensic", "intrusion", "ddos",
    "sql injection", "xss", "csrf", "api", "oauth", "jwt", "zero trust", "siem",
    // Healthcare/AI governance
    "phi", "protected health", "ai governance", "ai security", "ai risk", "model governance",
    "healthcare", "covered entity", "business associate", "baa",
    // General security
    "devsecops", "secure", "protect", "defense", "privacy", "data protection",
    "access control", "mfa", "2fa", "biometric", "certificate", "ssl", "tls", "vpn",
    "iam", "pam", "sso", "endpoint", "cloud security", "patch", "backup",
    // Securvio context
    "securvio", "services", "contact", "help", "consultant", "assessment",
    "tell me more", "explain", "what about", "how about", "can you", "elaborate"
  ];
  return scopeKeywords.some(keyword => normalized.includes(keyword));
};

// Extract conversation context for continuity
const extractConversationContext = (messages: Message[]): string[] => {
  const topics: string[] = [];
  const topicKeywords: Record<string, string[]> = {
    "hipaa": ["hipaa", "health", "phi", "healthcare", "covered entity", "2026"],
    "soc 2": ["soc 2", "soc2", "trust service", "type 1", "type 2"],
    "gdpr": ["gdpr", "european", "data protection regulation", "dpo", "data subject"],
    "nist": ["nist", "csf", "cybersecurity framework", "800-53"],
    "iso 27001": ["iso 27001", "iso27001", "isms", "information security management"],
    "ai governance": ["ai governance", "ai risk", "model", "algorithm", "bias"],
    "zero trust": ["zero trust", "never trust", "verify"],
    "ransomware": ["ransomware", "ransom", "malware"],
    "phishing": ["phishing", "email scam", "social engineering"],
    "encryption": ["encryption", "encrypt", "cryptography", "aes"],
    "authentication": ["authentication", "mfa", "login", "password"],
    "compliance": ["compliance", "audit", "regulation", "framework"],
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

// Detect user intent for dynamic response adjustment
const detectIntent = (text: string): "education" | "implementation" | "risk" | "compliance" | "policy" | "general" => {
  const lower = text.toLowerCase();
  
  if (lower.includes("how do i") || lower.includes("how to") || lower.includes("implement") || lower.includes("set up") || lower.includes("configure")) {
    return "implementation";
  }
  if (lower.includes("risk") || lower.includes("threat") || lower.includes("vulnerable") || lower.includes("attack") || lower.includes("breach")) {
    return "risk";
  }
  if (lower.includes("comply") || lower.includes("compliance") || lower.includes("audit") || lower.includes("requirement") || lower.includes("regulation")) {
    return "compliance";
  }
  if (lower.includes("policy") || lower.includes("procedure") || lower.includes("governance") || lower.includes("framework")) {
    return "policy";
  }
  if (lower.includes("what is") || lower.includes("explain") || lower.includes("tell me about") || lower.includes("define")) {
    return "education";
  }
  
  return "general";
};

// Main AI response generator with ChatGPT-like behavior
const getAIResponse = (question: string, conversationHistory: Message[]): string => {
  const normalizedQuestion = normalizeText(question);
  const contextTopics = extractConversationContext(conversationHistory);
  const intent = detectIntent(question);
  
  // Handle greetings naturally
  if (isGreeting(question)) {
    return "Hello. I'm Securvio AI, your cybersecurity and compliance assistant.\n\nI specialize in helping healthcare and regulated organizations understand and implement security frameworks including **HIPAA**, **SOC 2**, **GDPR**, **NIST**, and **ISO 27001**.\n\nHow can I assist you today?";
  }
  
  // Handle follow-up questions with context
  const followUpPatterns = ["tell me more", "more about", "explain more", "what else", "continue", "go on", "elaborate", "more details"];
  const isFollowUp = followUpPatterns.some(pattern => normalizedQuestion.includes(pattern));
  
  if (isFollowUp && contextTopics.length > 0) {
    const lastTopic = contextTopics[contextTopics.length - 1];
    return getTopicResponse(lastTopic, true, intent);
  }
  
  // Handle "what about X" patterns with context awareness
  if (normalizedQuestion.includes("what about") || normalizedQuestion.includes("how about")) {
    const topicMatch = detectTopic(normalizedQuestion);
    if (topicMatch) {
      return getTopicResponse(topicMatch, false, intent);
    }
    if (contextTopics.length > 0) {
      return `Building on our discussion of **${contextTopics[contextTopics.length - 1].toUpperCase()}**, I can cover:\n\n- Implementation best practices\n- Common compliance gaps\n- Risk mitigation strategies\n- Documentation requirements\n\nWhich aspect would be most helpful for your situation?`;
    }
  }
  
  // Check if out of scope
  if (!isInScope(question)) {
    return "I appreciate your question, but that falls outside my area of expertise.\n\nAs Securvio AI, I focus specifically on **cybersecurity and compliance** for healthcare and regulated organizations. I can help with:\n\n- **HIPAA** compliance (including 2026 updates)\n- **SOC 2** and **ISO 27001** frameworks\n- **GDPR** and privacy regulations\n- **NIST** cybersecurity framework\n- **AI governance** and risk management\n- Security architecture and best practices\n\nFeel free to ask about any of these topics.";
  }
  
  // Detect topic and generate response
  const topic = detectTopic(normalizedQuestion);
  if (topic) {
    return getTopicResponse(topic, false, intent);
  }
  
  // Default helpful response
  return "I can help you with that. To provide the most relevant guidance, could you share a bit more context?\n\nFor example:\n- What type of organization are you (healthcare, financial, tech)?\n- Are you preparing for a specific audit or certification?\n- Is this related to a particular compliance framework?\n\nThis will help me tailor my response to your specific situation.";
};

// Topic detection with comprehensive pattern matching
const detectTopic = (text: string): string | null => {
  const topicPatterns: [string, string[]][] = [
    ["hipaa_2026", ["2026", "hipaa update", "hipaa change", "new hipaa", "hipaa rule"]],
    ["hipaa", ["hipaa", "health insurance portability", "healthcare compliance", "phi", "protected health", "covered entity", "business associate"]],
    ["soc2", ["soc 2", "soc2", "soc-2", "service organization", "trust service", "type 1", "type 2", "type i", "type ii"]],
    ["gdpr", ["gdpr", "general data protection", "european privacy", "data subject", "dpo", "right to be forgotten"]],
    ["nist", ["nist", "cybersecurity framework", "csf", "800-53", "800-171", "nist sp"]],
    ["iso27001", ["iso 27001", "iso27001", "isms", "information security management", "iso 27k"]],
    ["ai_governance", ["ai governance", "ai risk", "ai security", "model governance", "algorithm", "machine learning security", "llm security"]],
    ["zero_trust", ["zero trust", "zero-trust", "never trust", "always verify"]],
    ["ransomware", ["ransomware", "ransom", "malware", "virus", "trojan", "cryptolocker"]],
    ["phishing", ["phishing", "phish", "email scam", "spear phishing", "social engineering", "pretexting"]],
    ["encryption", ["encryption", "encrypt", "cryptography", "aes", "rsa", "tls", "ssl"]],
    ["authentication", ["authentication", "auth", "mfa", "2fa", "multi-factor", "password", "passwordless", "biometric"]],
    ["penetration", ["penetration test", "pentest", "pen test", "ethical hacking", "red team"]],
    ["devsecops", ["devsecops", "dev sec ops", "security pipeline", "cicd security", "shift left"]],
    ["access_control", ["access control", "rbac", "abac", "least privilege", "iam", "pam"]],
    ["incident_response", ["incident response", "breach", "incident", "forensic", "containment"]],
    ["risk_assessment", ["risk assessment", "risk management", "threat model", "vulnerability assessment"]],
    ["vendor_management", ["vendor", "third party", "supply chain", "vendor risk", "third-party risk"]],
    ["data_protection", ["data protection", "data privacy", "data security", "data loss", "dlp"]],
    ["cloud_security", ["cloud security", "aws security", "azure security", "gcp security", "cloud compliance"]],
  ];
  
  for (const [topic, patterns] of topicPatterns) {
    if (patterns.some(pattern => text.includes(pattern))) {
      return topic;
    }
  }
  
  return null;
};

// Generate comprehensive responses based on topic and intent
const getTopicResponse = (topic: string, isFollowUp: boolean, intent: string): string => {
  const responses: Record<string, { main: string; followUp: string }> = {
    hipaa_2026: {
      main: "**2026 HIPAA Security Rule Updates**\n\nThe Department of Health and Human Services has proposed significant updates to the HIPAA Security Rule, expected to take effect in 2026:\n\n**Key Changes:**\n\n1. **Mandatory Encryption** - Encryption of ePHI at rest and in transit will become required, not addressable\n\n2. **Enhanced Access Controls** - Multi-factor authentication will be mandatory for all systems containing ePHI\n\n3. **Asset Inventory** - Organizations must maintain comprehensive technology asset inventories\n\n4. **Network Segmentation** - Required segmentation between systems containing ePHI and other networks\n\n5. **Annual Risk Assessments** - Formal risk assessments required annually (previously \"periodic\")\n\n6. **Incident Response Testing** - Annual testing of incident response and contingency plans\n\n**Practical Takeaway:** Organizations should begin gap assessments now, as these changes will require significant infrastructure and policy updates. The compliance timeline is expected to be 180 days after final rule publication.\n\n*Note: These rules are still in proposed form. I recommend monitoring HHS announcements for final requirements.*",
      followUp: "**Additional 2026 HIPAA Details:**\n\n**Documentation Requirements:**\n- Written policies for all security controls\n- Evidence of annual reviews\n- Audit logs retained for at least 6 years\n\n**Vendor Obligations:**\n- Business Associate Agreements must be updated\n- Vendors must demonstrate equivalent security controls\n- Annual compliance attestations may be required\n\n**Preparation Steps:**\n1. Conduct current-state gap analysis\n2. Inventory all systems with ePHI access\n3. Evaluate encryption capabilities\n4. Review MFA deployment status\n5. Budget for necessary upgrades\n\nWould you like guidance on any specific preparation area?"
    },
    hipaa: {
      main: "**HIPAA Compliance Overview**\n\nHIPAA (Health Insurance Portability and Accountability Act) establishes national standards for protecting sensitive patient health information.\n\n**Core Requirements:**\n\n**Privacy Rule:**\n- Limits use and disclosure of Protected Health Information (PHI)\n- Requires minimum necessary standard\n- Grants patients access rights to their records\n\n**Security Rule:**\n- Administrative safeguards (security management, training, access management)\n- Physical safeguards (facility access, workstation security)\n- Technical safeguards (access controls, audit logs, encryption)\n\n**Breach Notification Rule:**\n- Individual notification within 60 days\n- HHS notification (timing varies by breach size)\n- Media notification if 500+ individuals affected\n\n**Who Must Comply:**\n- Covered Entities (providers, health plans, clearinghouses)\n- Business Associates (vendors with PHI access)\n\n**Practical Takeaway:** Start with a thorough risk assessment to identify gaps, then prioritize controls based on risk level and available resources.",
      followUp: "**Common HIPAA Compliance Gaps:**\n\n1. **Incomplete Risk Assessments** - Many organizations skip annual reviews or lack documentation\n\n2. **Insufficient Access Controls** - Users with more access than their role requires\n\n3. **Missing BAAs** - Business Associate Agreements not in place for all vendors\n\n4. **Inadequate Training** - Security awareness training not conducted annually\n\n5. **Weak Audit Logging** - Access logs not reviewed or retained properly\n\n**Penalty Tiers (per violation):**\n- Tier 1: $100-$50,000 (lack of knowledge)\n- Tier 2: $1,000-$50,000 (reasonable cause)\n- Tier 3: $10,000-$50,000 (willful neglect, corrected)\n- Tier 4: $50,000 (willful neglect, not corrected)\n\nAnnual cap: $1.5 million per category\n\nWhich aspect would you like to explore further?"
    },
    soc2: {
      main: "**SOC 2 Compliance Overview**\n\nSOC 2 (Service Organization Control 2) is an auditing framework developed by the AICPA, widely used by technology and SaaS companies to demonstrate security practices.\n\n**Trust Service Criteria:**\n\n1. **Security** (required) - Protection against unauthorized access\n2. **Availability** - System accessibility as agreed in contracts\n3. **Processing Integrity** - Accurate, complete, timely processing\n4. **Confidentiality** - Protection of confidential information\n5. **Privacy** - Personal information handling practices\n\n**Report Types:**\n\n- **Type I** - Point-in-time assessment of control design\n- **Type II** - Assessment of control effectiveness over 3-12 months\n\n**Common Controls:**\n- Access management and authentication\n- Change management procedures\n- Incident response processes\n- Vendor management\n- Data backup and recovery\n\n**Practical Takeaway:** Most customers and prospects require Type II reports. Plan for a 3-6 month observation period after implementing controls before your audit.",
      followUp: "**SOC 2 Implementation Roadmap:**\n\n**Phase 1: Readiness (4-8 weeks)**\n- Define scope and criteria\n- Gap assessment against trust services\n- Remediation planning\n\n**Phase 2: Implementation (8-16 weeks)**\n- Deploy required controls\n- Document policies and procedures\n- Implement monitoring and logging\n\n**Phase 3: Observation (3-12 months)**\n- Operate controls consistently\n- Collect evidence\n- Conduct internal reviews\n\n**Phase 4: Audit (4-6 weeks)**\n- Auditor testing\n- Evidence collection\n- Report generation\n\n**Estimated Timeline:** 6-12 months for first Type II report\n\n**Cost Factors:**\n- Organization size and complexity\n- Number of trust criteria included\n- Current security maturity\n- Auditor selection\n\nWould you like details on any specific phase?"
    },
    gdpr: {
      main: "**GDPR Compliance Overview**\n\nThe General Data Protection Regulation is the EU's comprehensive data privacy law, applicable to any organization processing EU residents' personal data.\n\n**Key Principles:**\n\n1. **Lawfulness** - Valid legal basis required for processing\n2. **Purpose Limitation** - Data used only for stated purposes\n3. **Data Minimization** - Collect only what's necessary\n4. **Accuracy** - Keep data current and correct\n5. **Storage Limitation** - Retain only as long as needed\n6. **Integrity and Confidentiality** - Appropriate security measures\n7. **Accountability** - Demonstrate compliance\n\n**Data Subject Rights:**\n- Right to access\n- Right to rectification\n- Right to erasure (\"right to be forgotten\")\n- Right to data portability\n- Right to object\n\n**Breach Notification:**\n- Supervisory authority: 72 hours\n- Affected individuals: \"without undue delay\" if high risk\n\n**Penalties:** Up to 20 million euros or 4% of annual global revenue, whichever is higher.\n\n**Practical Takeaway:** Start with data mapping to understand what personal data you collect, where it flows, and what legal basis applies to each processing activity.",
      followUp: "**GDPR Implementation Steps:**\n\n1. **Data Mapping**\n   - Identify all personal data categories\n   - Document data flows and processing activities\n   - Identify legal basis for each activity\n\n2. **Privacy Documentation**\n   - Privacy notices for each collection point\n   - Records of processing activities\n   - Data Protection Impact Assessments (where required)\n\n3. **Technical Controls**\n   - Encryption and pseudonymization\n   - Access controls\n   - Data retention automation\n\n4. **Organizational Measures**\n   - DPO appointment (if required)\n   - Staff training\n   - Vendor agreements (Data Processing Agreements)\n\n5. **Rights Management**\n   - Processes to handle data subject requests\n   - 30-day response timeline\n\n**International Transfers:**\n- Standard Contractual Clauses (SCCs)\n- Binding Corporate Rules (for corporate groups)\n- Adequacy decisions\n\nWhat specific area would you like to explore?"
    },
    nist: {
      main: "**NIST Cybersecurity Framework Overview**\n\nThe NIST CSF is a voluntary framework providing a common language for managing cybersecurity risk. It's widely adopted across industries and often required for federal contractors.\n\n**Five Core Functions:**\n\n1. **Identify** - Asset management, risk assessment, governance\n2. **Protect** - Access control, training, data security\n3. **Detect** - Continuous monitoring, detection processes\n4. **Respond** - Response planning, communications, mitigation\n5. **Recover** - Recovery planning, improvements, communications\n\n**Implementation Tiers:**\n- Tier 1: Partial (ad hoc, reactive)\n- Tier 2: Risk Informed (awareness, limited practice)\n- Tier 3: Repeatable (formal policies, consistent)\n- Tier 4: Adaptive (continuous improvement, proactive)\n\n**CSF 2.0 Updates (2024):**\n- Added \"Govern\" as sixth function\n- Enhanced supply chain risk management\n- Improved metrics and measurement guidance\n\n**Practical Takeaway:** Use the framework to establish a common security language across your organization and as a foundation for communicating with leadership about risk.",
      followUp: "**NIST Implementation Approach:**\n\n**Step 1: Prioritize and Scope**\n- Identify business objectives\n- Determine critical systems and data\n- Define implementation scope\n\n**Step 2: Orient**\n- Identify existing security practices\n- Understand regulatory requirements\n- Map current state to framework\n\n**Step 3: Create Current Profile**\n- Assess current function outcomes\n- Document control status\n- Identify gaps\n\n**Step 4: Conduct Risk Assessment**\n- Analyze threats and vulnerabilities\n- Determine likelihood and impact\n- Prioritize risks\n\n**Step 5: Create Target Profile**\n- Define desired outcomes\n- Set improvement priorities\n- Align with business needs\n\n**Step 6: Implement Action Plan**\n- Address priority gaps\n- Allocate resources\n- Track progress\n\n**Related NIST Publications:**\n- SP 800-53: Security controls catalog\n- SP 800-171: CUI protection\n- SP 800-37: Risk management framework\n\nWhich aspect would be most helpful to explore further?"
    },
    iso27001: {
      main: "**ISO 27001 Overview**\n\nISO 27001 is the international standard for Information Security Management Systems (ISMS). Certification demonstrates a systematic approach to managing sensitive information.\n\n**Key Components:**\n\n1. **Context of the Organization** - Understanding internal/external factors\n2. **Leadership** - Management commitment and policy\n3. **Planning** - Risk assessment and treatment\n4. **Support** - Resources, competence, awareness\n5. **Operation** - Implementing risk treatment plans\n6. **Performance Evaluation** - Monitoring, audit, review\n7. **Improvement** - Nonconformity handling, continual improvement\n\n**Annex A Controls (93 controls in 4 themes):**\n- Organizational controls\n- People controls\n- Physical controls\n- Technological controls\n\n**Certification Process:**\n- Stage 1: Documentation review\n- Stage 2: Implementation audit\n- Annual surveillance audits\n- Recertification every 3 years\n\n**Practical Takeaway:** ISO 27001 provides structure for security programs. The Statement of Applicability (SoA) is your key document linking selected controls to identified risks.",
      followUp: "**ISO 27001 Implementation Timeline:**\n\n**Phase 1: Gap Assessment (4-6 weeks)**\n- Current state analysis\n- Risk assessment methodology\n- Scope definition\n\n**Phase 2: ISMS Development (8-12 weeks)**\n- Policy and procedure creation\n- Risk assessment execution\n- Statement of Applicability\n\n**Phase 3: Implementation (12-24 weeks)**\n- Control deployment\n- Training and awareness\n- Evidence collection\n\n**Phase 4: Internal Audit (2-4 weeks)**\n- Audit planning\n- Findings and remediation\n- Management review\n\n**Phase 5: Certification (4-8 weeks)**\n- Stage 1 audit\n- Remediation (if needed)\n- Stage 2 audit\n\n**Estimated Total: 9-18 months**\n\n**Integration Opportunities:**\n- ISO 27017: Cloud security\n- ISO 27018: Cloud privacy\n- ISO 27701: Privacy management\n\nWould you like details on any specific phase?"
    },
    ai_governance: {
      main: "**AI Governance and Security**\n\nAs organizations adopt AI and machine learning, governance frameworks are emerging to manage associated risks.\n\n**Key Risk Areas:**\n\n1. **Data Quality and Bias** - Training data issues leading to unfair outcomes\n2. **Privacy** - Personal data in training sets and model outputs\n3. **Security** - Model theft, adversarial attacks, prompt injection\n4. **Transparency** - Explainability of decisions affecting individuals\n5. **Accountability** - Responsibility for AI-driven decisions\n\n**Emerging Frameworks:**\n\n- **EU AI Act** - Risk-based regulation (prohibited, high-risk, limited, minimal)\n- **NIST AI RMF** - Risk management framework for AI systems\n- **ISO 42001** - AI management system standard\n- **IEEE 7000** - Ethical design for autonomous systems\n\n**Healthcare-Specific Concerns:**\n- AI/ML as medical devices (FDA oversight)\n- Clinical decision support risk levels\n- PHI in training data\n\n**Practical Takeaway:** Establish AI governance policies before deploying AI systems. Include risk assessment, human oversight requirements, and monitoring for drift and bias.",
      followUp: "**AI Governance Implementation:**\n\n**Policy Framework:**\n- Acceptable use policy for AI tools\n- Approved AI vendor list\n- Data governance for AI training\n- Model deployment approval process\n\n**Risk Assessment Questions:**\n- What decisions will AI influence?\n- Who is affected by those decisions?\n- What is the impact of errors?\n- Can decisions be explained?\n- Is human oversight required?\n\n**Technical Controls:**\n- Input validation and sanitization\n- Output filtering\n- Model versioning and lineage\n- Monitoring for drift\n- Audit logging\n\n**Compliance Considerations:**\n- HIPAA: AI accessing PHI requires BAAs\n- GDPR: Automated decision-making rights\n- Financial: Model risk management (SR 11-7)\n\n**Organizational Structure:**\n- AI ethics committee or board\n- Clear ownership and accountability\n- Regular review cadence\n\nWhat aspect of AI governance is most relevant to your situation?"
    },
    zero_trust: {
      main: "**Zero Trust Architecture**\n\nZero Trust is a security model based on the principle of \"never trust, always verify\" - no implicit trust is granted based on network location.\n\n**Core Principles:**\n\n1. **Verify Explicitly** - Authenticate and authorize every access request\n2. **Least Privilege Access** - Just-in-time, just-enough access\n3. **Assume Breach** - Minimize blast radius, segment access\n\n**Key Components:**\n\n- **Identity Verification** - Strong MFA, continuous validation\n- **Device Health** - Compliance checks, endpoint security\n- **Network Segmentation** - Micro-segmentation, software-defined perimeter\n- **Application Access** - Per-app authorization, not network access\n- **Data Protection** - Classification, encryption, DLP\n- **Analytics** - Behavior monitoring, anomaly detection\n\n**Implementation Approach:**\n1. Identify critical assets and data flows\n2. Map transaction flows\n3. Build Zero Trust architecture\n4. Create policies\n5. Monitor and maintain\n\n**Practical Takeaway:** Zero Trust is a journey, not a destination. Start with identity (MFA everywhere) and expand to device trust and microsegmentation over time.",
      followUp: "**Zero Trust Maturity Model:**\n\n**Stage 1: Traditional**\n- Perimeter-based security\n- Implicit trust inside network\n- Static policies\n\n**Stage 2: Advanced**\n- MFA deployed widely\n- Some identity-based policies\n- Basic device health checks\n\n**Stage 3: Optimal**\n- Continuous verification\n- Dynamic, risk-based policies\n- Full microsegmentation\n- Real-time analytics\n\n**Quick Wins to Start:**\n1. Enforce MFA on all accounts\n2. Implement conditional access policies\n3. Remove VPN for SaaS applications\n4. Enable device compliance checks\n5. Segment privileged access\n\n**NIST SP 800-207:**\n- Zero Trust Architecture reference\n- Deployment models\n- Migration approaches\n\nWould you like implementation guidance for a specific component?"
    },
    ransomware: {
      main: "**Ransomware Protection and Response**\n\nRansomware attacks encrypt organizational data and demand payment for decryption. Prevention and preparation are critical.\n\n**Prevention Controls:**\n\n1. **Endpoint Protection** - EDR/XDR solutions with behavioral detection\n2. **Email Security** - Anti-phishing, attachment sandboxing\n3. **Patch Management** - Timely updates for known vulnerabilities\n4. **Access Control** - Least privilege, MFA, privileged access management\n5. **Network Segmentation** - Limit lateral movement\n6. **Backup Strategy** - 3-2-1 rule with offline/immutable copies\n\n**Response Steps:**\n\n1. **Isolate** - Disconnect affected systems immediately\n2. **Preserve** - Capture forensic evidence before remediation\n3. **Notify** - Legal, insurance, law enforcement (FBI, CISA)\n4. **Investigate** - Determine scope and entry point\n5. **Recover** - Restore from clean backups\n6. **Report** - Regulatory notifications as required\n\n**Practical Takeaway:** Your backup strategy is your most important control. Test restores regularly and ensure backups cannot be encrypted by an attacker with network access.",
      followUp: "**Ransomware Payment Considerations:**\n\n**Arguments Against Payment:**\n- No guarantee of decryption\n- May fund further attacks\n- OFAC sanctions risk (certain threat actors)\n- May be targeted again\n\n**If Considering Payment:**\n- Engage legal counsel first\n- Verify entity is not sanctioned\n- Document decision rationale\n- Engage professional negotiators\n\n**Cyber Insurance:**\n- Review coverage and exclusions\n- Understand notification requirements\n- Know your incident response panel\n\n**Tabletop Exercises:**\n- Annual ransomware scenario exercises\n- Include executive leadership\n- Test communication plans\n- Validate backup recovery\n\n**Recovery Planning:**\n- Prioritize system restoration order\n- Maintain offline documentation\n- Pre-establish vendor relationships\n- Test full recovery procedures\n\nWould you like help developing a ransomware response plan?"
    },
    phishing: {
      main: "**Phishing Prevention and Response**\n\nPhishing remains the most common initial attack vector. A comprehensive defense requires technical controls and user awareness.\n\n**Technical Controls:**\n\n1. **Email Authentication** - SPF, DKIM, DMARC properly configured\n2. **Email Filtering** - Gateway with URL rewriting and sandboxing\n3. **Anti-Spoofing** - Protection against domain impersonation\n4. **Browser Isolation** - For high-risk users or links\n5. **MFA** - Prevents credential theft impact\n\n**Human Controls:**\n\n1. **Security Awareness Training** - Regular, engaging content\n2. **Phishing Simulations** - Measure and improve awareness\n3. **Clear Reporting Process** - Easy way to report suspicious emails\n4. **Positive Reinforcement** - Reward reporting, not punishment\n\n**Response Process:**\n1. Report to security team\n2. Remove from all inboxes\n3. Block sender/domain\n4. Check for clicks and credential entry\n5. Reset credentials if compromised\n6. Forensic investigation if needed\n\n**Practical Takeaway:** Even with perfect technical controls, assume some phishing will reach users. Focus on making reporting easy and responding quickly.",
      followUp: "**Advanced Phishing Threats:**\n\n**Business Email Compromise (BEC):**\n- Impersonation of executives\n- Wire transfer requests\n- Vendor payment fraud\n\n**Prevention:**\n- Verification procedures for payment changes\n- Multi-person approval for transfers\n- Out-of-band confirmation\n\n**Spear Phishing:**\n- Highly targeted attacks\n- Research-based social engineering\n- Often precedes larger attacks\n\n**Vishing and Smishing:**\n- Voice phishing (phone calls)\n- SMS phishing (text messages)\n- Require separate awareness training\n\n**Metrics to Track:**\n- Phishing simulation click rates\n- Report rates (should increase)\n- Time to report\n- Time to remediate\n\nWould you like help designing a phishing awareness program?"
    },
    encryption: {
      main: "**Encryption Best Practices**\n\nEncryption is a foundational control for protecting data confidentiality, required or recommended by most compliance frameworks.\n\n**Data at Rest:**\n\n- **Algorithm:** AES-256 (symmetric)\n- **Full Disk Encryption:** BitLocker, FileVault, LUKS\n- **Database Encryption:** Transparent Data Encryption (TDE)\n- **File-Level:** For specific sensitive files\n\n**Data in Transit:**\n\n- **Protocol:** TLS 1.2 minimum, TLS 1.3 preferred\n- **Certificate Management:** Automated renewal, short validity\n- **Perfect Forward Secrecy:** Protect past sessions\n\n**Key Management:**\n\n- **Hardware Security Modules (HSMs):** For high-value keys\n- **Key Rotation:** Regular rotation schedule\n- **Separation of Duties:** Key managers vs. data access\n- **Cloud KMS:** AWS KMS, Azure Key Vault, GCP Cloud KMS\n\n**Compliance Requirements:**\n- HIPAA: Required for ePHI (proposed 2026 rules make this explicit)\n- PCI-DSS: Required for cardholder data\n- GDPR: Recommended as technical measure\n\n**Practical Takeaway:** Encryption is only as strong as your key management. Invest in proper key lifecycle management before implementing encryption.",
      followUp: "**Common Encryption Mistakes:**\n\n1. **Weak Key Derivation** - Using passwords directly as keys\n2. **Insecure Random Generation** - Predictable key generation\n3. **Key Storage Issues** - Keys stored with encrypted data\n4. **Rolling Your Own Crypto** - Using unvetted implementations\n5. **Ignoring Metadata** - Encrypting data but exposing patterns\n\n**Algorithm Selection:**\n- **Symmetric:** AES-256-GCM (authenticated)\n- **Asymmetric:** RSA-2048+ or ECDSA P-256+\n- **Hashing:** SHA-256 or SHA-3\n- **Password Storage:** Argon2, bcrypt, scrypt\n\n**Deprecated (Avoid):**\n- DES, 3DES\n- MD5, SHA-1\n- RC4\n- TLS 1.0/1.1\n\nWould you like guidance on implementing encryption for a specific use case?"
    },
    authentication: {
      main: "**Authentication Security Best Practices**\n\nStrong authentication is foundational to security and increasingly required by compliance frameworks.\n\n**Multi-Factor Authentication (MFA):**\n\n**Factor Types:**\n- Something you know (password)\n- Something you have (phone, hardware key)\n- Something you are (biometrics)\n\n**Method Strength (strongest to weakest):**\n1. Hardware security keys (FIDO2/WebAuthn)\n2. Authenticator apps (TOTP)\n3. Push notifications\n4. SMS/Voice (vulnerable to SIM swapping)\n\n**Password Requirements:**\n- Minimum 12+ characters\n- Check against breach databases\n- No complexity rules (counterproductive)\n- No periodic forced rotation\n- Password manager encouraged\n\n**Passwordless Options:**\n- FIDO2/WebAuthn\n- Passkeys\n- Certificate-based\n\n**Compliance Drivers:**\n- HIPAA 2026: MFA will be mandatory\n- PCI-DSS 4.0: MFA for all access to CDE\n- SOC 2: MFA commonly expected\n\n**Practical Takeaway:** Deploy MFA for all users, prioritizing privileged accounts and external access. Hardware keys for highest-risk users.",
      followUp: "**MFA Implementation Strategy:**\n\n**Phase 1: High Priority**\n- Privileged accounts (admins)\n- Remote access\n- Email\n- Cloud administration\n\n**Phase 2: Expand**\n- All employee accounts\n- Sensitive applications\n- VPN access\n\n**Phase 3: Universal**\n- Customer-facing applications\n- API access\n- Machine identities\n\n**Rollout Considerations:**\n- User communication plan\n- Help desk preparation\n- Recovery procedures\n- Exception process\n\n**Session Management:**\n- Appropriate timeout values\n- Secure cookie attributes\n- Session invalidation on logout\n- Concurrent session limits\n\nWould you like help with MFA rollout planning?"
    },
    penetration: {
      main: "**Penetration Testing Overview**\n\nPenetration testing simulates real-world attacks to identify vulnerabilities before malicious actors do. It's required or recommended by most compliance frameworks.\n\n**Test Types:**\n\n- **Black Box:** No prior knowledge provided\n- **White Box:** Full access to architecture/code\n- **Gray Box:** Partial information (most common)\n\n**Scope Categories:**\n\n- **Network:** External and internal infrastructure\n- **Web Application:** OWASP Top 10 focus\n- **Mobile Application:** iOS/Android apps\n- **API:** REST/GraphQL endpoints\n- **Social Engineering:** Phishing, physical access\n- **Red Team:** Full adversary simulation\n\n**Legal Requirements:**\n\n- Written authorization (Rules of Engagement)\n- Defined scope and boundaries\n- Insurance coverage\n- Clear start/end dates\n- Emergency contacts\n\n**Compliance Drivers:**\n- PCI-DSS: Annual penetration test required\n- HIPAA: Technical evaluation required\n- SOC 2: Often expected by auditors\n\n**Practical Takeaway:** Penetration tests are point-in-time assessments. Combine with continuous vulnerability scanning and regular testing cadence.",
      followUp: "**Penetration Test Planning:**\n\n**Vendor Selection:**\n- Relevant certifications (OSCP, GPEN, CEH)\n- Industry experience\n- Methodology documentation\n- Insurance coverage\n- References\n\n**Preparation:**\n- Asset inventory for scoping\n- Test environment availability\n- Credential creation for authenticated testing\n- WAF/IPS exceptions if needed\n- Stakeholder notification\n\n**During Testing:**\n- Communication channel established\n- Status updates scheduled\n- Severity threshold for immediate notification\n\n**After Testing:**\n- Technical debrief\n- Executive summary\n- Remediation prioritization\n- Retest validation\n\n**Testing Cadence:**\n- Annual (minimum for compliance)\n- After major changes\n- For new applications before launch\n\nWould you like help developing a penetration testing program?"
    },
    devsecops: {
      main: "**DevSecOps Overview**\n\nDevSecOps integrates security throughout the software development lifecycle, making security a shared responsibility rather than a gate at the end.\n\n**Core Principles:**\n\n1. **Shift Left** - Find vulnerabilities early when they're cheaper to fix\n2. **Automation** - Security checks in CI/CD pipelines\n3. **Continuous Feedback** - Fast feedback loops for developers\n4. **Shared Responsibility** - Security is everyone's job\n\n**Security in the Pipeline:**\n\n**Commit Stage:**\n- Secret scanning\n- SAST (Static Application Security Testing)\n- Dependency scanning (SCA)\n\n**Build Stage:**\n- Container image scanning\n- Infrastructure as Code scanning\n\n**Deploy Stage:**\n- DAST (Dynamic Application Security Testing)\n- Configuration validation\n\n**Runtime:**\n- RASP (Runtime Application Self-Protection)\n- Monitoring and alerting\n\n**Key Metrics:**\n- Mean time to remediate vulnerabilities\n- Vulnerability escape rate\n- Security debt tracking\n\n**Practical Takeaway:** Start small with secret scanning and dependency analysis - they provide high value with low friction.",
      followUp: "**DevSecOps Implementation:**\n\n**Quick Wins:**\n1. Secret scanning in pre-commit hooks\n2. Dependency vulnerability scanning\n3. Basic SAST in pull requests\n4. Container base image scanning\n\n**Tool Categories:**\n- **SAST:** SonarQube, Semgrep, CodeQL\n- **SCA:** Snyk, Dependabot, OWASP Dependency-Check\n- **Container:** Trivy, Clair, Anchore\n- **DAST:** OWASP ZAP, Burp Suite\n- **Secret Scanning:** GitLeaks, TruffleHog\n\n**Cultural Changes:**\n- Security champions program\n- Security training for developers\n- Blameless post-mortems\n- Positive recognition for security contributions\n\n**Metrics to Track:**\n- Vulnerabilities found in dev vs. production\n- Time from discovery to fix\n- Pipeline failure rate for security\n- Developer satisfaction with tools\n\nWould you like guidance on implementing specific DevSecOps controls?"
    },
    access_control: {
      main: "**Access Control Best Practices**\n\nAccess control ensures only authorized individuals can access resources, and only to the extent necessary for their role.\n\n**Key Principles:**\n\n1. **Least Privilege** - Minimum access necessary for job function\n2. **Separation of Duties** - Prevent single points of control\n3. **Need to Know** - Access limited to required information\n\n**Access Control Models:**\n\n- **RBAC (Role-Based):** Access based on job roles\n- **ABAC (Attribute-Based):** Dynamic policies based on attributes\n- **MAC (Mandatory):** Classification-based, common in government\n- **DAC (Discretionary):** Owner-controlled, common in consumer\n\n**Implementation:**\n\n- Centralized identity management (IdP)\n- Just-in-time privileged access\n- Regular access reviews (quarterly minimum)\n- Automated provisioning/deprovisioning\n- Emergency access procedures\n\n**Privileged Access Management (PAM):**\n- Vault for credentials\n- Session recording\n- Just-in-time elevation\n\n**Practical Takeaway:** Access creep is common. Implement regular access reviews with actual business owner involvement, not just rubber-stamping.",
      followUp: "**Access Review Process:**\n\n**Review Frequency:**\n- Privileged access: Quarterly\n- Standard access: Semi-annually\n- Sensitive systems: Monthly\n\n**Review Process:**\n1. Generate access reports by manager/application\n2. Distribute to appropriate reviewers\n3. Reviewers certify or revoke access\n4. Track completion and escalate\n5. Remove uncertified access\n6. Document and retain evidence\n\n**Joiner/Mover/Leaver:**\n- Automated provisioning from HR source\n- Role changes trigger access review\n- Same-day termination of access for leavers\n\n**Common Gaps:**\n- Shared accounts\n- Service accounts with excessive access\n- Orphaned accounts\n- Access granted but never used\n\nWould you like help designing an access review program?"
    },
    incident_response: {
      main: "**Incident Response Overview**\n\nA structured incident response capability is essential for minimizing damage from security events.\n\n**Incident Response Phases:**\n\n1. **Preparation** - Plans, team, tools, training\n2. **Detection and Analysis** - Identify and assess incidents\n3. **Containment** - Limit damage and prevent spread\n4. **Eradication** - Remove threat from environment\n5. **Recovery** - Restore normal operations\n6. **Post-Incident** - Lessons learned, improvements\n\n**Key Documentation:**\n\n- Incident response plan\n- Communication templates\n- Escalation matrix\n- Contact lists (internal, legal, insurance, law enforcement)\n- Playbooks for common scenarios\n\n**Roles and Responsibilities:**\n\n- Incident Commander\n- Technical Lead\n- Communications Lead\n- Legal/Compliance\n- Executive Sponsor\n\n**Regulatory Considerations:**\n- HIPAA: Breach notification within 60 days\n- GDPR: 72 hours to supervisory authority\n- State laws: Various requirements\n\n**Practical Takeaway:** Practice your incident response through tabletop exercises at least annually. The middle of an incident is not the time to figure out your process.",
      followUp: "**Incident Response Maturity:**\n\n**Level 1: Basic**\n- Documented plan exists\n- Contact lists maintained\n- Basic detection capability\n\n**Level 2: Defined**\n- Playbooks for common incidents\n- Regular tabletop exercises\n- Defined roles and responsibilities\n- Integration with legal/PR\n\n**Level 3: Managed**\n- 24/7 monitoring capability\n- Automated detection and alerting\n- Forensic capability (internal or retainer)\n- Regular plan testing\n\n**Level 4: Optimized**\n- Threat intelligence integration\n- Automated response actions\n- Continuous improvement process\n- Metrics and KPIs tracked\n\n**Tabletop Exercise Scenarios:**\n- Ransomware attack\n- Data breach/exfiltration\n- Business email compromise\n- Insider threat\n- Third-party compromise\n\nWould you like help developing incident response playbooks?"
    },
    risk_assessment: {
      main: "**Security Risk Assessment**\n\nRisk assessment is the foundation of an effective security program, helping prioritize resources based on actual threats and impacts.\n\n**Risk Assessment Process:**\n\n1. **Asset Identification** - What are you protecting?\n2. **Threat Identification** - What could harm assets?\n3. **Vulnerability Assessment** - What weaknesses exist?\n4. **Impact Analysis** - What's the potential harm?\n5. **Likelihood Assessment** - How probable is the event?\n6. **Risk Calculation** - Risk = Likelihood x Impact\n7. **Risk Treatment** - Accept, mitigate, transfer, avoid\n\n**Common Frameworks:**\n\n- **NIST SP 800-30:** Risk assessment guidance\n- **ISO 27005:** Information security risk management\n- **FAIR:** Factor Analysis of Information Risk (quantitative)\n- **OCTAVE:** Operationally Critical Threat, Asset, and Vulnerability Evaluation\n\n**Documentation Requirements:**\n- Risk register\n- Risk treatment plans\n- Risk acceptance documentation\n- Regular review records\n\n**Practical Takeaway:** Risk assessments should inform decisions, not just check compliance boxes. Focus on scenarios that could actually harm your organization.",
      followUp: "**Risk Assessment Best Practices:**\n\n**Qualitative vs. Quantitative:**\n- **Qualitative:** High/Medium/Low ratings (faster, simpler)\n- **Quantitative:** Dollar values and probabilities (more precise, more effort)\n\n**Common Mistakes:**\n- Treating it as one-time vs. ongoing\n- Not involving business stakeholders\n- Focusing only on technical risks\n- Incomplete asset inventory\n- Accepting risk without authority\n\n**Risk Treatment Options:**\n- **Mitigate:** Implement controls to reduce risk\n- **Transfer:** Insurance, contracts with third parties\n- **Accept:** Document acceptance by appropriate authority\n- **Avoid:** Eliminate the risky activity\n\n**Review Cadence:**\n- Annual comprehensive assessment\n- Triggered by significant changes\n- Continuous monitoring of key risks\n\nWould you like guidance on conducting a risk assessment for your organization?"
    },
    vendor_management: {
      main: "**Third-Party Risk Management**\n\nVendors often have access to sensitive data and systems. Managing third-party risk is critical for security and compliance.\n\n**Vendor Risk Lifecycle:**\n\n1. **Due Diligence** - Assess before engagement\n2. **Contracting** - Security requirements in agreements\n3. **Onboarding** - Secure integration\n4. **Ongoing Monitoring** - Continuous assessment\n5. **Offboarding** - Secure termination\n\n**Risk Assessment Factors:**\n\n- Data access and sensitivity\n- System access and privileges\n- Business criticality\n- Regulatory implications\n- Geographic considerations\n\n**Assessment Methods:**\n\n- Security questionnaires (SIG, CAIQ)\n- SOC 2 reports\n- ISO 27001 certification\n- Penetration test reports\n- On-site assessments (high-risk)\n\n**Contractual Requirements:**\n\n- Security controls and standards\n- Incident notification requirements\n- Right to audit\n- Subcontractor flow-down\n- Data handling and return/destruction\n\n**Practical Takeaway:** Tier your vendors by risk level and apply proportionate assessment rigor. Not every vendor needs the same scrutiny.",
      followUp: "**Vendor Risk Tiering:**\n\n**Tier 1 (Critical):**\n- Access to highly sensitive data\n- Critical business function\n- Significant regulatory impact\n- Assessment: Full due diligence, annual review\n\n**Tier 2 (Important):**\n- Access to internal data\n- Moderate business impact\n- Assessment: Questionnaire, periodic review\n\n**Tier 3 (Standard):**\n- Limited data access\n- Low business impact\n- Assessment: Basic screening\n\n**Ongoing Monitoring:**\n- Annual reassessment (Tier 1-2)\n- Continuous monitoring services\n- Security rating platforms\n- Incident alerts\n\n**Healthcare-Specific:**\n- Business Associate Agreements required\n- PHI handling documented\n- Breach notification requirements\n\nWould you like help developing a vendor risk management program?"
    },
    data_protection: {
      main: "**Data Protection Best Practices**\n\nData protection encompasses the policies, procedures, and technologies used to ensure data confidentiality, integrity, and availability.\n\n**Data Classification:**\n\n- **Public** - No restrictions on disclosure\n- **Internal** - Business use only\n- **Confidential** - Limited distribution, business impact\n- **Restricted** - Highly sensitive, regulatory or severe impact\n\n**Protection by State:**\n\n**Data at Rest:**\n- Encryption (AES-256)\n- Access controls\n- Secure storage locations\n- Backup protection\n\n**Data in Transit:**\n- TLS 1.2+ encryption\n- VPN for network traffic\n- Secure file transfer\n\n**Data in Use:**\n- Access controls\n- DLP monitoring\n- Screen privacy filters\n- Clean desk policy\n\n**Data Loss Prevention (DLP):**\n- Endpoint DLP\n- Network DLP\n- Cloud DLP\n- Email DLP\n\n**Practical Takeaway:** Start with data discovery and classification. You cannot protect data you don't know exists.",
      followUp: "**Data Lifecycle Management:**\n\n**Creation/Collection:**\n- Minimize collection\n- Classify at creation\n- Document purpose\n\n**Storage:**\n- Appropriate security by classification\n- Access controls\n- Encryption where required\n\n**Use:**\n- Purpose limitation\n- Minimum necessary access\n- Audit logging\n\n**Sharing:**\n- Approved methods by classification\n- Encryption in transit\n- Third-party agreements\n\n**Retention:**\n- Defined retention periods\n- Legal hold capabilities\n- Automated enforcement where possible\n\n**Disposal:**\n- Secure deletion methods\n- Certificate of destruction\n- Media sanitization (NIST 800-88)\n\nWould you like guidance on implementing data classification?"
    },
    cloud_security: {
      main: "**Cloud Security Overview**\n\nCloud security requires understanding the shared responsibility model and implementing controls appropriate to your cloud deployment.\n\n**Shared Responsibility Model:**\n\n**Cloud Provider Responsible For:**\n- Physical security\n- Network infrastructure\n- Hypervisor/host security\n\n**Customer Responsible For:**\n- Data classification and protection\n- Identity and access management\n- Application security\n- Operating system (IaaS)\n- Network configuration\n\n**Key Security Controls:**\n\n1. **Identity and Access** - SSO, MFA, least privilege\n2. **Network Security** - VPCs, security groups, WAF\n3. **Data Protection** - Encryption, key management\n4. **Logging and Monitoring** - CloudTrail, Security Hub, SIEM\n5. **Configuration Management** - IaC, compliance scanning\n\n**Cloud-Specific Risks:**\n- Misconfiguration (leading cause of breaches)\n- Excessive permissions\n- Exposed storage buckets\n- Inadequate logging\n\n**Practical Takeaway:** Misconfiguration is the biggest cloud security risk. Implement automated configuration scanning and remediation.",
      followUp: "**Cloud Security Maturity:**\n\n**Foundation:**\n- Enable cloud-native security features\n- Centralized logging\n- MFA for all accounts\n- Baseline configurations\n\n**Intermediate:**\n- Cloud Security Posture Management (CSPM)\n- Infrastructure as Code\n- Automated compliance checks\n- Workload protection\n\n**Advanced:**\n- Cloud-native SIEM/SOAR\n- Zero Trust network architecture\n- DevSecOps integration\n- Continuous compliance\n\n**Multi-Cloud Considerations:**\n- Consistent policies across platforms\n- Unified visibility\n- Skill development for each platform\n\n**Compliance in Cloud:**\n- Most frameworks are cloud-agnostic\n- FedRAMP for federal workloads\n- Provider certifications (SOC 2, ISO, etc.)\n\nWould you like guidance on cloud security for a specific platform?"
    }
  };
  
  const response = responses[topic];
  if (response) {
    return isFollowUp ? response.followUp : response.main;
  }
  
  // Fallback response
  return "I can help with that topic. To provide the most useful guidance, could you share more context about:\n\n- Your organization type (healthcare, financial, technology)\n- The specific compliance frameworks you're working with\n- Whether you're implementing new controls or addressing specific gaps\n\nThis will help me tailor my response to your situation.";
};

// Safe URL validator
const isValidUrl = (url: string): boolean => {
  const trimmedUrl = url.trim().toLowerCase();
  return (
    trimmedUrl.startsWith('http://') ||
    trimmedUrl.startsWith('https://') ||
    trimmedUrl.startsWith('mailto:') ||
    trimmedUrl.startsWith('#')
  );
};

// Safe markdown formatting with sanitization
const formatMessageContent = (content: string): string => {
  const escaped = content
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
  
  const formatted = escaped
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\[(.*?)\]\((.*?)\)/g, (_, text, url) => {
      if (isValidUrl(url)) {
        const sanitizedUrl = url.replace(/"/g, '&quot;');
        return `<a href="${sanitizedUrl}" class="text-primary underline" rel="noopener noreferrer">${text}</a>`;
      }
      return text;
    })
    .replace(/\n/g, '<br />');
  
  return DOMPurify.sanitize(formatted, {
    ALLOWED_TAGS: ['strong', 'a', 'br'],
    ALLOWED_ATTR: ['href', 'class', 'rel'],
  });
};

// Message content component
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
      content: "Welcome. I'm Securvio AI, your cybersecurity and compliance assistant.\n\nI specialize in **HIPAA** (including 2026 updates), **SOC 2**, **GDPR**, **NIST**, **ISO 27001**, and **AI governance frameworks**.\n\nHow can I help you today?",
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

    const currentMessages = [...messages, userMessage];
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: getAIResponse(input, currentMessages),
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    }, 800 + Math.random() * 700);
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

      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-3rem)] h-[600px] max-h-[calc(100vh-8rem)] glass-card border-primary/30 flex flex-col animate-fade-up shadow-glow-lg">
          <div className="p-4 border-b border-border/50 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-display font-semibold">Securvio AI</h3>
              <p className="text-xs text-muted-foreground">Enterprise Security Assistant</p>
            </div>
          </div>

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

          <div className="p-4 border-t border-border/50">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask a security or compliance question..."
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
