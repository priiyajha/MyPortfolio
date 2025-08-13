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
      // Featured Projects - Keep only 2 real ones
      {
        id: "1",
        title: "Trip Planner",
        description: "Trip Planner is a smart, collaborative travel planning platform that brings everything, destination discovery, personalized recommendations, real-time weather, transport options, and group itinerary planning, into one seamless web experience. With modern UI/UX and powerful backend integration, users can explore cities by category or season, manage bookings, and plan trips interactively, while admins maintain full control over content and insights through a dedicated dashboard.",
        image: "/attached_assets/trip-planner.png",
        video: "/attached_assets/20250731_1725_Seasons Through Travelers' Eyes_simple_compose_01k1g5c80efe0s652h0fdr7mjz_1753966935310.mp4",
        technologies: ["React & Next.js", "Node.js & Express", "PostgreSQL"],
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
      {
        id: "2",
        title: "AI Interview Platform",
        description: "An intelligent interview platform that conducts automated technical and behavioral interviews using advanced AI. Features real-time code evaluation, sentiment analysis, and detailed candidate assessments with personalized feedback.",
        image: "attached_assets/AiP.jpeg",
        video: "attached_assets/AI-Interview.mp4",
        technologies: ["Next.js", "Node.js & Express", "MongoDB", "Vapi", "Firebase"],
        category: "featured",
        liveUrl: "",
        githubUrl: "https://github.com/priiyajha/AI-Interview-Platform.git",
        featured: "true",
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

      // Web Development
      {
        id: "2",
        title: "AI Interview Platform",
        description: "An intelligent interview platform that conducts automated technical and behavioral interviews using advanced AI. Features real-time code evaluation, sentiment analysis, and detailed candidate assessments with personalized feedback.",
        image: "attached_assets/AiP.jpeg",
        video: "attached_assets/AI-Interview.mp4",
        technologies: ["Next.js", "Node.js & Express", "MongoDB", "Vapi", "Firebase"],
        category: "web",
        liveUrl: "",
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
        image: "/attached_assets/ChatGPT Image Jul 31, 2025, 02_55_14 PM_1753965385040.png",
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
        id: "3",
        title: "Netflix Inspired Portfolio",
        description: "Step into a portfolio experience designed like your favorite streaming platform. Browse projects seamlessly in categorized rows, hover for instant previews, and dive into detailed project trailers showing tech stacks, live demos, and GitHub links.",
        image: "attached_assets/Netflixinsp.jpeg",
        video: "attached_assets/Netflixinsp_v.mov",
        technologies: ["React.js", "Next.js", "Node.js & Express", "Postgresql", "Vibe Coding"],
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
        id: "6",
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
      email: "contact@portfolio.com",
      phone: "+1 (234) 567-8900",
      location: "San Francisco, CA",
      resumeUrl: "/resume.pdf",
      skills: {
        frontend: ["React.js", "Vue.js", "TypeScript", "Tailwind CSS"],
        backend: ["Node.js", "Python", "PostgreSQL", "AWS"]
      },
      social: {
        linkedin: "https://linkedin.com/in/example",
        github: "https://github.com/example",
        twitter: "https://twitter.com/example"
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