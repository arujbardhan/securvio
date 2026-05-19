// Local cybersecurity learning content. No backend, no tracking.

export const CATEGORIES = [
  "HIPAA Compliance",
  "SOC 2",
  "ISO 27001",
  "Risk Assessments",
  "Vulnerability Management",
  "Security Awareness",
  "Incident Response",
  "Access Control",
  "Phishing",
  "Malware",
  "SIEM/SOC Basics",
  "Network Security",
  "Encryption",
  "Business Continuity",
  "Disaster Recovery",
  "Compliance Auditing",
  "Cloud Security Basics",
  "NIST Framework",
  "Zero Trust",
  "Endpoint Security",
  "CompTIA A+ 1101 Fundamentals",
] as const;

export type Category = (typeof CATEGORIES)[number];

export interface Flashcard {
  id: string;
  category: Category;
  term: string;
  definition: string;
}

export interface MatchPair {
  id: string;
  category: Category;
  left: string;
  right: string;
}

export interface MCQ {
  id: string;
  category: Category;
  question: string;
  choices: string[];
  answerIndex: number;
  explanation?: string;
}

export interface FillBlank {
  id: string;
  category: Category;
  prompt: string; // contains ___
  answer: string;
  hint?: string;
  acceptable?: string[];
}

export const FLASHCARDS: Flashcard[] = [
  { id: "f1", category: "HIPAA Compliance", term: "PHI", definition: "Protected Health Information — individually identifiable health data covered by HIPAA." },
  { id: "f2", category: "HIPAA Compliance", term: "Covered Entity", definition: "A health plan, health care clearinghouse, or provider that transmits PHI electronically." },
  { id: "f3", category: "HIPAA Compliance", term: "Business Associate", definition: "A person or org that performs functions involving PHI on behalf of a covered entity." },
  { id: "f4", category: "SOC 2", term: "Trust Services Criteria", definition: "Security, Availability, Processing Integrity, Confidentiality, and Privacy." },
  { id: "f5", category: "SOC 2", term: "Type I vs Type II", definition: "Type I evaluates control design at a point in time; Type II evaluates operating effectiveness over a period." },
  { id: "f6", category: "ISO 27001", term: "ISMS", definition: "Information Security Management System — a risk-based framework of policies and controls." },
  { id: "f7", category: "ISO 27001", term: "Annex A", definition: "Reference set of 93 controls (2022) grouped into Organizational, People, Physical, and Technological." },
  { id: "f8", category: "Risk Assessments", term: "Inherent Risk", definition: "Risk level before applying any controls or mitigations." },
  { id: "f9", category: "Risk Assessments", term: "Residual Risk", definition: "The remaining risk after controls are implemented." },
  { id: "f10", category: "Vulnerability Management", term: "CVSS", definition: "Common Vulnerability Scoring System — standardized severity scoring 0.0–10.0." },
  { id: "f11", category: "Vulnerability Management", term: "Patch Tuesday", definition: "Microsoft's monthly security update release on the second Tuesday." },
  { id: "f12", category: "Security Awareness", term: "Social Engineering", definition: "Manipulating people into divulging info or performing actions that compromise security." },
  { id: "f13", category: "Incident Response", term: "IR Lifecycle", definition: "Preparation, Detection & Analysis, Containment, Eradication, Recovery, Lessons Learned." },
  { id: "f14", category: "Access Control", term: "Least Privilege", definition: "Users only receive the minimum access required to perform their duties." },
  { id: "f15", category: "Access Control", term: "RBAC", definition: "Role-Based Access Control — permissions assigned via roles, not individuals." },
  { id: "f16", category: "Phishing", term: "Spear Phishing", definition: "Targeted phishing aimed at a specific individual or organization." },
  { id: "f17", category: "Phishing", term: "Whaling", definition: "Phishing attacks targeting senior executives or high-value individuals." },
  { id: "f18", category: "Malware", term: "Ransomware", definition: "Malware that encrypts data and demands payment for the decryption key." },
  { id: "f19", category: "Malware", term: "Rootkit", definition: "Stealthy software that grants persistent privileged access while hiding its presence." },
  { id: "f20", category: "SIEM/SOC Basics", term: "SIEM", definition: "Security Information and Event Management — aggregates and analyzes log data for detection." },
  { id: "f21", category: "SIEM/SOC Basics", term: "MTTD", definition: "Mean Time To Detect — average time to identify a security incident." },
  { id: "f22", category: "Network Security", term: "Firewall", definition: "A device or software that filters network traffic based on defined rules." },
  { id: "f23", category: "Network Security", term: "IDS vs IPS", definition: "IDS detects and alerts; IPS detects and actively blocks malicious traffic." },
  { id: "f24", category: "Encryption", term: "Symmetric Encryption", definition: "Uses one shared key for both encryption and decryption (e.g., AES)." },
  { id: "f25", category: "Encryption", term: "Asymmetric Encryption", definition: "Uses a public/private key pair (e.g., RSA, ECC)." },
  { id: "f26", category: "Business Continuity", term: "RTO", definition: "Recovery Time Objective — maximum acceptable downtime after a disruption." },
  { id: "f27", category: "Disaster Recovery", term: "RPO", definition: "Recovery Point Objective — maximum acceptable data loss measured in time." },
  { id: "f28", category: "Compliance Auditing", term: "Evidence", definition: "Artifacts (logs, policies, screenshots) that demonstrate a control is operating." },
  { id: "f29", category: "Cloud Security Basics", term: "Shared Responsibility", definition: "Cloud provider secures the cloud; customer secures what they put in the cloud." },
  { id: "f30", category: "NIST Framework", term: "CSF Functions", definition: "Identify, Protect, Detect, Respond, Recover (and Govern in CSF 2.0)." },
  { id: "f31", category: "Zero Trust", term: "Never Trust, Always Verify", definition: "Core Zero Trust principle: continuously authenticate and authorize every request." },
  { id: "f32", category: "Endpoint Security", term: "EDR", definition: "Endpoint Detection and Response — continuous monitoring and response on endpoints." },
];

