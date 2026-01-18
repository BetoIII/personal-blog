import { Icons } from "@/components/icons";
import { HomeIcon, NotebookIcon } from "lucide-react";

export const DATA = {
  name: "Beto Juarez",
  initials: "BJ",
  url: "https://betojuarez.com",
  location: "San Francisco, CA",
  locationLink: "https://www.google.com/maps/place/sanfrancisco",
  description:
    "Software Engineer and entrepreneur building tools that solve real problems.",
  summary:
    "I'm a full-stack software engineer with a passion for creating elegant solutions to complex problems. I love building products that make a difference and sharing what I learn along the way.",
  avatarUrl: "/avatar.png",
  skills: [
    "React",
    "Next.js",
    "TypeScript",
    "Node.js",
    "Python",
    "PostgreSQL",
    "MongoDB",
    "AWS",
    "Docker",
    "TailwindCSS",
  ],
  navbar: [
    { href: "/", icon: HomeIcon, label: "Home" },
    { href: "/blog", icon: NotebookIcon, label: "Blog" },
  ],
  contact: {
    email: "hello@example.com",
    tel: "+123456789",
    social: {
      GitHub: {
        name: "GitHub",
        url: "https://github.com/",
        icon: Icons.github,
        navbar: true,
      },
      LinkedIn: {
        name: "LinkedIn",
        url: "https://linkedin.com/in/",
        icon: Icons.linkedin,
        navbar: true,
      },
      X: {
        name: "X",
        url: "https://x.com/",
        icon: Icons.x,
        navbar: true,
      },
      email: {
        name: "Send Email",
        url: "mailto:hello@example.com",
        icon: Icons.email,
        navbar: false,
      },
    },
  },

  work: [
    {
      company: "Your Company",
      href: "https://yourcompany.com",
      badges: [],
      location: "Remote",
      title: "Senior Software Engineer",
      logoUrl: "/company-logo.png",
      start: "Jan 2022",
      end: "Present",
      description:
        "Leading development of scalable web applications using React, Next.js, and Node.js. Architecting solutions for high-traffic platforms serving millions of users.",
    },
    {
      company: "Previous Company",
      href: "https://previouscompany.com",
      badges: [],
      location: "San Francisco, CA",
      title: "Software Engineer",
      logoUrl: "/previous-logo.png",
      start: "Jun 2020",
      end: "Dec 2021",
      description:
        "Built and maintained full-stack features for a SaaS platform. Worked with React, TypeScript, and PostgreSQL to deliver high-quality products.",
    },
  ],
  education: [
    {
      school: "University Name",
      href: "https://university.edu",
      degree: "Bachelor of Science in Computer Science",
      logoUrl: "/university-logo.png",
      start: "2016",
      end: "2020",
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
