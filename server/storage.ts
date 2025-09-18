import { type Project, type InsertProject, type Profile, type InsertProfile } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getProjects(): Promise<Project[]>;
  getProjectsByCategory(category: string): Promise<Project[]>;
  getFeaturedProjects(): Promise<Project[]>;
  getProject(id: string): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  getProfile(): Promise<Profile | undefined>;
  createProfile(profile: InsertProfile): Promise<Profile>;
}

export class MemStorage implements IStorage {
  private projects: Map<string, Project>;
  private profileData: Profile | undefined;

  constructor() {
    this.projects = new Map();
    this.initializeData();
  }

  private initializeData() {
    // Initialize with sample portfolio data (only 2 real projects per category)
    const sampleProjects: Project[] = [
        //featured
      {
        id: "1",
        title: "Trip Planner",
        description: "Trip Planner is a smart, collaborative travel planning platform that brings everything, destination discovery, personalized recommendations, real-time weather, transport options, and group itinerary planning, into one seamless web experience. With modern UI/UX and powerful backend integration, users can explore cities by category or season, manage bookings, and plan trips interactively, while admins maintain full control over content and insights through a dedicated dashboard.",
        image: "/attached_assets/trip-planner.png",
        video: "/attached_assets/20250731_1725_Seasons Through Travelers' Eyes_simple_compose_01k1g5c80efe0s652h0fdr7mjz_1753966935310.mp4",
        technologies: ["React.js", "Node.js & Express", "PostgreSQL"],
        category: "featured",
        liveUrl: "https://trip-planner-nu-one.vercel.app/",
        githubUrl: "https://github.com/priiyajha/Your-Tour-Partner",
        featured: "true",
        status: "live",
        features: [
          "Destination discovery with category-based exploration",
          "Personalized recommendations based on preferences",
          "Real-time weather integration and forecasts",
          "Comprehensive transport options comparison",
          "Collaborative group itinerary planning",
          "Interactive booking management system",
          "Season-specific city exploration guides",
          "Admin dashboard with content and analytics control"
        ]
      },

      // Web Development
      {
        id: "6",
        title: "AI Interview Platform",
        description: "An intelligent interview platform that conducts automated technical and behavioral interviews using advanced AI. Features real-time code evaluation, sentiment analysis, and detailed candidate assessments with personalized feedback.",
        image: "attached_assets/aip.jpeg",
        video: "attached_assets/AI-Interview.mp4",
        technologies: ["Next.js", "Firebase (Auth + Firestore)", "Vapi"],
        category: "web",
        liveUrl: "https://ai-interview-platform-p0ay8j523-priiyajhas-projects.vercel.app/",
        githubUrl: "https://github.com/priiyajha/AI-Interview-Platform.git",
        featured: "false",
        status: "coming-soon",
        features: [
          "Real-time code evaluation and syntax checking",
          "AI-powered sentiment analysis during interviews",
          "Automated technical question generation",
          "Detailed candidate assessment reports",
          "Behavioral interview simulation",
          "Performance analytics and insights",
          "Integration with popular coding platforms",
          "Customizable interview templates"
        ]
      },
      {
        id: "5",
        title: "FarmFolio",
        description: "Farmfolio is an intelligent crop recommendation system that personalizes suggestions based on user inputs like geography, soil type, budget, area, and cultivation goals. Trained on curated datasets, it not only identifies the most suitable crops but also offers issue-specific fertilizer recommendations (e.g., for pests or soil fertility). The app integrates real-time weather and news updates through an interactive chatbot, enhanced with a personality agent to keep conversations engaging and a translator agent that uses NLP to detect and respond in the user's native language, even when typed phonetically in English. Built to unify diverse farming needs in one accessible platform.",
        image: "attached_assets/farmfolio.jpeg",
        video: "/attached_assets/1753954183383590_1753966280383.mp4",
        technologies: ["HTML/CSS", "JavaScript", "BotPress"],
        category: "web",
        liveUrl: "https://farmfolio-lilac.vercel.app/",
        githubUrl: "https://github.com/priiyajha/Farmfolio",
        featured: "false",
        status: "live",
        features: [
          "Personalized crop recommendations based on geography and soil",
          "Issue-specific fertilizer recommendations for pests and fertility",
          "Real-time weather integration for farming decisions",
          "Interactive chatbot with personality agent",
          "Multi-language NLP translator for native language support",
          "Curated dataset training for accurate suggestions",
          "Budget and area optimization analysis",
          "Unified platform for diverse farming needs"
        ]
      },
      {
        id: "4",
        title: "Netflix Inspired Portfolio",
        description: "Step into a portfolio experience designed like your favorite streaming platform. Browse projects seamlessly in categorized rows, hover for instant previews, and dive into detailed project trailers showing tech stacks, live demos, and GitHub links.",
        image: "attached_assets/netflixinsp.jpeg",
        video: "attached_assets/Netflixinsp_v.mov",
        technologies: ["React.js", "Node.js & Express", "Postgresql", "Vibe Coding"],
        category: "web",
        liveUrl: "https://netflixinspiredportfolio.onrender.com/",
        githubUrl: "https://github.com/priiyajha/NetflixInspiredPortfolio.git",
        featured: "true",
        status: "live",
        features: [
          "Categorized Project Rows",
          "Hover Previews: Get instant sneak peeks of each project on hover.",
          "Project Trailers: Watch detailed mini-demos for each project with tech stack and live previews.",
          "Interactive UI: Smooth animations and cinematic scrolling for a binge-worthy experience.",
          "Responsive Design: Optimized for all devices with pixel-perfect layout and Netflix-inspired aesthetic.",
          "Dynamic Content Loading: Fetch projects in real-time using React Query for seamless performance.",
          "High Customizability: Easily add or update projects without breaking the layout."
        ]
      },
      {
        id: "3",
        title: "Trip Planner",
        description: "Trip Planner is a smart, collaborative travel planning platform that brings everything, destination discovery, personalized recommendations, real-time weather, transport options, and group itinerary planning, into one seamless web experience. With modern UI/UX and powerful backend integration, users can explore cities by category or season, manage bookings, and plan trips interactively, while admins maintain full control over content and insights through a dedicated dashboard.",
        image: "/attached_assets/trip-planner.png",
        video: "/attached_assets/20250731_1725_Seasons Through Travelers' Eyes_simple_compose_01k1g5c80efe0s652h0fdr7mjz_1753966935310.mp4",
        technologies: ["React & Next.js", "Node.js & Express", "PostgreSQL"],
        category: "web",
        liveUrl: "https://trip-planner-nu-one.vercel.app/",
        githubUrl: "https://github.com/priiyajha/Your-Tour-Partner",
        featured: "false",
        status: "live",
        features: [
          "Destination discovery with category-based exploration",
          "Personalized recommendations based on preferences",
          "Real-time weather integration and forecasts",
          "Comprehensive transport options comparison",
          "Collaborative group itinerary planning",
          "Interactive booking management system",
          "Season-specific city exploration guides",
          "Admin dashboard with content and analytics control"
        ]
      },
      //gen ai projects
      // {
      //   id: "7",
      //   title: "Muti Channel Sales Agent",
      //   description: "",
      //   image: "",
      //   video: "",
      //   technologies: ["React.js", "Next.js", "Node.js & Express", "Postgresql", "Vibe Coding"],
      //   category: "genai",
      //   liveUrl: "#",
      //   githubUrl: "",
      //   featured: "false",
      //   status: "ongoing",
      //   features: [
      //     // "Categorized Project Rows",
      //     // "Hover Previews: Get instant sneak peeks of each project on hover.",
      //     // "Project Trailers: Watch detailed mini-demos for each project with tech stack and live previews.",
      //     // "Interactive UI: Smooth animations and cinematic scrolling for a binge-worthy experience.",
      //     // "Responsive Design: Optimized for all devices with pixel-perfect layout and Netflix-inspired aesthetic.",
      //     // "Dynamic Content Loading: Fetch projects in real-time using React Query for seamless performance.",
      //     // "High Customizability: Easily add or update projects without breaking the layout."
      //   ]
      // },
      {
        id: "8",
        title: "Omniplex",
        description: "An experimental leap into Next.js’ new frontier, where AI, Firebase, and raw innovation collide to shape an evolving digital ecosystem.",
        image: "attached_assets/omnipleximg.jpeg",
        video: "attached_assets/omniplex_v.mp4",
        technologies: ["Typescript", "CSS", "Next.js", "Firebase"],
        category: "genai",
        liveUrl: "",
        githubUrl: "https://github.com/priiyajha/omniplex-carbon.git",
        featured: "false",
        status: "live",
        features: [
          "A bold experiment unfolds as developers transition from the old to the new, leaving behind the comfort of pages for the uncharted territory of Next.js’ app directory.",
          "With Firebase as the beating heart, OpenAI as the mind, and a vision powered by search, weather, stocks, and more, this project isn’t just code, it’s an evolving ecosystem.",
          "Expect bugs, breakthroughs, and a roadmap filled with ambitious quests: from multi-LLM battles to plugin expansions.",
          "Built with React, Redux, and Tailwind flair, Openpanel is where community, creativity, and raw experimentation collide."
        ]
      },
      {
        id: "10",
        title: "AI Agent Assistant",
        description: "A cutting-edge AI chat app built with Next.js 15, LangChain, and Claude 3.5 Sonnet. Featuring real-time streaming, intelligent tool orchestration, and sleek design, it turns every conversation into a next-gen experience.",
        image: "attached_assets/aiaa.jpeg",
        video: "attached_assets/aiaa.mov",
        technologies: ["Typescript", "CSS", "Next.js", "Clerk", "Convex", "LangChain", "LangGraph", "Wxflows"],
        category: "genai",
        liveUrl: "",
        githubUrl: "https://github.com/priiyajha/AIAgentAssistant.git",
        featured: "true",
        status: "coming-soon",
        features: [
            "Smart AI Conversations – Powered by Claude 3.5 Sonnet with real-time streaming.",
            "Intelligent Tool Orchestration – LangChain + LangGraph for seamless tool use.",
            "Next.js 15 Performance – Fast, modern, and optimized with React 19 + Tailwind.",
            "Built-in Reliability – Clerk authentication & Convex real-time data storage.",
        ]
      },
      {
        id: "11",
        title: "AI Chat with PDF",
        description: "In a world drowning in digital paperwork, one app is here to save the day. It’s not a search engine, and it’s not just a file viewer. This is a powerful AI companion that transforms your static PDFs into a dynamic, conversational experience.",
        image: "attached_assets/ai-chat.jpeg",
        video: "attached_assets/ai-chat_m.mov",
        technologies: ["Next.js", "Clerk", "Typescript", "ShadcnUI", "LangChain", "PineCone"],
        category: "genai",
        liveUrl: "https://ai-chat-with-bhdgtcekw-priiyajhas-projects.vercel.app",
        githubUrl: "https://github.com/priiyajha/ai-chat-with-pdf.git",
        featured: "true",
        status: "coming-soon",
        features: [
          "PDF to Chat Interface: Instantly transform static PDFs into a dynamic, conversational experience.",
          "AI-Powered Answers: Get accurate and instant answers to your questions from any document's content.",
          "Secure Authentication: User authentication and data security are handled seamlessly with Clerk.",
          "Scalable Architecture: The app is built on a modern stack (Next.js, LangChain, Pinecone) designed for performance and scalability.",
        ]
      },
      //learning projects
      {
        id: "7",
        title: "Real Time Multi Object Detection",
        description: "Turn your phone into a live AI lens, streaming, detecting, and sketching objects in real time, right in your browser.",
        image: "attached_assets/realtime.jpeg",
        video: "attached_assets/werbrtc_v.mp4",
        technologies: ["Python", "Docker", "Html"],
        category: "other",
        liveUrl: "",
        githubUrl: "https://github.com/priiyajha/real-time-multi-object-detection.git",
        featured: "false",
        status: "live",
        features: [
          "A phone camera becomes the eye, the browser its canvas, and AI the mind pulling the strings.",
          "This demo streams live video from your pocket straight to your laptop, detecting multiple objects in real time and sketching bounding boxes that dance with every frame.",
          "Choose your mode: wasm for low-resource survival, server for heavy-duty inference.",
          "QR codes unlock the gateway, benchmarks expose the latency battles, and tunnels keep the stream alive across networks.",
          "This isn’t just code, it’s a front-row seat to the future of edge AI streaming. Fast, raw, and unforgiving.",
          "Stream the unseen. Detect the unexpected."
        ]
      },
      {
        id: "9",
        title: "NextRip",
        description: "From code to currency, a seamless Next.js and Stripe journey where every payment unlocks the next act.”",
        image: "attached_assets/nextrip.jpeg",
        video: "attached_assets/nextrip_v.mp4",
        technologies: ["Typescript", "Javascript", "CSS"],
        category: "other",
        liveUrl: "",
        githubUrl: "https://github.com/priiyajha/next-rip.git",
        featured: "false",
        status: "live",
        features: [
          "A landing page sets the stage.",
          "A payment gateway takes the leap. And with every successful transaction, users are seamlessly redirected into the next act.",
          "Built on Next.js, styled with Vercel’s precision, and armed with Stripe’s secure payments, this project isn’t just a tutorial, it’s a coming-of-age story for web developers learning to blend frontend flair with real-world commerce.",
          "From localhost to live payments — watch code turn into currency."
          ]
      },

    ];

    sampleProjects.forEach(project => {
      this.projects.set(project.id, project);
    });

    this.profileData = {
      id: "1",
      name: "Priya Jha",
      title: "Priya",
      subtitle: "Jha",
      bio: "Priya codes like she's curating a vibe, part full-stack dev, part automation whisperer, part marketing nerd. With the MERN stack at her fingertips and GenAI in her toolkit, she turns messy workflows into seamless systems. Beyond code, she leads with clarity, from TEDx stages to NSS teams, blending tech, voice, and vision. Quick to learn, faster to build, and always rewriting the rules, in beta, by choice.",
      mission: "Transforming complex workflows into elegant solutions through the perfect blend of technology, automation, and strategic thinking.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
      email: "jhapriiyaa2104@gmail.com",
      phone: "+91 961xxxxxxx",
      location: "India",
      resumeUrl: "attached_assets/Resume_Priya_Jha_AI.pdf",
      skills: {
        frontend: ["React.js", "Vue.js", "TypeScript", "Tailwind CSS"],
        backend: ["Node.js", "Python", "PostgreSQL", "AWS"]
      },
      social: {
        linkedin: "linkedin.com/in/priiyajhaa",
        github: "https://github.com/priiyajha",
        twitter: "https://x.com/priya_jha1488"
      }
    };
  }

