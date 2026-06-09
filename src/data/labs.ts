import {
  Shield,
  Network,
  Activity,
  Bug,
  MonitorSmartphone,
  SlidersHorizontal,
  type LucideIcon,
} from "lucide-react";

export type LabArchTier = {
  label: string;
  icon: LucideIcon;
  items: string[];
};

export type Lab = {
  slug: string;
  title: string;
  tagline: string;
  summary: string;
  status: "completed" | "in-progress";
  author: { name: string; handle: string; github: string; site?: string };
  basedOn?: { name: string; handle: string; github: string; site?: string };
  docsUrl: string;
  diagram?: string;
  architecture: LabArchTier[];
  hardware: string[];
  tasks: string[];
  highlight?: { title: string; body: string };
  skillsIntro: string;
  skills: string[];
  stack: string[];
};

export const LABS: Lab[] = [
  {
    slug: "cybersecurity-homelab",
    title: "Cybersecurity HomeLab",
    tagline: "A full enterprise environment, simulated end-to-end.",
    summary:
      "This project focuses on the development of a cybersecurity homelab by integrating various procedures, configurations, and technologies. Its primary objective is to illustrate how different components work together to simulate real-world IT environments on a small scale. The ultimate goal is to enhance understanding of the various security elements that interact to safeguard individuals and organizations in today's digital age.",
    status: "completed",
    author: {
      name: "Aruj Bardhan",
      handle: "@arujbardhan",
      github: "https://github.com/arujbardhan",
    },
    basedOn: {
      name: "David Gutiérrez",
      handle: "@birdm4nw",
      github: "https://github.com/birdm4nw",
      site: "https://davidf.io",
    },
    docsUrl: "https://github.com/birdm4nw/Cybersecurity-HomeLab",
    architecture: [
      {
        label: "Network Edge",
        icon: Shield,
        items: ["pfSense Firewall", "OpenVPN via LDAP"],
      },
      {
        label: "Directory & Core Services",
        icon: Network,
        items: ["Active Directory DS", "DNS Server", "DHCP Server", "RDP Server"],
      },
      {
        label: "Policy & Management",
        icon: SlidersHorizontal,
        items: ["Group Policy Objects", "Organizational Units", "Folder Redirection"],
      },
      {
        label: "Monitoring & Detection",
        icon: Activity,
        items: ["Splunk SIEM + Universal Forwarder", "Nessus vulnerability scans"],
      },
      {
        label: "Adversary Emulation",
        icon: Bug,
        items: ["Raspberry Pi Zero 2 W", "ICMP threat-actor machine"],
      },
      {
        label: "Platforms & Virtualization",
        icon: MonitorSmartphone,
        items: ["VMware Fusion", "VirtualBox", "Windows", "Linux", "Unix & macOS"],
      },
    ],
    hardware: [
      "MacBook M1 Pro — 16GB / 512GB — macOS Sonoma 14.5",
      "Huawei Matebook D15 — 8GB / 512GB — Windows 11 Home",
      "Raspberry Pi Zero 2 W — Ubuntu Server 22.04 (threat actor)",
    ],
    tasks: [
      "DNS & DHCP servers configuration",
      "Set up Active Directory environment",
      "Configure OpenVPN via LDAP on AD environment",
      "Set up a firewall (pfSense)",
      "Monitoring and detecting security events with SIEM platform (Splunk)",
      "Perform vulnerability scans with Nessus",
      "Simulate a threat actor behavior using a Raspberry",
      "Troubleshooting operations across various operating systems",
    ],
    highlight: {
      title: "Malware simulation & SIEM detection",
      body: "A PowerShell script on the domain controller (DC01) was compiled into an executable disguised as spotify.exe that pinged the Raspberry Pi 'threat actor.' Using Splunk SPL together with process-creation auditing (Event Code 4688), the malicious PING.EXE process spawned by spotify.exe was detected and traced back to its origin — an end-to-end threat-hunting workflow.",
    },
    skillsIntro:
      "Upon completion, this project will allow you to test and apply key skills relevant to the industry, including:",
    skills: [
      "Security auditing",
      "Understanding of network protocols (TCP/IP, DHCP, ICMP, DNS)",
      "Management of different operating systems (Linux, Windows, Unix & macOS)",
      "Problem-solving",
      "Proficiency with virtualization software (VMware, VirtualBox)",
      "Understanding of Active Directory",
    ],
    stack: [
      "pfSense",
      "Splunk",
      "Nessus",
      "Active Directory DS",
      "OpenVPN",
      "LDAP",
      "DNS",
      "DHCP",
      "RDP",
      "Group Policy",
      "Folder Redirection",
      "Windows Server 2022",
      "Windows 11",
      "Ubuntu Server",
      "macOS",
      "Raspberry Pi",
      "VMware Fusion",
      "VirtualBox",
    ],
  },
];

export const getLab = (slug: string) => LABS.find((l) => l.slug === slug);
