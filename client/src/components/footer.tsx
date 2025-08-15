// import { motion } from "framer-motion";
// import { Profile } from "@shared/schema";
//
// interface FooterProps {
//   profile?: Profile;
// }
//
// export default function Footer({ profile }: FooterProps) {
//   if (!profile) {
//     return (
//       <footer id="contact" className="bg-netflix-dark py-16 px-4 md:px-12 mt-16">
//         <div className="max-w-6xl mx-auto text-center">
//           <div className="text-netflix-light-gray">Contact information not available</div>
//         </div>
//       </footer>
//     );
//   }
//
//   return (
//     <footer id="contact" className="bg-netflix-dark py-16 px-4 md:px-12 mt-16">
//       <div className="max-w-6xl mx-auto">
//         <motion.div
//           className="text-center mb-12"
//           initial={{ opacity: 0, y: 30 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.8 }}
//           viewport={{ once: true }}
//         >
//           <h2 className="text-4xl font-bold mb-6">Let's Work Together</h2>
//           <p className="text-xl text-netflix-light-gray">Ready to bring your ideas to life</p>
//         </motion.div>
//
//         {/* Contact Information */}
//         <motion.div
//           className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-8 mb-12"
//           initial={{ opacity: 0, y: 30 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.8, delay: 0.2 }}
//           viewport={{ once: true }}
//         >
//           <a
//             href={`mailto:${profile.email}`}
//             className="flex items-center space-x-2 text-netflix-light-gray hover:text-white transition-colors"
//           >
//             <span>📧</span>
//             <span>{profile.email}</span>
//           </a>
//           <a
//             href={`tel:${profile.phone}`}
//             className="flex items-center space-x-2 text-netflix-light-gray hover:text-white transition-colors"
//           >
//             <span>📞</span>
//             <span>{profile.phone}</span>
//           </a>
//           <div className="flex items-center space-x-2 text-netflix-light-gray">
//             <span>📍</span>
//             <span>{profile.location}</span>
//           </div>
//         </motion.div>
//
//         {/* Social Links */}
//         <motion.div
//           className="flex justify-center space-x-6 mb-12"
//           initial={{ opacity: 0, y: 30 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.8, delay: 0.4 }}
//           viewport={{ once: true }}
//         >
//           <a
//             href={profile.social.linkedin}
//             className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-netflix-red transition-colors"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             <i className="fab fa-linkedin-in text-xl"></i>
//           </a>
//           <a
//             href={profile.social.github}
//             className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-netflix-red transition-colors"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             <i className="fab fa-github text-xl"></i>
//           </a>
//           <a
//             href={profile.social.twitter}
//             className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-netflix-red transition-colors"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             <i className="fab fa-twitter text-xl"></i>
//           </a>
//         </motion.div>
//
//         {/* Copyright */}
//         <motion.div
//           className="text-center text-netflix-light-gray"
//           initial={{ opacity: 0 }}
//           whileInView={{ opacity: 1 }}
//           transition={{ duration: 0.8, delay: 0.6 }}
//           viewport={{ once: true }}
//         >
//           <p>&copy; 2024 Portfolio. All rights reserved.</p>
//         </motion.div>
//       </div>
//     </footer>
//   );
// }

import { motion } from "framer-motion";
import { Profile } from "@shared/schema";

interface FooterProps {
  profile?: Profile;
}

export default function Footer({ profile }: FooterProps) {
  if (!profile) {
    return (
        <footer
            id="contact"
            className="bg-gradient-to-t from-black via-netflix-dark to-netflix-dark py-16 px-4 md:px-12 mt-16"
        >
          <div className="max-w-6xl mx-auto text-center">
            <div className="text-netflix-light-gray text-lg">
              Contact information not available
            </div>
          </div>
        </footer>
    );
  }

  return (
      <footer
          id="contact"
          className="bg-gradient-to-t from-black via-netflix-dark to-netflix-dark py-16 px-4 md:px-12 mt-16"
      >
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
              Let's Work Together
            </h2>
            <p className="text-lg md:text-xl text-netflix-light-gray max-w-xl mx-auto">
              Ready to bring your ideas to life
            </p>
          </motion.div>

          {/* Contact Info */}
          <motion.div
              className="flex flex-col md:flex-row justify-center items-center gap-6 md:gap-12 mb-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
          >
            <a
                href={`mailto:${profile.email}`}
                className="flex items-center gap-2 text-netflix-light-gray hover:text-white transition-colors duration-300"
            >
              <span>📧</span>
              <span className="text-base md:text-lg">{profile.email}</span>
            </a>
            <a
                href={`tel:${profile.phone}`}
                className="flex items-center gap-2 text-netflix-light-gray hover:text-white transition-colors duration-300"
            >
              <span>📞</span>
              <span className="text-base md:text-lg">{profile.phone}</span>
            </a>
            <div className="flex items-center gap-2 text-netflix-light-gray">
              <span>📍</span>
              <span className="text-base md:text-lg">{profile.location}</span>
            </div>
          </motion.div>

          {/* Social Links */}
          <motion.div
              className="flex justify-center gap-5 mb-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
          >
            {[
              { icon: "fab fa-linkedin-in", link: profile.social.linkedin },
              { icon: "fab fa-github", link: profile.social.github },
              { icon: "fab fa-twitter", link: profile.social.twitter },
            ].map((social, i) => (
                <motion.a
                    key={i}
                    href={social.link}
                    className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-netflix-red transition-colors duration-300"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                >
                  <i className={`${social.icon} text-xl`}></i>
                </motion.a>
            ))}
          </motion.div>

          {/* Footer Bottom */}
          <motion.div
              className="text-center text-netflix-light-gray text-sm md:text-base"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}
          >
            <p>&copy; 2024 Portfolio. All rights reserved.</p>
          </motion.div>
        </div>
      </footer>
  );
}
