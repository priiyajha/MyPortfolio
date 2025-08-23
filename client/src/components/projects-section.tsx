import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Project } from "@shared/schema";
import {ProjectCarousel} from "./project-carousel";

interface ProjectsSectionProps {
  onProjectClick: (projectId: string) => void;
}

export default function ProjectsSection({ onProjectClick }: ProjectsSectionProps) {
  const { data: featuredProjects = [], isLoading: featuredLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects/featured"],
  });

  const { data: webProjects = [], isLoading: webLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects/category/web"],
  });
  const { data: genaiProjects = [], isLoading: genaiLoading } = useQuery<Project[]>({
        queryKey: ["/api/projects/category/genai"],
  });
  const { data: otherProjects = [], isLoading: otherLoading } = useQuery<Project[]>({
        queryKey: ["/api/projects/category/other"],
    });


  return (
    <section id="projects" className="py-16">
      {/* Featured Projects */}
      <motion.div
        className="mb-16"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
          <div className="px-3 sm:px-4 md:px-6 lg:px-12" style={{ marginBottom: '16px', marginTop: '0' }}>
              <h2 style={{
                  fontFamily: 'Netflix Sans, Helvetica Neue, Segoe UI, Roboto, Ubuntu, sans-serif',
                  fontWeight: '500',
                  fontSize: 'clamp(16px, 4vw, 20px)',
                  lineHeight: '1.4',
                  color: '#e5e5e5',
                  letterSpacing: '0.15px',
                  margin: '0'
              }}>
                  Featured Projects
              </h2>
          </div>
        {featuredLoading ? (
          <div className="px-4 sm:px-6 md:px-12">
            <div className="text-netflix-light-gray text-sm sm:text-base">Loading featured projects...</div>
          </div>
        ) : (
          <ProjectCarousel projects={featuredProjects} onProjectClick={onProjectClick} />
        )}
      </motion.div>

      {/* Web Development Projects */}
      <motion.div
        className="mb-16"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        viewport={{ once: true }}
      >
          <div className="px-3 sm:px-4 md:px-6 lg:px-12" style={{ marginBottom: '16px', marginTop: '0' }}>
              <h2 style={{
                  fontFamily: 'Netflix Sans, Helvetica Neue, Segoe UI, Roboto, Ubuntu, sans-serif',
                  fontWeight: '500',
                  fontSize: 'clamp(16px, 4vw, 20px)',
                  lineHeight: '1.4',
                  color: '#e5e5e5',
                  letterSpacing: '0.15px',
                  margin: '0'
              }}>
                  Web Development Projects
              </h2>
              </div>
        
        {webLoading ? (
          <div className="px-4 sm:px-6 md:px-12">
            <div className="text-netflix-light-gray text-sm sm:text-base">Loading web projects...</div>
          </div>
        ) : (
          <ProjectCarousel projects={webProjects} onProjectClick={onProjectClick} />
        )}
      </motion.div>
        {/* Gen AI Projects */}
        <motion.div
            className="mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
        >
            <div className="px-3 sm:px-4 md:px-6 lg:px-12" style={{ marginBottom: '16px', marginTop: '0' }}>
                <h2 style={{
                    fontFamily: 'Netflix Sans, Helvetica Neue, Segoe UI, Roboto, Ubuntu, sans-serif',
                    fontWeight: '500',
                    fontSize: 'clamp(16px, 4vw, 20px)',
                    lineHeight: '1.4',
                    color: '#e5e5e5',
                    letterSpacing: '0.15px',
                    margin: '0'
                }}>
                    Generative AI Projects
                </h2>
            </div>

            {webLoading ? (
                <div className="px-4 sm:px-6 md:px-12">
                    <div className="text-netflix-light-gray text-sm sm:text-base">Loading gen-ai projects...</div>
                </div>
            ) : (
                <ProjectCarousel projects={genaiProjects} onProjectClick={onProjectClick} />
            )}
        </motion.div>
        <motion.div
            className="mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
        >
            <div className="px-3 sm:px-4 md:px-6 lg:px-12" style={{ marginBottom: '16px', marginTop: '0' }}>
                <h2 style={{
                    fontFamily: 'Netflix Sans, Helvetica Neue, Segoe UI, Roboto, Ubuntu, sans-serif',
                    fontWeight: '500',
                    fontSize: 'clamp(16px, 4vw, 20px)',
                    lineHeight: '1.4',
                    color: '#e5e5e5',
                    letterSpacing: '0.15px',
                    margin: '0'
                }}>
                    Other Projects
                </h2>
            </div>

            {webLoading ? (
                <div className="px-4 sm:px-6 md:px-12">
                    <div className="text-netflix-light-gray text-sm sm:text-base">Loading gen-ai projects...</div>
                </div>
            ) : (
                <ProjectCarousel projects={otherProjects} onProjectClick={onProjectClick} />
            )}
        </motion.div>
    </section>
  );
}