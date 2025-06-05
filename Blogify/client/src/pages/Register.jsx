import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
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

const Register = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const togglePassword = () => setShowPassword((prev) => !prev);
  const toggleConfirmPassword = () => setShowConfirmPassword((prev) => !prev);

  const clearForm = () => {
    setFirstName("");
    setLastName("");
    setUsername("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  const validateForm = () => {
    // Check if any field is empty
    if (
      !firstName ||
      !lastName ||
      !username ||
      !email ||
      !password ||
      !confirmPassword
    ) {
      toast.error("Please fill in all fields.");
      return false;
    }

    // Check if email is valid
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address.");
      return false;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return false;
    }

    // Check if password length is at least 6 characters
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate the form
    if (!validateForm()) return;

    setLoading(true);

    // Send request to backend
    try {
      const response = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          username,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(data.message || "Registration successful!");
        clearForm(); // Clear the form after successful registration

        // Redirect to login page after a short delay
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        toast.error(data.message || "Something went wrong.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Failed to register. Please try again later.");
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
          Create an Account 📝
        </MotionH2>
        <MotionP
          variants={fadeIn}
          custom={1.2}
          className="text-lg opacity-80 text-center mb-8"
        >
          Join the community and start exploring!
        </MotionP>
        <MotionForm className="flex flex-col gap-6" onSubmit={handleSubmit}>
          <MotionInput
            variants={fadeIn}
            custom={1.4}
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="bg-white/30 placeholder-gray-600 px-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition"
            required
          />
          <MotionInput
            variants={fadeIn}
            custom={1.6}
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="bg-white/30 placeholder-gray-600 px-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition"
            required
          />
          <MotionInput
            variants={fadeIn}
            custom={1.8}
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="bg-white/30 placeholder-gray-600 px-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition"
            required
          />
          <MotionInput
            variants={fadeIn}
            custom={2.0}
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-white/30 placeholder-gray-600 px-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition"
            required
          />
          <MotionDiv className="relative">
            <MotionInput
              variants={fadeIn}
              custom={2.2}
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
          <MotionDiv className="relative">
            <MotionInput
              variants={fadeIn}
              custom={2.4}
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="bg-white/30 placeholder-gray-600 px-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition pr-10 w-full"
              required
            />
            <div
              className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer"
              onClick={toggleConfirmPassword}
            >
              {showConfirmPassword ? (
                <EyeOff className="text-indigo-400 hover:text-indigo-600 transition" />
              ) : (
                <Eye className="text-indigo-400 hover:text-indigo-600 transition" />
              )}
            </div>
          </MotionDiv>
          <MotionButton
            variants={fadeIn}
            custom={2.6}
            type="submit"
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700 transition text-white font-semibold py-3 rounded-xl shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? "Registering..." : "Register 🚀"}
          </MotionButton>
        </MotionForm>
        <MotionP
          variants={fadeIn}
          custom={2.8}
          className="text-sm text-center text-gray-900 mt-6"
        >
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-indigo-800 hover:text-indigo-900 hover:underline transition"
          >
            Login
          </Link>
        </MotionP>
      </MotionDiv>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </MotionDiv>
  );
};

export default Register;
