import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Project } from "@shared/schema";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  X,
  Play,
  Plus,
  Volume2,
  VolumeX,
  ThumbsUp,
  ChevronLeft,
  ChevronRight,
  Share,
  Copy,
  Check,
  ExternalLink, Github
} from "lucide-react";

interface NetflixModalProps {
  projectId: string | null;
  onClose: () => void;
  onProjectSwitch?: (projectId: string) => void;
}

export default function NetflixModal({ projectId, onClose, onProjectSwitch }: NetflixModalProps) {
  const [isMuted, setIsMuted] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copiedProject, setCopiedProject] = useState(false);
  const [modalKey, setModalKey] = useState(0);
  const [cacheBreaker, setCacheBreaker] = useState(Date.now() + 99999);
  const imageScrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const { data: project, isLoading } = useQuery<Project>({
    queryKey: ["/api/projects", projectId],
    enabled: !!projectId,
  });

  // Reset image index and selected image when project changes
  useEffect(() => {
    setCurrentImageIndex(0);
    setSelectedImage(null);
    setModalKey(prev => prev + 1); // Force thumbnail refresh
    setCacheBreaker(Date.now()); // Force cache refresh
  }, [projectId]);

  const { data: featuredProjects = [] } = useQuery<Project[]>({
    queryKey: ["/api/projects/featured"],
  });

  // Static thumbnail mapping for "More Like This" section
  const getThumbnailPath = (projectId: string, title: string): string => {
    const thumbnailMap: Record<string, string> = {
      "1": "/attached_assets/trip-planner.png", // Trip Planner
      "2": "/attached_assets/farmfolio.jpeg", // Netflix Inspired Portfolio
      "3": "/attached_assets/netflixinsp.jpeg", // FarmFolio
      "4": "/attached_assets/AiP.jpeg",// AI Interview Platform
      "5":"`" ,//
      "6":"",//
      "7":"",//
      "8":"",//
      "9":"",//
      "10":"",//
    };

    const basePath = thumbnailMap[projectId] || "/default-thumbnail.jpg";
    return basePath + "?cb=" + cacheBreaker;
  };

  // Custom "More Like This" selection - replace specific projects
  const getMoreLikeThisProjects = () => {
    // Define replacement mapping
    const replacements: Record<string, string> = {
      "1": "2",
      "2": "3",
      "3": "4",
      "4": "1",
      "5":"6",
      "6": "7",
      "7": "8",
      "8": "9",
      "9": "10",
      "10": "4",
    };

    return featuredProjects
        .map(project => {
          // If this project should be replaced, find the replacement
          if (replacements[project.id]) {
            const replacementProject = featuredProjects.find(p => p.id === replacements[project.id]);
            return replacementProject || project;
          }
          return project;
        })
        .filter(p => p.id !== projectId) // Filter out current project
        .slice(0, 10);
  };

  const moreLikeThisProjects = getMoreLikeThisProjects();

  const handleProjectClick = (newProjectId: string) => {
    if (onProjectSwitch) {
      onProjectSwitch(newProjectId);
    }
  };

  // Close share menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (showShareMenu && !target.closest('[data-share-menu]')) {
        setShowShareMenu(false);
      }
    };

    if (showShareMenu) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showShareMenu]);

  const copyProjectLink = async () => {
    if (!project) return;

    const projectUrl = `${window.location.origin}?project=${project.id}`;
    try {
      await navigator.clipboard.writeText(projectUrl);
      setCopiedProject(true);
      setTimeout(() => {
        setCopiedProject(false);
        setShowShareMenu(false);
      }, 2000);
      toast({
        title: "Link copied!",
        description: "Project link has been copied to clipboard.",
      });
    } catch (err) {
      console.error('Failed to copy: ', err);
      // Fallback for older browsers or failed clipboard access
      try {
        const textArea = document.createElement('textarea');
        textArea.value = projectUrl;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        setCopiedProject(true);
        setTimeout(() => {
          setCopiedProject(false);
          setShowShareMenu(false);
        }, 2000);
        toast({
          title: "Link copied!",
          description: "Project link has been copied to clipboard.",
        });
      } catch (fallbackErr) {
        console.error('Fallback copy failed: ', fallbackErr);
      }
    }
  };

  const shareOnSocial = (platform: string) => {
    if (!project) return;

    const projectUrl = encodeURIComponent(`${window.location.origin}?project=${project.id}`);
    const text = encodeURIComponent(`Check out this project: ${project.title}`);

    let shareUrl = '';
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${projectUrl}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${projectUrl}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${text}%20${projectUrl}`;
        break;
      case 'telegram':
        shareUrl = `https://t.me/share/url?url=${projectUrl}&text=${text}`;
        break;
      case 'instagram':
        // Instagram doesn't support direct URL sharing, so we'll copy to clipboard
        navigator.clipboard.writeText(`${decodeURIComponent(text)} ${decodeURIComponent(projectUrl)}`);
        setCopiedProject(true);
        setTimeout(() => {
          setCopiedProject(false);
          setShowShareMenu(false);
        }, 2000);
        toast({
          title: "Link copied for Instagram!",
          description: "Project link has been copied to clipboard for Instagram sharing.",
        });
        return;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
      setShowShareMenu(false);
    }
  };

  if (!projectId) return null;


  return (
      <AnimatePresence>
        <motion.div
            key={`netflix-modal-${projectId}`}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
        >
          <motion.div
              className="bg-[#141414] rounded-lg max-w-5xl w-full max-h-[95vh] overflow-y-auto relative mx-2 sm:mx-4"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
          >
            {isLoading ? (
                <div className="text-center py-8">
                  <div className="text-white text-xl">Loading project details...</div>
                </div> ) : project ? (
                <>
                  {/* Video/Image Header Section */}
                  <div className="video-header-section relative h-[40vh] sm:h-[50vh] md:h-[60vh] overflow-hidden rounded-t-lg">
                    {project.video ? (
                        <video
                            src={project.video}
                            className="w-full h-full object-cover"
                            autoPlay
                            loop
                            muted={isMuted}
                            playsInline
                            preload="metadata"
                            onError={(e) => {
                              console.warn('Failed to load project video:', project.video);
                            }}
                        />
                    ) : (
                        <img
                            src={project.image}
                            alt={project.title}
                            loading="lazy"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              console.warn('Failed to load project image:', project.image);
                              e.currentTarget.src = "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450";
                            }}
                        />
                    )}
                    {/* Video Controls Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent">
                      {/* Close Button */}
                      <Button
                          variant="ghost"
                          size="icon"
                          onClick={onClose}
                          className="absolute top-4 right-4 text-white bg-black/70 hover:bg-black/90 rounded-full w-10 h-10 flex items-center justify-center backdrop-blur-sm"
                      >
                        <X className="w-5 h-5" />
                      </Button>

                      {/* Volume Control */}
                      {project.video && (
                          <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setIsMuted(!isMuted)}
                              className="absolute bottom-4 right-4 text-white hover:bg-white/20 rounded-full"
                          >
                            {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                          </Button>
                      )}
                      {/* Project Title and Buttons - Bottom Left */}
                      <div className="absolute bottom-4 sm:bottom-8 left-4 sm:left-8 right-4 sm:right-8">
                        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-6">
                          {project.title}
                        </h1>

                        <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-3 sm:mb-6">
                          {/* Restart Video Button */}
                          <Button
                              className="bg-white text-black hover:bg-white/90 font-semibold px-3 sm:px-6 py-2 text-sm sm:text-base"
                              onClick={() => {
                                const video = document.querySelector('video');
                                if (video) {
                                  video.currentTime = 0;
                                  video.play();
                                }
                              }}
                          >
                            <Play className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2 fill-current" />
                            <span className="hidden sm:inline">Restart Video</span>
                            <span className="sm:hidden">Play</span>
                          </Button>
                          {/* Add to List Button */}
                          <Button
                              variant="outline"
                              className="border-2 border-white/70 text-white bg-white/10 hover:bg-white/20 font-semibold px-3 sm:px-6 py-2 text-sm sm:text-base"
                          >
                            <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                            <span className="hidden sm:inline">Add to List</span>
                            <span className="sm:hidden">List</span>
                          </Button>

                          {/* Like Icon */}
                          <Button
                              variant="ghost"
                              size="icon"
                              className="text-white hover:bg-white/20 rounded-full border-2 border-white/70"
                          >
                            <ThumbsUp className="w-5 h-5" />
                          </Button>
                          {/* Share Button */}
                          <div className="relative" data-share-menu>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-white hover:bg-white/20 rounded-full border-2 border-white/70"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setShowShareMenu(!showShareMenu);
                                }}
                            >
                              <Share className="w-5 h-5" />
                            </Button>
                            {/* Share Dropdown Menu */}
                            {showShareMenu && (
                                <motion.div
                                    className="fixed bg-black/95 backdrop-blur-md rounded-lg p-1 w-[120px] xs:w-[130px] sm:w-[140px] md:w-[150px] border border-white/10 shadow-2xl"
                                    style={{
                                      top: '60px',
                                      right: '10px',
                                      zIndex: 999999
                                    }}
                                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                    transition={{ duration: 0.2 }}
                                >
                                  <div className="space-y-0">
                                    <button
                                        onClick={copyProjectLink}
                                        className="flex items-center space-x-1 w-full text-left text-white hover:text-red-400 transition-colors py-0.5 px-1 rounded hover:bg-white/10"
                                    >
                                      {copiedProject ? (
                                          <Check className="w-2.5 h-2.5 xs:w-3 xs:h-3 text-green-400" />
                                      ) : (
                                          <Copy className="w-2.5 h-2.5 xs:w-3 xs:h-3" />
                                      )}
                                      <span className="text-[8px] xs:text-[9px] sm:text-xs font-medium">
                                  {copiedProject ? 'Copied!' : 'Copy Link'}
                                </span>
                                    </button>

                                    <hr className="border-gray-600 my-0" />

                                    <button
                                        onClick={() => shareOnSocial('linkedin')}
                                        className="flex items-center space-x-1 w-full text-left text-white hover:text-blue-400 transition-colors py-0.5 px-1 rounded hover:bg-white/10"
                                    >
                                      <div className="w-2.5 h-2.5 xs:w-3 xs:h-3 bg-blue-600 rounded-sm flex items-center justify-center">
                                        <span className="text-white text-[6px] xs:text-[7px] sm:text-[8px] font-bold">in</span>
                                      </div>
                                      <span className="text-[8px] xs:text-[9px] sm:text-xs font-medium">LinkedIn</span>
                                    </button>

                                    <button
                                        onClick={() => shareOnSocial('twitter')}
                                        className="flex items-center space-x-1 w-full text-left text-white hover:text-blue-400 transition-colors py-0.5 px-1 rounded hover:bg-white/10"
                                    >
                                      <div className="w-2.5 h-2.5 xs:w-3 xs:h-3 bg-black rounded-sm flex items-center justify-center border border-white">
                                        <span className="text-white text-[6px] xs:text-[7px] sm:text-[8px] font-bold">𝕏</span>
                                      </div>
                                      <span className="text-[8px] xs:text-[9px] sm:text-xs font-medium">Twitter</span>
                                    </button>

                                    <button
                                        onClick={() => shareOnSocial('whatsapp')}
                                        className="flex items-center space-x-1 w-full text-left text-white hover:text-green-400 transition-colors py-0.5 px-1 rounded hover:bg-white/10"
                                    >
                                      <div className="w-2.5 h-2.5 xs:w-3 xs:h-3 bg-green-500 rounded-sm flex items-center justify-center">
                                        <span className="text-white text-[6px] xs:text-[7px] sm:text-[8px] font-bold">W</span>
                                      </div>
                                      <span className="text-[8px] xs:text-[9px] sm:text-xs font-medium">WhatsApp</span>
                                    </button>

                                    <button
                                        onClick={() => shareOnSocial('telegram')}
                                        className="flex items-center space-x-1 w-full text-left text-white hover:text-blue-400 transition-colors py-0.5 px-1 rounded hover:bg-white/10"
                                    >
                                      <div className="w-2.5 h-2.5 xs:w-3 xs:h-3 bg-blue-500 rounded-full flex items-center justify-center">
                                        <span className="text-white text-[6px] xs:text-[7px] sm:text-[8px] font-bold">T</span>
                                      </div>
                                      <span className="text-[8px] xs:text-[9px] sm:text-xs font-medium">Telegram</span>
                                    </button>

                                    <button
                                        onClick={() => shareOnSocial('instagram')}
                                        className="flex items-center space-x-1 w-full text-left text-white hover:text-pink-400 transition-colors py-0.5 px-1 rounded hover:bg-white/10"
                                    >
                                      <div className="w-2.5 h-2.5 xs:w-3 xs:h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-sm flex items-center justify-center">
                                        <span className="text-white text-[6px] xs:text-[7px] sm:text-[8px] font-bold">IG</span>
                                      </div>
                                      <span className="text-[8px] xs:text-[9px] sm:text-xs font-medium">Instagram</span>
                                    </button>
                                  </div>
                                </motion.div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Content Section */}
                  <div className="px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-12 bg-[#141414]">
                    {/* Container with max width and centering */}
                    <div className="w-full max-w-[1280px] mx-auto">
                      {/* Two Column Layout with Blue Neon Line Separator */}
                      <div className="flex flex-col lg:flex-row">
                        {/* Left Column - All Content (2/3 width) */}
                        <div className="w-full lg:w-2/3 pr-0 lg:pr-6 flex flex-col">
                          {/* Status Tags */}
                          <div className="flex items-center gap-3 mb-6">
                        <span className="text-green-400 font-medium text-sm">
                          {project.status === "live" ? "Live in production" :
                              project.status === "completed" ? "Successfully Exited" : "In Development"}
                        </span>

                            <span>
                               {/*<span className="px-3 py-1 rounded-full border border-white text-white text-sm"/>*/}
                            <span className="px-3 py-1 rounded-full border border-white text-white text-sm">
                          {project.title === "FarmFolio"
                              ? "2024"
                              : project.title === "Trip Planner"
                                  ? "2025"
                                  : project.title === "AI Interview Platform"
                                      ? "Ongoing"
                                      : project.title === "Netflix Inspired Portfolio"
                                          ? "2025"
                                          : project.title === "AI Resume Analyzer"
                                              ? "2025"
                                              : project.title === "Student Feedback System"
                                                  ? "2025"
                                          : "2025"}
                        </span>
                            </span>
                            {/*<span className="px-3 py-1 rounded-full border border-white text-white text-sm"/>*/}
                            <span className="px-3 py-1 rounded-full border border-white text-white text-sm">
                              {project.title === "FarmFolio"
                                  ? "Web-app"
                                  : project.title === "Trip Planner"
                                      ? "Full-Stack"
                                      : project.title === "AI Interview Platform"
                                          ? "Full-Stack"
                                          : project.title === "Netflix Inspired Portfolio"
                                              ? "Full-Stack"

                                              : project.title === "Real Time Multi Object Detection"
                                              ? "Web-app"
                                              : project.title === "Omniplex"
                                              ? "SaaS App"
                                              : project.title === "NextRip"
                                              ? "Web-app"
                                                          : project.title === "AI Agent Assistant"
                                                              ? "SaaS App"
                                                              : project.title === "AI Chat with PDF"
                                                                  ? "SaaS App"
                                                                  : project.title === "AI Resume Analyzer"
                                                                      ? "SaaS App"
                                                                      : project.title === "Student Feedback System"
                                                                          ? "Web-app"
                                              : "Web Application"
                              }
                          </span>
                          </div>
                          {/* Main Title */}
                          <h2 className="text md:text-xl font-text text-white mb-8 leading-tight bg-netflix-dark ">
                            { project.title === "FarmFolio"
                                ? "Problem Statement: Farmers often struggle to choose the most suitable crops for their land due to varying geography, soil types, budgets, and cultivation goals. Additionally, they face challenges in managing crop health, addressing soil fertility issues, and accessing timely weather or market updates. Language barriers and lack of personalized guidance further complicate decision-making."
                                : project.title === "Trip Planner"
                                    ? "Problem Statement: Planning a trip is often fragmented, time-consuming, and stressful for both solo travelers and groups. Users must navigate multiple platforms to discover destinations, explore travel categories (like adventure, leisure, or budget), check real-time weather, find transport options, get personalized recommendations, and coordinate plans with others. This scattered process leads to inefficiency, confusion, and limited personalization, making travel planning cumbersome."
                                      : project.title === "AI Interview Platform"
                                        ? "Problem Statement: Traditional technical interviews are time-consuming, inconsistent, and prone to human bias. Companies struggle to evaluate candidates efficiently, while candidates receive limited, non-personalized feedback, making the hiring process slow and opaque."
                                        : project.title === "Netflix Inspired Portfolio"
                                            ? "Problem Statement: Many student portfolios are static or uninspired, and while Netflix-style clones are common, limited API access often makes them non-interactive and UI/UX unfriendly. Students struggle to create engaging, original showcases of their work without relying on copyrighted content or external dependencies."
                                              : project.title === "Real Time Multi Object Detection"
                                              ? "Problem Statement: Real-time object detection and streaming are usually limited to specialized hardware or complex setups, making AI-powered video processing inaccessible for everyday users. People lack an easy way to experience fast, interactive, and intelligent video streaming on their smartphones."
                                            : project.title === "Omniplex"
                                            ? "Problem Statement: Developers lack a unified platform to experiment, collaborate, and innovate in real time. Existing tools are fragmented, slow, and don’t support seamless multi-LLM interactions, plugin expansions, or interactive experimentation."
                                            : project.title === "NextRip"
                                            ? "Problem Statement: Building a functional e-commerce platform is challenging for both learners and enthusiasts. Integrating frontend, backend, and payment systems into a seamless, real-world application that handles live transactions is often complex and fragmented."
                                                        : project.title === "AI Agent Assistant"
                                                            ? "Problem Statement: Building AI chat applications is often complex and fragmented. Developers face challenges in, managing real-time conversations at scale, orchestrating multiple AI tools efficiently, handling prompt optimization and caching to reduce costs, providing a secure, seamless, and modern user experience."
                                                            : project.title === "AI Chat with PDF"
                                                                ? "Problem Statement: Problem Statement\n" +
                                                                "Manually searching for information in large PDFs is time-consuming and inefficient for professionals, students, and entrepreneurs. This passive process leads to wasted hours and missed critical details, making it difficult to find specific answers quickly."
                                                                : project.title === "AI Resume Analyzer"
                                                                    ?"Problem Statement: The traditional method of assessing a resume's suitability for a specific job is inefficient, often leading to wasted time for both recruiters and applicants due to a lack of objective, personalized alignment metrics. Job seekers struggle to optimize their resumes for Applicant Tracking Systems (ATS) and specific job descriptions."
                                                                    : project.title === "Student Feedback System"
                                                                        ? "Problem Statement: Educational institutions lack a unified, real-time portal to gather and synthesize comprehensive course feedback, hindering rapid quality improvement. Current manual or decentralized survey methods result in low response rates and delayed data analysis. This prevents timely identification of course strengths and weaknesses, making it difficult for faculty and administration to address student concerns and iteratively enhance the curriculum for better educational outcomes."

                                                                    : "Complex processes now run seamlessly."
                            }
                          </h2>

                          {/* Detailed Description */}
                          <p className="text-gray-100 md:text-l text-base leading-relaxed">
                            {project.title === "FarmFolio"
                                ?
                                "Proposed Solution:Farmfolio is an intelligent crop recommendation system that personalizes crop suggestions based on user inputs like geography, soil type, budget, area, and cultivation goals. It provides targeted fertilizer recommendations for specific issues, integrates real-time weather and news updates, and offers an interactive chatbot with a personality agent for engaging guidance. A translator agent uses NLP to respond in the user’s native language, even when typed phonetically in English, creating a unified, accessible platform for informed farming decisions."
                                : project.title === "Trip Planner"
                                    ? "Proposed Solution: Trip Planner is a unified, smart web platform that simplifies travel planning for individuals and groups. It consolidates destination discovery, category-based exploration, personalized recommendations, real-time weather updates, transport options, and collaborative itinerary management—all in one interactive experience. Users can explore cities by category or season, manage bookings, and plan trips seamlessly, while admins maintain full control over content and gain actionable insights through a dedicated dashboard."
                                    : project.title === "AI Interview Platform"
                                        ? "Proposed Solution: Interviewed is an AI-powered platform that automates technical interviews with real-time code evaluation and behavioral analysis. It provides detailed, personalized feedback for candidates while ensuring faster, consistent, and unbiased assessments for recruiters, making the entire process interactive and efficient."
                                        : project.title === "Netflix Inspired Portfolio"
                                            ? "Proposed Solution: Portfolio Originals draws inspiration from Netflix’s interface but presents a fully original, personalized portfolio experience. Users can showcase their own projects, live demos, and generated media in an interactive, visually appealing format. Projects are organized in categorized rows with hover previews, trailers, and links to demos and GitHub, creating an immersive experience that’s both unique and professional."
                                            : project.title === "Real Time Multi Object Detection"
                                                ? "Proposed Solution: Edge Vision turns any smartphone into an AI-powered streaming device. It detects multiple objects in real time with bounding boxes on every frame, allowing users to switch between lightweight WASM mode or high-performance Server mode. With QR pairing, network tunnels, and live performance benchmarks, it delivers a fast, interactive, and engaging edge AI streaming experience directly in the browser."
                                                : project.title === "Omniplex"
                                                    ? "Proposed Solution: Openpanel is a dynamic web ecosystem built for developers to explore, experiment, and collaborate. Powered by OpenAI and built with Next.js, React, Redux, Tailwind, and Firebase, it offers real-time updates, multi-LLM interactions, plugin support, and an interactive playground-combining search, weather, stocks, and more into a single living platform for creativity and innovation."
                                                    : project.title === "NextRip"
                                                        ? "Proposed Solution: Checkout is a full-stack e-commerce demo built on Next.js with Stripe-powered payments. It offers a polished landing page guiding users through seamless transactions, automatically redirecting after each purchase. The project demonstrates the complete journey from localhost to production, teaching developers and users how to combine frontend finesse, backend logic, and secure payments to create a live, functional commerce application."
                                                        : project.title === "AI Agent Assistant"
                                                            ?"Proposed Solution: This project delivers a next-generation AI chat platform powered by Next.js 15, LangChain, and Claude 3.5 Sonnet. It solves the above challenges through: real-time AI chat streaming with context-aware responses, intelligent tool orchestration using LangGraph for smooth multi-tool execution, prompt caching & memory management for cost-efficient performance, secure, modern, mobile-friendly UI with Clerk authentication, Convex storage, and Tailwind design"
                                                            : project.title === "AI Chat with PDF"
                                                                ?"Proposed Solution: An AI-powered SaaS app that turns PDFs into a conversational experience. Using a tech stack including Next.js for the frontend, Clerk for user authentication, and a robust backend with LangChain and Pinecone, users can upload documents and get instant, accurate answers to their questions via a chat interface. This will save significant time and transform how users interact with their documents."
                                                                : project.title === "AI Resume Analyzer"
                                                                    ?"Proposed Solution: The AI Resume Analyzer is a premium, modern web application that solves this by providing an AI-driven, serverless platform for career management.\n" +
                                                                    "\n" +
                                                                    "The solution utilizes React, TypeScript, and Puter.js to deliver the following:\n" +
                                                                    "\n" +
                                                                    "Seamless Management: Securely upload and store all resumes in one place with easy, serverless authentication.\n" +
                                                                    "\n" +
                                                                    "AI Matching: Users input a job description and receive a quantifiable ATS score and custom feedback tailored to how well their resume matches the specific listing.\n" +
                                                                    "\n" +
                                                                    "Optimization: Provides actionable insights to help job seekers quickly optimize their documents for maximum matching success."
                                                                    : project.title === "Student Feedback System"
                                                                        ?"Proposed Solution: Developed a full-stack Student Feedback System with an intuitive frontend for streamlined submissions (ratings/comments) and a robust backend (CRUD APIs). The system will instantly compute and expose aggregated, transparent analytics (average ratings, distribution charts) per course. This solution provides faculty with immediate, actionable data to track course health, optimizing decision-making and ensuring continuous quality control across all course offerings."
                                                                    : "Complex processes now run seamlessly."
                            }
                              </p>
                            </div>
                        {/* Vertical Navy Blue Separator */}
                        <div className="hidden lg:block w-px bg-navy-700 mx-6 opacity-50" style={{backgroundColor: '#1e3a8a'}}></div>

                        {/* Right Column - Project Details (1/3 width) */}

                        {/* Tech Stack - Using dynamic project data */}

                        <div className="flex flex-col items-center mt-8 mb-3">
                          {project.liveUrl ? (
                              <Button
                                  asChild
                                  className="w-full bg-netflix-red hover:bg-red-700 transition-colors"
                              >
                                <a
                                    href={project.liveUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-2"
                                >
                                  <ExternalLink className="w-4 h-4"/>
                                  View Live Project
                                </a>
                              </Button>
                          ) : (
                              <Button
                                  disabled
                                  className="w-full bg-netflix-red hover:bg-netflix-red cursor-not-allowed opacity-50 mt-8 mb-3"
                              >
                                <ExternalLink className="w-4 h-4 mr-2 mt-8 mb-3 "/>
                                View Live Project
                              </Button>
                          )}

                          {project.githubUrl ? (
                              <Button
                                  asChild
                                  variant="secondary"
                                  className="w-full bg-white/10 hover:bg-white/20 transition-colors mt-3 mb-3"
                              >
                                <a
                                    href={project.githubUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-2"
                                >
                                  <Github className="w-4 h-4"/>
                                  View Source Code
                                </a>
                              </Button>
                          ) : (
                              <Button
                                  disabled
                                  variant="secondary"
                                  className="w-full bg-white/10 hover:bg-white/10 cursor-not-allowed opacity-50"
                              >
                                <Github className="w-4 h-4 mr-2"/>
                                View Source Code
                              </Button>
                          )}


                        {project.technologies && Array.isArray(project.technologies) && project.technologies.length > 0 && (
                            <div>
                              <h4 className="font-medium text-white mt-3 mb-3">Tech Stacks:</h4>
                              <div className="flex flex-wrap gap-2">
                                {project.technologies.map((tech) => (
                                    <span
                                        key={tech}
                                        className="rounded-full border border-white text-white px-3 py-1 text-sm inline-block"
                                    >
                                {tech}
                              </span>
                                ))}
                              </div>

                            </div>
                        )}
                        </div>

                        </div>

                      </div>

                  {/* More Like This Section */}
                  {/*<div className="mt-12">*/}
                  {/*  <h3 className="text-white text-xl font-semibold mb-6">*/}
                  {/*    More Like This*/}
                  {/*  </h3>*/}
                  {/*  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">*/}
                  {/*    {moreLikeThisProjects.map((similarProject) => (*/}
                  {/*        <div*/}
                  {/*            key={`${similarProject.id}-${modalKey}`}*/}
                  {/*            className="bg-[#2F2F2F] rounded-lg overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-200 group relative"*/}
                  {/*            onClick={() => {*/}
                  {/*              // First scroll to the video section to highlight the background video*/}
                  {/*              const videoSection = document.querySelector('.video-header-section');*/}
                  {/*              if (videoSection) {*/}
                  {/*                videoSection.scrollIntoView({ behavior: 'smooth', block: 'start' });*/}
                  {/*              }*/}
                  {/*              // Then switch to the new project after a brief delay*/}
                  {/*              setTimeout(() => {*/}
                  {/*                handleProjectClick(similarProject.id);*/}
                  {/*              }, 500);*/}
                  {/*            }}*/}
                  {/*        >*/}
                  {/*          /!* Video hover preview *!/*/}
                  {/*          {similarProject.video && (*/}
                  {/*              <video*/}
                  {/*                  src={similarProject.video}*/}
                  {/*                  className="absolute inset-0 w-full h-32 object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300"*/}
                  {/*                  autoPlay*/}
                  {/*                  loop*/}
                  {/*                  muted*/}
                  {/*                  playsInline*/}
                  {/*                  preload="none"*/}

                  {/*                  style={{*/}
                  {/*                    aspectRatio: '16/9',*/}
                  {/*                    objectFit: 'cover'*/}
                  {/*                                }}*/}
                  {/*                  onError={(e) => {*/}
                  {/*                    console.warn('Failed to load similar project video:', similarProject.video);*/}
                  {/*                  }}*/}
                  {/*              />*/}
                  {/*          )}*/}
                  {/*          <img*/}
                  {/*              src={getThumbnailPath(similarProject.id, similarProject.title)}*/}
                  {/*              alt={similarProject.title}*/}
                  {/*              loading="lazy"*/}
                  {/*              decoding="async"*/}
                  {/*              fetchPriority="low"*/}
                  {/*              className="w-full h-32 object-cover group-hover:opacity-0 transition-opacity duration-300"*/}
                  {/*              style={{*/}
                  {/*                aspectRatio: '16/9',*/}
                  {/*                objectFit: 'cover'*/}
                  {/*              }}*/}
                  {/*              onError={(e) => {*/}
                  {/*                console.warn('Failed to load similar project thumbnail:', getThumbnailPath(similarProject.id, similarProject.title));*/}
                  {/*                e.currentTarget.src = "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450";*/}
                  {/*              }}*/}
                  {/*          />*/}
                  {/*          <div className="p-4">*/}
                  {/*            <div className="flex justify-between items-start mb-2">*/}
                  {/*              <h4 className="text-white font-semibold text-sm line-clamp-1">*/}
                  {/*                {similarProject.title}*/}
                  {/*              </h4>*/}
                  {/*              <div className="opacity-0 group-hover:opacity-100 transition-opacity">*/}
                  {/*                <Plus className="w-5 h-5 text-white border border-white rounded-full p-1" />*/}
                  {/*              </div>*/}
                  {/*            </div>*/}
                  {/*            <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">*/}
                  {/*            </div>*/}
                  {/*            <p className="text-gray-300 text-xs line-clamp-2">*/}
                  {/*              {similarProject.description.substring(0, 100)}...*/}
                  {/*            </p>*/}
                  {/*          </div>*/}
                  {/*        </div>*/}
                  {/*    ))}*/}
                  {/*  </div>*/}
                  {/*</div>*/}
                  </div>
                </>
            ) : (
                <div className="text-center py-8">
                  <div className="text-white">Project not found</div>
                </div>
            )}
          </motion.div>
        </motion.div>
      </AnimatePresence>
  );
}