  async getProjects(): Promise<Project[]> {
    return Array.from(this.projects.values());
  }

  async getProjectsByCategory(category: string): Promise<Project[]> {
    return Array.from(this.projects.values()).filter(
        project => project.category === category
    );
  }

  async getFeaturedProjects(): Promise<Project[]> {
    return Array.from(this.projects.values()).filter(
        project => project.featured === "true"
    );
  }

  async getProject(id: string): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = randomUUID();
    const project: Project = {
      id,
      title: insertProject.title,
      description: insertProject.description,
      image: insertProject.image,
      video: insertProject.video || null,
      technologies: insertProject.technologies as string[],
      category: insertProject.category,
      liveUrl: insertProject.liveUrl || null,
      githubUrl: insertProject.githubUrl || null,
      featured: insertProject.featured || null,
      status: insertProject.status || "live",
      features: insertProject.features ? [...insertProject.features] : null
    };
    this.projects.set(id, project);
    return project;
  }

  async getProfile(): Promise<Profile | undefined> {
    return this.profileData;
  }

  async createProfile(insertProfile: InsertProfile): Promise<Profile> {
    const id = randomUUID();
    const profile: Profile = {
      id,
      name: insertProfile.name,
      title: insertProfile.title,
      subtitle: insertProfile.subtitle,
      bio: insertProfile.bio,
      mission: insertProfile.mission,
      image: insertProfile.image,
      email: insertProfile.email,
      phone: insertProfile.phone,
      location: insertProfile.location,
      resumeUrl: insertProfile.resumeUrl || null,
      skills: {
        frontend: [...insertProfile.skills.frontend],
        backend: [...insertProfile.skills.backend]
      },
      social: insertProfile.social
    };
    this.profileData = profile;
    return profile;
  }
}

export const storage = new MemStorage();