export const MATCH_PAIRS: MatchPair[] = [
  { id: "m1", category: "Access Control", left: "Least Privilege", right: "Users only receive minimum required access" },
  { id: "m2", category: "Access Control", left: "MFA", right: "Two or more authentication factors" },
  { id: "m3", category: "Encryption", left: "AES-256", right: "Symmetric block cipher with 256-bit key" },
  { id: "m4", category: "Encryption", left: "TLS", right: "Encrypts data in transit over networks" },
  { id: "m5", category: "Phishing", left: "Spear Phishing", right: "Targeted attack on a specific person" },
  { id: "m6", category: "Malware", left: "Ransomware", right: "Encrypts files and demands payment" },
  { id: "m7", category: "Malware", left: "Trojan", right: "Disguises itself as legitimate software" },
  { id: "m8", category: "HIPAA Compliance", left: "PHI", right: "Protected Health Information" },
  { id: "m9", category: "SOC 2", left: "Type II", right: "Operating effectiveness over a period" },
  { id: "m10", category: "ISO 27001", left: "ISMS", right: "Information Security Management System" },
  { id: "m11", category: "Risk Assessments", left: "Residual Risk", right: "Risk remaining after controls applied" },
  { id: "m12", category: "Vulnerability Management", left: "CVSS 9.8", right: "Critical severity vulnerability" },
  { id: "m13", category: "Incident Response", left: "Containment", right: "Limit the scope of an active incident" },
  { id: "m14", category: "SIEM/SOC Basics", left: "SIEM", right: "Aggregates and correlates log events" },
  { id: "m15", category: "Network Security", left: "IPS", right: "Detects and blocks malicious traffic" },
  { id: "m16", category: "Business Continuity", left: "RTO", right: "Max acceptable downtime" },
  { id: "m17", category: "Disaster Recovery", left: "RPO", right: "Max acceptable data loss" },
  { id: "m18", category: "Cloud Security Basics", left: "Shared Responsibility", right: "Split of duties between provider and customer" },
  { id: "m19", category: "Zero Trust", left: "Microsegmentation", right: "Isolate workloads to limit lateral movement" },
  { id: "m20", category: "Endpoint Security", left: "EDR", right: "Continuous endpoint monitoring and response" },
  { id: "m21", category: "NIST Framework", left: "Detect", right: "Identify the occurrence of an event" },
  { id: "m22", category: "Security Awareness", left: "Social Engineering", right: "Manipulating people to bypass security" },
];

