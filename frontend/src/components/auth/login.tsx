"use client";

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import BeamsBackground from "./Beamsbackground";
import axios from "axios";

interface FormData {
  contact: string;
  password: string;
}

interface ValidationRule {
  required: boolean;
  pattern?: RegExp;
  minLength?: number;
}

const loginSchema: { [key: string]: ValidationRule } = {
  contact: { required: true, pattern: /^[0-9]{10}$/ }, // Contact must be 10 digits
  password: { required: true, minLength: 6 }, // Password must be at least 6 characters
};

const login: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormData>({ contact: "", password: "" });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [successMessage, setSuccessMessage] = useState<string>("");

  // Handle input change and clear previous error for the field
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    setErrors((prev) => ({ ...prev, [id]: "" }));
  };

  // Validate form fields against schema
  const validateForm = () => {
    let isValid = true;
    const newErrors: { [key: string]: string } = {};

    for (const key in loginSchema) {
      const rule = loginSchema[key];
      const value = formData[key as keyof FormData];

      if (rule.required && !value) {
        newErrors[key] = `${key} is required`;
        isValid = false;
      } else if (rule.minLength && value.length < rule.minLength) {
        newErrors[key] = `${key} must be at least ${rule.minLength} characters`;
        isValid = false;
      } else if (rule.pattern && typeof value === "string" && !rule.pattern.test(value)) {
        newErrors[key] = `Invalid ${key} format`;
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        const res = await axios.post("http://localhost:5000/api/auth/login", {
          phoneNumber: formData.contact,
          password: formData.password,
        });
        console.log("Login successful:", res);
        setSuccessMessage("Login Successful!");

        setTimeout(() => navigate("/dashboard"), 1500);

      } catch (err: any) {
        console.error("Login error:", err);
        setSuccessMessage("");
        if (err.response) alert(err.response.data.message || "Invalid credentials.");
        else if (err.request) alert("No response from server.");
        else alert("An error occurred.");
      }
    } else {
      setSuccessMessage("");
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <BeamsBackground />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-[#020816] p-8 rounded-xl shadow-lg w-full max-w-md text-white z-10">
          <h2 className="text-2xl font-bold mb-2">Login</h2>
          <p className="text-gray-400 mb-6">Enter your credentials to Login</p>

          <div className="mb-4">
            <label htmlFor="contact" className="block mb-1 font-semibold">Contact No.</label>
            <input
              type="tel"
              id="contact"
              value={formData.contact}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md bg-black border border-gray-700 text-white focus:outline-none transition"
            />
            {errors.contact && <p className="text-red-500 text-sm mt-1">{errors.contact}</p>}
          </div>

          <div className="mb-6">
            <div className="flex justify-between items-center">
              <label htmlFor="password" className="block mb-1 font-semibold">Password</label>
            
            </div>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              placeholder=""
              className="w-full px-4 py-2 rounded-md bg-black border border-gray-700 text-white focus:outline-none transition"
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>


          {successMessage && <div className="text-green-500 text-center font-semibold mb-4">{successMessage}</div>}

          <button
            className="w-full py-2 text-white font-medium rounded-md transition hover:opacity-90"
            style={{ backgroundColor: '#3462e3' }}
            onClick={handleSubmit}
          >
            Login
          </button>

          <p className="mt-6 text-center text-sm text-gray-400">
            Don’t have an account?{' '}
            <Link to="/register" className=" text-white">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default login;
