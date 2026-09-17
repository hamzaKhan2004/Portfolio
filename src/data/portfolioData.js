// Centralized portfolio data for Hamza Akil Khan

export const profile = {
  name: "Hamza Akil Khan",
  role: "MERN Stack Developer",
  initials: "HK",
  avatarUrl: "/defaultUserImg.jpeg",

  bio: "Computer Engineering graduate and MERN Stack Developer focused on building full-stack applications, AI-powered products, secure authentication systems, and interactive web experiences.",

  location: "Mumbai, Maharashtra",
  email: "khanhamzatz@gmail.com",

  github: "https://github.com/hamzaKhan2004",
  linkedin: "https://www.linkedin.com/in/hamza-khan-47a604347",

  resumeUrl: "/Hamza__Resume.pdf",

  skills: [
    "JavaScript",
    "React.js",
    "Node.js",
    "Express.js",
    "MongoDB",
    "Next.js",
    "TypeScript",
    "Tailwind CSS",
    "HTML5",
    "CSS3",
    "JWT",
    "REST APIs",
    "Git",
    "GitHub",
    "GSAP",
    "WebRTC",
    "Socket.io",
    "Gemini AI"
  ],

  experienceYears: "Fresher",
  projectsShipped: "8+"
};

export const skillsCategorized = [
  {
    category: "FRONTEND",
    description: "Component architecture, fluid responsive layouts, modern state synchronization, and micro-interactions.",
    skills: [
      { name: "React", icon: "/tech_icons/react.svg", highlight: "Virtual DOM reconciliation & React 19 architecture" },
      { name: "JavaScript", icon: "/tech_icons/javascript.svg", highlight: "ESNext syntax, asynchronous event loop & web APIs" },
      { name: "TypeScript", icon: "/tech_icons/typescript.svg", highlight: "Static type contracts, generics & compile-time safety" },
      { name: "Next.js", icon: "/tech_icons/nextjs.svg", highlight: "Hybrid SSR, static rendering & API route optimization" },
      { name: "Tailwind CSS", icon: "/tech_icons/tailwind.svg", highlight: "Design token architecture & responsive fluid systems" },
      { name: "GSAP", icon: "/tech_icons/gsap.svg", highlight: "ScrollTrigger, timeline choreography & compositor tweens" }
    ]
  },
  {
    category: "BACKEND",
    description: "Robust REST services, data persistence, modular middleware layers, and secure access protocols.",
    skills: [
      { name: "Node.js", icon: "/tech_icons/nodejs.svg", highlight: "Event-driven asynchronous runtime & worker threads" },
      { name: "Express.js", icon: "/tech_icons/express.svg", highlight: "Modular middleware pipelines, routing & error barriers" },
      { name: "MongoDB", icon: "/tech_icons/mongodb.svg", highlight: "Schema modeling, aggregation pipelines & indexing" },
      { name: "JWT", icon: "/tech_icons/jwt.svg", highlight: "Dual-token rotation, HTTP-only cookies & session integrity" },
      { name: "REST APIs", icon: "/tech_icons/nodejs.svg", highlight: "Contract-first endpoint design, validation & rate limiting" }
    ]
  },
  {
    category: "REAL-TIME / AI",
    description: "Low-latency media mesh, bidirectional socket protocols, and multimodal LLM integrations.",
    skills: [
      { name: "Socket.io", icon: "/tech_icons/socketio.svg", highlight: "Bidirectional WebSocket channels & live presence sync" },
      { name: "WebRTC", icon: "/tech_icons/webrtc.svg", highlight: "Peer-to-peer audio/video streaming & ICE/SDP negotiation" },
      { name: "Gemini AI", icon: "/tech_icons/geminiai.svg", highlight: "Multimodal LLM prompts, structured JSON & career insights" }
    ]
  }
];