export const MCQS: MCQ[] = [
  {
    id: "q1", category: "HIPAA Compliance",
    question: "Which HIPAA safeguard category covers workforce training and access management policies?",
    choices: ["Physical", "Administrative", "Technical", "Organizational"],
    answerIndex: 1,
    explanation: "Administrative safeguards include workforce training, access management, and security management processes.",
  },
  {
    id: "q2", category: "HIPAA Compliance",
    question: "Encryption of PHI at rest is an example of which safeguard?",
    choices: ["Administrative", "Physical", "Technical", "Procedural"],
    answerIndex: 2,
  },
  {
    id: "q3", category: "SOC 2",
    question: "Which is the only Trust Services Criterion required in every SOC 2 report?",
    choices: ["Availability", "Confidentiality", "Security (Common Criteria)", "Privacy"],
    answerIndex: 2,
  },
  {
    id: "q4", category: "SOC 2",
    question: "A SOC 2 Type II report evaluates controls over what?",
    choices: ["A point in time", "A period of time (typically 3–12 months)", "A single transaction", "A single system"],
    answerIndex: 1,
  },
  {
    id: "q5", category: "ISO 27001",
    question: "Which document defines which Annex A controls apply to the organization?",
    choices: ["Risk Register", "Statement of Applicability", "ISMS Scope Statement", "Internal Audit Plan"],
    answerIndex: 1,
  },
  {
    id: "q6", category: "Risk Assessments",
    question: "Risk = Likelihood × ?",
    choices: ["Threat", "Vulnerability", "Impact", "Asset Value"],
    answerIndex: 2,
  },
  {
    id: "q7", category: "Vulnerability Management",
    question: "A CVSS score of 7.0–8.9 is considered:",
    choices: ["Low", "Medium", "High", "Critical"],
    answerIndex: 2,
  },
  {
    id: "q8", category: "Vulnerability Management",
    question: "Which activity validates that a patch was actually applied?",
    choices: ["Scanning", "Logging", "Verification scan / re-scan", "Inventory"],
    answerIndex: 2,
  },
  {
    id: "q9", category: "Security Awareness",
    question: "Which is the BEST defense against social engineering?",
    choices: ["Stronger firewall", "Antivirus updates", "Ongoing user awareness training", "Disk encryption"],
    answerIndex: 2,
  },
  {
    id: "q10", category: "Incident Response",
    question: "Which IR phase focuses on returning systems to normal operations?",
    choices: ["Containment", "Eradication", "Recovery", "Lessons Learned"],
    answerIndex: 2,
  },
  {
    id: "q11", category: "Incident Response",
    question: "Which is performed FIRST during an incident?",
    choices: ["Eradication", "Containment", "Detection & Analysis", "Recovery"],
    answerIndex: 2,
  },
  {
    id: "q12", category: "Access Control",
    question: "Granting access based on job function is known as:",
    choices: ["DAC", "MAC", "RBAC", "ABAC"],
    answerIndex: 2,
  },
  {
    id: "q13", category: "Access Control",
    question: "Which is an example of 'something you have'?",
    choices: ["Password", "Fingerprint", "Hardware token", "PIN"],
    answerIndex: 2,
  },
  {
    id: "q14", category: "Phishing",
    question: "An email impersonating the CEO targeting a finance employee for a wire transfer is:",
    choices: ["Vishing", "Smishing", "Business Email Compromise (BEC)", "Pharming"],
    answerIndex: 2,
  },
  {
    id: "q15", category: "Phishing",
    question: "Phishing via SMS is called:",
    choices: ["Vishing", "Smishing", "Whaling", "Pretexting"],
    answerIndex: 1,
  },
  {
    id: "q16", category: "Malware",
    question: "Which malware self-propagates across networks without user action?",
    choices: ["Virus", "Worm", "Trojan", "Spyware"],
    answerIndex: 1,
  },
  {
    id: "q17", category: "Malware",
    question: "Best initial response to a ransomware infection on a workstation?",
    choices: ["Pay the ransom", "Reboot the machine", "Isolate it from the network", "Run antivirus scan"],
    answerIndex: 2,
  },
  {
    id: "q18", category: "SIEM/SOC Basics",
    question: "Correlating events from multiple sources to detect threats is a core function of:",
    choices: ["DLP", "SIEM", "EDR", "WAF"],
    answerIndex: 1,
  },
  {
    id: "q19", category: "Network Security",
    question: "Which device inspects traffic and actively blocks attacks inline?",
    choices: ["IDS", "IPS", "Proxy", "Router"],
    answerIndex: 1,
  },
  {
    id: "q20", category: "Network Security",
    question: "Segmenting a network to limit lateral movement is called:",
    choices: ["VLAN tagging", "Microsegmentation", "NAT", "Load balancing"],
    answerIndex: 1,
  },
  {
    id: "q21", category: "Encryption",
    question: "Which algorithm is asymmetric?",
    choices: ["AES", "DES", "RSA", "3DES"],
    answerIndex: 2,
  },
  {
    id: "q22", category: "Encryption",
    question: "TLS 1.3 primarily protects data:",
    choices: ["At rest", "In transit", "In use", "In backup"],
    answerIndex: 1,
  },
  {
    id: "q23", category: "Business Continuity",
    question: "RTO measures:",
    choices: ["Max data loss", "Max downtime", "Cost of outage", "Backup frequency"],
    answerIndex: 1,
  },
  {
    id: "q24", category: "Disaster Recovery",
    question: "If RPO = 1 hour, backups must occur at least:",
    choices: ["Every 24 hours", "Every 12 hours", "Every hour", "In real time"],
    answerIndex: 2,
  },
  {
    id: "q25", category: "Compliance Auditing",
    question: "Which is acceptable audit evidence for an access review control?",
    choices: ["Verbal confirmation", "Signed-off review report with date", "A policy document", "An email asking for review"],
    answerIndex: 1,
  },
  {
    id: "q26", category: "Cloud Security Basics",
    question: "In IaaS, the customer is responsible for:",
    choices: ["Physical security", "Hypervisor", "OS, applications, and data", "Datacenter networking"],
    answerIndex: 2,
  },
  {
    id: "q27", category: "NIST Framework",
    question: "Which NIST CSF function focuses on developing and implementing safeguards?",
    choices: ["Identify", "Protect", "Detect", "Respond"],
    answerIndex: 1,
  },
  {
    id: "q28", category: "Zero Trust",
    question: "The core principle of Zero Trust is:",
    choices: ["Trust internal networks", "Never trust, always verify", "VPN everything", "Block all external traffic"],
    answerIndex: 1,
  },
  {
    id: "q29", category: "Endpoint Security",
    question: "EDR provides which capability that traditional AV typically does not?",
    choices: ["Signature scanning", "Continuous behavioral monitoring & response", "Email filtering", "Firewall rules"],
    answerIndex: 1,
  },
  {
    id: "q30", category: "ISO 27001",
    question: "ISO 27001:2022 Annex A contains how many controls?",
    choices: ["114", "93", "75", "133"],
    answerIndex: 1,
  },
];

