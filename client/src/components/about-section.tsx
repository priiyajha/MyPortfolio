// import { motion } from "framer-motion";
// import { Profile } from "@shared/schema";
//
// interface AboutSectionProps {
//   profile?: Profile;
// }
//
// export default function AboutSection({ profile }: AboutSectionProps) {
//   if (!profile) {
//     return (
//       <section id="about" className="py-16 px-4 md:px-12">
//         <div className="max-w-6xl mx-auto text-center">
//           <div className="text-netflix-light-gray">Profile information not available</div>
//         </div>
//       </section>
//     );
//   }
//
//   return (
//     <section id="about" className="py-16 px-4 md:px-12">
//       <div className="max-w-6xl mx-auto">
//         <motion.div
//           className="grid md:grid-cols-2 gap-12 items-center"
//           initial={{ opacity: 0, y: 50 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.8 }}
//           viewport={{ once: true }}
//         >
//           <motion.div
//             initial={{ opacity: 0, x: -50 }}
//             whileInView={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.8, delay: 0.2 }}
//             viewport={{ once: true }}
//           >
//             <img
//               src={profile.image}
//               alt="Professional headshot"
//               className="rounded-lg shadow-xl w-full max-w-md mx-auto"
//             />
//           </motion.div>
//
//           <motion.div
//             initial={{ opacity: 0, x: 50 }}
//             whileInView={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.8, delay: 0.4 }}
//             viewport={{ once: true }}
//           >
//             <h2 className="text-4xl font-bold mb-6">About Priya</h2>
//             <p className="text-lg text-netflix-light-gray mb-6">
//               {profile.bio}
//             </p>
//             <p className="text-lg text-netflix-light-gray mb-8">
//               {profile.mission}
//             </p>
//
//             {/* Skills */}
//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <h3 className="text-xl font-semibold mb-3 netflix-red">Frontend</h3>
//                 <ul className="space-y-2 text-netflix-light-gray">
//                   {profile.skills.frontend.map((skill, index) => (
//                     <motion.li
//                       key={skill}
//                       initial={{ opacity: 0, x: -20 }}
//                       whileInView={{ opacity: 1, x: 0 }}
//                       transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
//                       viewport={{ once: true }}
//                     >
//                       {skill}
//                     </motion.li>
//                   ))}
//                 </ul>
//               </div>
//               <div>
//                 <h3 className="text-xl font-semibold mb-3 netflix-red">Backend</h3>
//                 <ul className="space-y-2 text-netflix-light-gray">
//                   {profile.skills.backend.map((skill, index) => (
//                     <motion.li
//                       key={skill}
//                       initial={{ opacity: 0, x: -20 }}
//                       whileInView={{ opacity: 1, x: 0 }}
//                       transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
//                       viewport={{ once: true }}
//                     >
//                       {skill}
//                     </motion.li>
//                   ))}
//                 </ul>
//               </div>
//             </div>
//           </motion.div>
//         </motion.div>
//       </div>
//     </section>
//   );
// }


import { motion } from "framer-motion";
import { Profile } from "@shared/schema";

interface AboutSectionProps {
  profile?: Profile;
}

export default function AboutSection({ profile }: AboutSectionProps) {
  if (!profile) {
    return (
        <section id="about" className="py-16 px-4 md:px-12">
          <div className="max-w-6xl mx-auto text-center">
            <div className="text-netflix-light-gray">
              Profile information not available
            </div>
          </div>
        </section>
    );
  }

  return (
      <section id="about" className="py-20 px-4 md:px-12 relative overflow-hidden">
        {/* Background gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/40 pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
              className="grid md:grid-cols-2 gap-12 items-center"
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true }}
          >
            {/* Image Section */}
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                viewport={{ once: true }}
                className="flex justify-center"
            >
              <motion.img
                  src={profile.image}
                  alt="Professional headshot"
                  className="rounded-xl shadow-2xl w-full max-w-md object-cover cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
              />
            </motion.div>

            {/* Text Section */}
            <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">
                About <span className="text-netflix-red">Priya</span>
              </h2>

              <p className="text-lg text-netflix-light-gray mb-6 leading-relaxed">
                {profile.bio}
              </p>
              <p className="text-lg text-netflix-light-gray mb-8 leading-relaxed">
                {profile.mission}
              </p>

              {/* Skills */}
              <div className="grid sm:grid-cols-2 gap-6">
                {/* Frontend */}
                <div>
                  <h3 className="text-xl font-semibold mb-3 text-netflix-red">
                    Frontend
                  </h3>
                  <ul className="space-y-2 text-netflix-light-gray">
                    {profile.skills?.frontend?.map((skill, index) => (
                        <motion.li
                            key={skill}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{
                              duration: 0.5,
                              delay: 0.6 + index * 0.08,
                            }}
                            viewport={{ once: true }}
                            className="hover:text-white transition-colors"
                        >
                          • {skill}
                        </motion.li>
                    ))}
                  </ul>
                </div>

                {/* Backend */}
                <div>
                  <h3 className="text-xl font-semibold mb-3 text-netflix-red">
                    Backend
                  </h3>
                  <ul className="space-y-2 text-netflix-light-gray">
                    {profile.skills?.backend?.map((skill, index) => (
                        <motion.li
                            key={skill}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{
                              duration: 0.5,
                              delay: 0.8 + index * 0.08,
                            }}
                            viewport={{ once: true }}
                            className="hover:text-white transition-colors"
                        >
                          • {skill}
                        </motion.li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
  );
}