export const projects = [
  {
    id: "01",
    rawId: 1,
    image: "/project_img/ai-career-coach.png",
    title: "AI Career Coach",
    description:
      "An AI-powered career preparation platform that analyzes a user's resume, self-description, and target job description to identify skill gaps and generate personalized interview preparation.",
    tags: [
      "React",
      "Node.js",
      "Express",
      "MongoDB",
      "Gemini AI",
      "JWT"
    ],
    repoLink: "https://github.com/hamzaKhan2004/AI-Career-Coach",
    demoLink: "https://ai-career-coach-xcz3.onrender.com",
    architectureDetail: "Integrates Google Gemini multimodal LLM to parse PDF resumes, evaluate semantic matches against live job descriptions, and deliver structured skill-gap analysis with sub-second response streaming."
  },
  {
    id: "02",
    rawId: 2,
    image: "/project_img/expense-tracker.png",
    title: "Expense Tracker",
    description:
      "A full-stack finance management application that allows users to manage personal income and expenses through a web-based interface.",
    tags: [
      "React",
      "Node.js",
      "Express",
      "MongoDB"
    ],
    repoLink: "https://github.com/hamzaKhan2004/Expense-Tracker",
    demoLink: "https://expense-tracker-cial.onrender.com",
    architectureDetail: "Engineered with indexed MongoDB financial schemas, client-side caching, and responsive transaction categorization for real-time monthly budget balancing."
  },
  {
    id: "03",
    rawId: 3,
    image: "/project_img/blog-app.png",
    title: "Blog App",
    description:
      "A MERN-based blogging application for creating and managing dynamic blog content.",
    tags: [
      "React",
      "Node.js",
      "Express",
      "MongoDB"
    ],
    repoLink: "https://github.com/hamzaKhan2004/Blog-App",
    demoLink: "https://blog-app-az61.onrender.com",
    architectureDetail: "Full CRUD content management system featuring rich markdown parsing, tag-based taxonomic indexing, and image upload pipelines."
  },
  {
    id: "04",
    rawId: 4,
    title: "PrimeCall",
    image: "/project_img/primecall.png",
    description:
      "A real-time video calling application built with WebRTC, Socket.io, and the MERN stack. It enables users to communicate through real-time video and audio calls with a responsive interface.",
    tags: ["React", "Node.js", "Express", "MongoDB", "WebRTC", "Socket.io"],
    repoLink: "https://github.com/hamzaKhan2004/PrimeCall",
    demoLink: "https://primecallfrontend.onrender.com",
    architectureDetail: "Architected around RTCPeerConnection mesh topology with Socket.io signaling servers, dynamic ICE candidate exchange, and responsive media stream track controls."
  },
  {
    id: "05",
    rawId: 5,
    image: "/project_img/planvista-3d.png",
    title: "PlanVista 3D",
    description:
      "A web-based application that converts 2D architectural floor plans into interactive 3D models by analyzing blueprints and generating a 3D representation.",
    tags: [
      "React",
      "JavaScript",
      "Python",
      "Flask",
      "OpenCV",
      "Blender",
      "3D"
    ],
    repoLink: "https://github.com/hamzaKhan2004/PlanVista3D",
    demoLink: "",
    architectureDetail: "Combines OpenCV computer vision wall detection with automated 3D mesh extrusion algorithms, exported directly for web-based interactive navigation."
  },
  {
    id: "06",
    rawId: 6,
    image: "/project_img/authentication-system.png",
    title: "Authentication System",
    description:
      "A secure authentication system implementing access and refresh tokens, refresh-token rotation, HTTP-only cookies, password hashing, session management, and user profile management.",
    tags: [
      "Node.js",
      "Express",
      "MongoDB",
      "JWT",
      "Security"
    ],
    repoLink: "https://github.com/hamzaKhan2004/Authentication-System",
    demoLink: "",
    architectureDetail: "Zero-trust session lifecycle featuring cryptographically salted Bcrypt hashes, short-lived JWT access tokens, automatic refresh-token reuse detection, and strict SameSite cookies."
  }
];

export default {
  profile,
  skillsCategorized,
  projects
};
