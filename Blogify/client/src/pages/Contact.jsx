import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const {
  div: MotionDiv,
  form: MotionForm,
  input: MotionInput,
  textarea: MotionTextarea,
  button: MotionButton,
  h2: MotionH2,
  h3: MotionH3,
  p: MotionP,
} = motion;

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.2, duration: 0.6 },
  }),
};

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3000/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullname: formData.name,
          email: formData.email,
          message: formData.message,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(data.message || "Message sent successfully!");
        setFormData({ name: "", email: "", message: "" }); // Clear form
      } else {
        toast.error(
          data.message || "Failed to send message. Please try again."
        );
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Connection error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MotionDiv
      initial="hidden"
      animate="visible"
      className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-6"
    >
      <MotionDiv
        variants={fadeInUp}
        className="bg-white/20 backdrop-blur-lg shadow-xl rounded-3xl overflow-hidden max-w-5xl w-full flex flex-col md:flex-row"
      >
        {/* Left Side: Info */}
        <MotionDiv
          variants={fadeInUp}
          custom={1}
          className="hidden md:flex flex-col justify-between bg-indigo-600 text-white p-8 md:w-1/2"
        >
          <div>
            <MotionH2
              variants={fadeInUp}
              custom={1.2}
              className="text-3xl font-extrabold mb-6"
            >
              Let's Connect!
            </MotionH2>
            <MotionP
              variants={fadeInUp}
              custom={1.4}
              className="text-lg opacity-80"
            >
              We'd love to hear from you. Whether it's feedback, a project, or
              just a hello!
            </MotionP>
          </div>
          <div className="mt-12 space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5" /> contact@blogify.com
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5" /> +91 9876543210
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5" /> Pune, India
            </div>
          </div>
          {/* Social Icons */}
          <div className="flex gap-4 mt-10">
            {[Facebook, Instagram, Linkedin, Twitter].map((Icon, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.2 }}
                className="cursor-pointer"
              >
                <Icon />
              </motion.div>
            ))}
          </div>
        </MotionDiv>

        {/* Right Side: Form */}
        <MotionDiv
          variants={fadeInUp}
          custom={2}
          className="p-8 md:w-1/2 bg-white/30 rounded-bl-3xl rounded-br-3xl md:rounded-bl-none"
        >
          <MotionH3
            variants={fadeInUp}
            custom={2.2}
            className="text-2xl font-bold text-gray-800 mb-6"
          >
            Get in Touch
          </MotionH3>

          <MotionForm onSubmit={handleSubmit} className="flex flex-col gap-6">
            <MotionInput
              variants={fadeInUp}
              custom={2.4}
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your Name"
              className="bg-white/40 placeholder-gray-600 px-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition"
              required
            />
            <MotionInput
              variants={fadeInUp}
              custom={2.6}
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Your Email"
              className="bg-white/40 placeholder-gray-600 px-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition"
              required
            />
            <MotionTextarea
              variants={fadeInUp}
              custom={2.8}
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Your Message"
              className="bg-white/40 placeholder-gray-600 px-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition min-h-[120px]"
              required
            />
            <MotionButton
              variants={fadeInUp}
              custom={3}
              type="submit"
              disabled={loading}
              className="bg-indigo-600 text-white font-semibold py-3 rounded-xl hover:bg-indigo-700 transition shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? "Sending..." : "Send Message 🚀"}
            </MotionButton>
          </MotionForm>
        </MotionDiv>
      </MotionDiv>

      {/* Toast Container */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </MotionDiv>
  );
};

export default Contact;
