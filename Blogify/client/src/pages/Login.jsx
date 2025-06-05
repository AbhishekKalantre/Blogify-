import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const {
  div: MotionDiv,
  form: MotionForm,
  input: MotionInput,
  button: MotionButton,
  h2: MotionH2,
  p: MotionP,
} = motion;

const fadeIn = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.2, duration: 0.6 },
  }),
};

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Check if user is already logged in
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const togglePassword = () => setShowPassword((prev) => !prev);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const validateForm = () => {
    const { email, password } = formData;

    // Check if any field is empty
    if (!email || !password) {
      toast.error("Please fill in all fields.");
      return false;
    }

    // Check if email is valid
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate the form
    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        // Save user data to localStorage
        localStorage.setItem("user", JSON.stringify(data.user));

        // Also save the token to localStorage
        localStorage.setItem("token", data.token);

        toast.success(data.message || "Login successful!");

        // Clear form
        setFormData({ email: "", password: "" });

        // Redirect to home page after a brief delay
        setTimeout(() => {
          navigate("/dashboard");
        }, 1500);
      } else {
        toast.error(data.message || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MotionDiv
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-6"
    >
      <MotionDiv
        variants={fadeIn}
        className="bg-white/10 backdrop-blur-lg text-white p-8 rounded-3xl shadow-xl w-full max-w-md"
      >
        <MotionH2
          variants={fadeIn}
          custom={1}
          className="text-3xl font-extrabold mb-6 text-center"
        >
          Welcome Back 👋
        </MotionH2>
        <MotionP
          variants={fadeIn}
          custom={1.2}
          className="text-lg opacity-80 text-center mb-8"
        >
          Please sign in to continue
        </MotionP>
        <MotionForm onSubmit={handleSubmit} className="flex flex-col gap-6">
          <MotionInput
            variants={fadeIn}
            custom={1.4}
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="bg-white/30 placeholder-gray-600 px-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition"
            required
          />
          <MotionDiv className="relative">
            <MotionInput
              variants={fadeIn}
              custom={1.6}
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="bg-white/30 placeholder-gray-600 px-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition pr-10 w-full"
              required
            />
            <div
              className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer"
              onClick={togglePassword}
            >
              {showPassword ? (
                <EyeOff className="text-indigo-400 hover:text-indigo-600 transition" />
              ) : (
                <Eye className="text-indigo-400 hover:text-indigo-600 transition" />
              )}
            </div>
          </MotionDiv>
          <MotionButton
            variants={fadeIn}
            custom={1.8}
            type="submit"
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700 transition text-white font-semibold py-3 rounded-xl shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "Login 🚀"}
          </MotionButton>
        </MotionForm>
        <MotionP
          variants={fadeIn}
          custom={2}
          className="text-sm text-center text-gray-900 mt-6"
        >
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-indigo-800 hover:text-indigo-900 transition"
          >
            Register
          </Link>
        </MotionP>
      </MotionDiv>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </MotionDiv>
  );
};

export default Login;
