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
    description:
      "Component architecture, fluid responsive layouts, modern state synchronization, and micro-interactions.",
    skills: [
      {
        name: "React",
        icon: "/tech_icons/react.svg",
        highlight: "Virtual DOM reconciliation & React 19 architecture"
      },
      {
        name: "JavaScript",
        icon: "/tech_icons/javascript.svg",
        highlight: "ESNext syntax, asynchronous event loop & web APIs"
      },
      {
        name: "TypeScript",
        icon: "/tech_icons/typescript.svg",
        highlight: "Static type contracts, generics & compile-time safety"
      },
      {
        name: "Next.js",
        icon: "/tech_icons/nextjs.svg",
        highlight: "Hybrid SSR, static rendering & API route optimization"
      },
      {
        name: "Tailwind CSS",
        icon: "/tech_icons/tailwind.svg",
        highlight: "Design token architecture & responsive fluid systems"
      },
      {
        name: "GSAP",
        icon: "/tech_icons/gsap.svg",
        highlight: "ScrollTrigger, timeline choreography & compositor tweens"
      }
    ]
  },
  {
    category: "BACKEND",
    description:
      "Robust REST services, data persistence, modular middleware layers, and secure access protocols.",
    skills: [
      {
        name: "Node.js",
        icon: "/tech_icons/nodejs.svg",
        highlight: "Event-driven asynchronous runtime & worker threads"
      },
      {
        name: "Express.js",
        icon: "/tech_icons/express.svg",
        highlight: "Modular middleware pipelines, routing & error barriers"
      },
      {
        name: "MongoDB",
        icon: "/tech_icons/mongodb.svg",
        highlight: "Schema modeling, aggregation pipelines & indexing"
      },
      {
        name: "JWT",
        icon: "/tech_icons/jwt.svg",
        highlight: "Dual-token rotation, HTTP-only cookies & session integrity"
      },
      {
        name: "REST APIs",
        icon: "/tech_icons/nodejs.svg",
        highlight: "Contract-first endpoint design, validation & rate limiting"
      }
    ]
  },
  {
    category: "REAL-TIME / AI",
    description:
      "Low-latency media mesh, bidirectional socket protocols, and multimodal LLM integrations.",
    skills: [
      {
        name: "Socket.io",
        icon: "/tech_icons/socketio.svg",
        highlight: "Bidirectional WebSocket channels & live presence sync"
      },
      {
        name: "WebRTC",
        icon: "/tech_icons/webrtc.svg",
        highlight: "Peer-to-peer audio/video streaming & ICE/SDP negotiation"
      },
      {
        name: "Gemini AI",
        icon: "/tech_icons/geminiai.svg",
        highlight: "Multimodal LLM prompts, structured JSON & career insights"
      }
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
      "An AI-powered career preparation platform that analyzes a user's resume, self-description, and target job description to identify skill gaps and generate personalized interview preparation. The platform turns a candidate's existing profile into a structured preparation strategy instead of providing generic interview questions.",
    tags: [
      "React",
      "Node.js",
      "Express",
      "MongoDB",
      "JWT",
      "Gemini AI",
      "Puppeteer",
    ],
    repoLink: "https://github.com/hamzaKhan2004/AI-Career-Coach",
    demoLink: "https://ai-career-coach-xcz3.onrender.com",
    architectureDetail:
      "The application combines a React frontend with a Node.js and Express backend, MongoDB persistence, JWT-based authentication, and Google Gemini multimodal capabilities. Resume documents can be analyzed alongside user-provided career information and target job requirements. The backend structures the model output into useful career insights such as skill gaps, preparation areas, and interview-focused recommendations rather than returning unstructured model text."
  },

  {
    id: "02",
    rawId: 2,
    image: "/project_img/nova-search.png",
    title: "Nova Search",
    description:
      "A full-stack AI search application inspired by modern answer engines. Nova Search combines web search, AI-generated responses, conversation history, authentication, and a responsive search experience to help users research topics through a conversational interface.",
    tags: [
      "React",
      "Node.js",
      "Express",
      "MongoDB",
      "Node Mailer",
      "Gemini AI",
      "Tavily",
      "Langchain",
      "LangGraph",
      "Socket.io",
    ],
    repoLink: "https://github.com/hamzaKhan2004/Nova-Search",
    demoLink: "https://nova-search-frontend.onrender.com",
    architectureDetail:
      "Nova Search follows a MERN-based client-server architecture where the React frontend communicates with a Node.js and Express backend. Tavily provides web-search capabilities while Gemini processes retrieved information and generates the final response. MongoDB is used for persistence such as users and conversation data, while authentication protects user-specific resources. The application also maintains previous conversation context so subsequent questions can be answered with awareness of the active search session."
  },

  {
    id: "03",
    rawId: 3,
    image: "/project_img/codehub.png",
    title: "CodeHub",
    description:
      "A full-stack GitHub-inspired developer platform for creating repositories, managing source code, uploading files, and organizing projects through a familiar repository-based workflow.",
    tags: [
      "React",
      "Node.js",
      "Express",
      "MongoDB",
      "AWS S3",
      "AWS Amplify",
    ],
    repoLink: "https://github.com/hamzaKhan2004/CodeHub",
    demoLink: "",
    architectureDetail:
      "CodeHub is structured as a full-stack application with separate frontend and backend layers. The platform models repositories and their associated code/files on the server while exposing API endpoints for repository management and developer workflows. The architecture focuses on separating the presentation layer from backend services and persistence so operations such as repository creation, file management, uploads, and collaboration can be handled independently and extended as the platform grows."
  },
  {
    id: "04",
    rawId: 4,
    image: "/project_img/primecall.png",
    title: "PrimeCall",
    description:
      "A real-time video calling application built with WebRTC, Socket.io, and the MERN stack. It enables users to communicate through real-time video and audio calls with a responsive interface designed around low-latency communication.",
    tags: [
      "React",
      "Node.js",
      "Express",
      "MongoDB",
      "WebRTC",
      "Socket.io"
    ],
    repoLink: "https://github.com/hamzaKhan2004/PrimeCall",
    demoLink: "https://primecallfrontend.onrender.com",
    architectureDetail:
      "Architected around WebRTC RTCPeerConnection for peer-to-peer media communication with Socket.io acting as the signaling layer. The signaling server coordinates connection setup and ICE candidate exchange while WebRTC handles the actual audio and video streams. The application also manages media stream tracks and connection state through the React interface, creating a responsive real-time calling experience."
  },
  {
    id: "05",
    rawId: 5,
    image: "/project_img/blog-app.png",
    title: "Blog App",
    description:
      "A MERN-based blogging platform for creating, editing, publishing, and managing dynamic blog content. The application provides a complete content-management workflow through a responsive web interface.",
    tags: [
      "React",
      "Node.js",
      "Express",
      "MongoDB"
    ],
    repoLink: "https://github.com/hamzaKhan2004/Blog-App",
    demoLink: "https://blog-app-az61.onrender.com",
    architectureDetail:
      "Implemented as a full-stack CRUD application using React for the client interface and Node.js with Express for backend API services. MongoDB provides persistent storage for users and blog content. The system separates content operations into API endpoints so posts can be created, retrieved, updated, and deleted without coupling the frontend directly to the database."
  },
  {
    id: "06",
    rawId: 6,
    image: "/project_img/expense-tracker.png",
    title: "Expense Tracker",
    description:
      "A full-stack finance management application that allows users to manage personal income and expenses through a responsive web-based interface. It provides a structured way to record transactions, organize financial activity, and understand personal spending.",
    tags: [
      "React",
      "Node.js",
      "Express",
      "MongoDB"
    ],
    repoLink: "https://github.com/hamzaKhan2004/Expense-Tracker",
    demoLink: "https://expense-tracker-cial.onrender.com",
    architectureDetail:
      "Built with a MERN architecture where React handles the interactive client interface and Node.js with Express provides the REST API layer. MongoDB stores user and transaction data using structured collections, allowing financial records to be created, updated, retrieved, and removed through API operations. The frontend organizes transaction data into a responsive interface designed for practical day-to-day expense management."
  },




];

export default {
  profile,
  skillsCategorized,
  projects
};