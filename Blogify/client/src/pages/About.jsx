import React from "react";
import { motion } from "framer-motion";

const {
  div: MotionDiv,
  section: MotionSection,
  h1: MotionH1,
  p: MotionP,
} = motion;

// Animation Variants
const titleVariant = {
  hidden: { opacity: 0, y: -30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const paragraphVariant = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { delay: 0.3, duration: 0.6 } },
};

const cardContainerVariant = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { delay: 0.6, duration: 0.5 } },
};

const About = () => {
  return (
    <MotionSection
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-6"
    >
      <MotionDiv
        variants={cardContainerVariant}
        className="bg-white/20 backdrop-blur-lg text-white p-10 rounded-3xl shadow-2xl w-full max-w-4xl"
      >
        <MotionH1
          variants={titleVariant}
          className="text-4xl font-bold text-white text-center mb-6"
        >
          About Blogify
        </MotionH1>

        <MotionP
          variants={paragraphVariant}
          className="text-lg text-white/90 leading-relaxed text-center mb-6"
        >
          Welcome to{" "}
          <span className="text-yellow-200 font-semibold">Blogify</span>, your
          go-to platform for insightful articles, latest tech updates, creative
          storytelling, and thought-provoking content.
        </MotionP>
        <MotionP
          variants={paragraphVariant}
          className="text-lg text-white/90 leading-relaxed text-center mb-8"
        >
          Our mission is to empower writers and readers alike by creating a
          space where ideas thrive and creativity flows. Whether you're a tech
          enthusiast, a lifestyle blogger, or someone who just loves to read —
          we've got something for you!
        </MotionP>

        <MotionDiv
          variants={cardContainerVariant}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6"
        >
          {[
            {
              title: "Our Vision",
              text: "To build a creative hub for curious minds and passionate storytellers across the globe.",
            },
            {
              title: "What We Do",
              text: "We connect people through content. From personal blogs to professional insights — we provide the tools.",
            },
            {
              title: "Join Us",
              text: "Be part of a growing community that believes in sharing knowledge and uplifting voices.",
            },
          ].map((section, index) => (
            <MotionDiv
              key={index}
              variants={cardContainerVariant}
              className="bg-white/30 text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
            >
              <h3 className="text-xl font-bold mb-3 text-white">
                {section.title}
              </h3>
              <p className="text-white/90">{section.text}</p>
            </MotionDiv>
          ))}
        </MotionDiv>
      </MotionDiv>
    </MotionSection>
  );
};

export default About;
