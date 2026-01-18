import { Icons } from "@/components/icons";
import { HomeIcon, NotebookIcon } from "lucide-react";

export const DATA = {
  name: "Beto Juarez",
  initials: "BJ",
  url: "https://betojuarez.com",
  location: "San Francisco, CA",
  locationLink: "https://www.google.com/maps/place/sanfrancisco",
  description:
    "I'm a technologist and entrepreneur who loves building tools and automations that solve real problems.",
  summary:
    "I specialize in taking AI-powered products from prototype to production, with deep experience managing technical implementation from requirements gathering through production deployment. I particularly enjoy building products for the real estate industry.",
  avatarUrl: "/avatar.png",
  navbar: [
    { href: "/", icon: HomeIcon, label: "Home" },
    { href: "/blog", icon: NotebookIcon, label: "Blog" },
  ],
  contact: {
    email: "betoiii@gmail.com",
    tel: "+123456789",
    social: {
      YouTube: {
        name: "YouTube",
        url: "https://www.youtube.com/@betoiii",
        icon: Icons.youtube,
        navbar: true,
      },
      LinkedIn: {
        name: "LinkedIn",
        url: "https://www.linkedin.com/in/betojuareziii/",
        icon: Icons.linkedin,
        navbar: true,
      },
      X: {
        name: "X",
        url: "https://x.com/betoiii",
        icon: Icons.x,
        navbar: true,
      },
      email: {
        name: "Send Email",
        url: "mailto:betoiii@gmail.com",
        icon: Icons.email,
        navbar: false,
      },
    },
  },

  work: [
    {
      company: "Flair Labs",
      href: "https://flairlabs.ai",
      badges: [],
      location: "San Francisco, CA",
      title: "Solutions Architect",
      logoUrl: "/flair-logo.png",
      start: "Nov 2025",
      end: "Present",
      description:
        "Leading GTM for Flair Labs' voice AI solutions. Architecting solutions for high-traffic platforms serving millions of calls.",
    },
    {
      company: "Aurea / CloudFix",
      href: "https://cloudfix.com",
      badges: [],
      location: "Austin, TX",
      title: "Solutions Architect",
      logoUrl: "/cloudfix-logo.png",
      start: "Jun 2023",
      end: "May 2023",
      description:
        "Enterprise sales and GTM for CloudFix, an AWS cost-savings product, and Aurea, a private equity portfolio of SaaS companies.",
    },
    {
      company: "Keller Williams",
      href: "https://kellerwilliams.com",
      badges: [],
      location: "Austin, TX",
      title: "Principal Product Manager",
      logoUrl: "/keller-logo.png",
      start: "May 2018",
      end: "Feb 2020",
      description:
        "Venture advisor and founding product manager of KellerCovered, a homeowner's insurance marketplace.",
    },
  ],
  education: [
    {
      school: "Stanford University",
      href: "https://stanford.edu",
      degree: "Bachelor of Arts in International Relations",
      logoUrl: "/stanford-logo.png",
      start: "2003",
      end: "2007",
    },
    {
      school: "MIT Sloan School of Management",
      href: "https://mit.edu",
      degree: "Master of Business Administration",
      logoUrl: "/mit-logo.png",
      start: "2013",
      end: "2015",
    },
  ],
  projects: [
    {
      title: "Project One",
      href: "https://project-one.com",
      dates: "Jan 2024 - Present",
      active: true,
      description:
        "A description of your first project. Explain what it does, the technologies used, and its impact.",
      technologies: [
        "Next.js",
        "TypeScript",
        "PostgreSQL",
        "TailwindCSS",
        "Shadcn UI",
      ],
      links: [
        {
          type: "Website",
          href: "https://project-one.com",
          icon: <Icons.globe className="size-3" />,
        },
      ],
      image: "",
      video: "",
    },
    {
      title: "Project Two",
      href: "https://project-two.com",
      dates: "Jun 2023 - Dec 2023",
      active: false,
      description:
        "A description of your second project. Highlight key features and achievements.",
      technologies: [
        "React",
        "Node.js",
        "MongoDB",
        "Express",
        "TailwindCSS",
      ],
      links: [
        {
          type: "Source",
          href: "https://github.com/",
          icon: <Icons.github className="size-3" />,
        },
      ],
      image: "",
      video: "",
    },
  ],
} as const;