export const FILL_BLANKS: FillBlank[] = [
  { id: "b1", category: "SOC 2", prompt: "SOC 2 Type ___ evaluates operational effectiveness over time.", answer: "II", acceptable: ["2", "two"], hint: "Roman numeral for 2." },
  { id: "b2", category: "HIPAA Compliance", prompt: "HIPAA's three safeguard categories are Administrative, Physical, and ___.", answer: "Technical" },
  { id: "b3", category: "ISO 27001", prompt: "The ___ defines the boundaries of an ISO 27001 ISMS.", answer: "Scope", hint: "What the ISMS covers." },
  { id: "b4", category: "Access Control", prompt: "The principle of least ___ limits user access to the minimum required.", answer: "privilege" },
  { id: "b5", category: "Access Control", prompt: "MFA stands for Multi-Factor ___.", answer: "Authentication" },
  { id: "b6", category: "Encryption", prompt: "AES is a ___ encryption algorithm.", answer: "symmetric" },
  { id: "b7", category: "Encryption", prompt: "RSA is a ___ encryption algorithm.", answer: "asymmetric" },
  { id: "b8", category: "Phishing", prompt: "Phishing attacks delivered via voice calls are called ___.", answer: "vishing" },
  { id: "b9", category: "Phishing", prompt: "Phishing targeting executives is known as ___.", answer: "whaling" },
  { id: "b10", category: "Malware", prompt: "___ encrypts a victim's files and demands payment.", answer: "Ransomware" },
  { id: "b11", category: "SIEM/SOC Basics", prompt: "___ aggregates logs from multiple sources for detection and analysis.", answer: "SIEM" },
  { id: "b12", category: "Incident Response", prompt: "The first phase of NIST's incident response lifecycle is ___.", answer: "Preparation" },
  { id: "b13", category: "Network Security", prompt: "An ___ detects but does not block malicious traffic.", answer: "IDS" },
  { id: "b14", category: "Network Security", prompt: "TCP port ___ is used by HTTPS by default.", answer: "443" },
  { id: "b15", category: "Vulnerability Management", prompt: "A CVSS score of 9.0 or higher is classified as ___.", answer: "Critical" },
  { id: "b16", category: "Risk Assessments", prompt: "Risk that remains after applying controls is called ___ risk.", answer: "residual" },
  { id: "b17", category: "Business Continuity", prompt: "___ is the maximum tolerable downtime after a disruption.", answer: "RTO" },
  { id: "b18", category: "Disaster Recovery", prompt: "___ is the maximum acceptable amount of data loss measured in time.", answer: "RPO" },
  { id: "b19", category: "Cloud Security Basics", prompt: "The ___ Responsibility Model defines security duties between provider and customer.", answer: "Shared" },
  { id: "b20", category: "NIST Framework", prompt: "NIST CSF 2.0 added a new function called ___.", answer: "Govern" },
  { id: "b21", category: "Zero Trust", prompt: "Zero Trust assumes the network is always ___.", answer: "hostile", acceptable: ["untrusted", "compromised"] },
  { id: "b22", category: "Endpoint Security", prompt: "___ stands for Endpoint Detection and Response.", answer: "EDR" },
];
