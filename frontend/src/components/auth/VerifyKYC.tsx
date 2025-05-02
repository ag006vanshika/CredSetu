"use client";

import * as React from "react";
import { useNavigate } from "react-router-dom";
import BeamsBackground from "./Beamsbackground";
import axios from "axios";

const VerifyKYC: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = React.useState({
    username: "",
    pan: "",
    dob: "",
  });

  const [errors, setErrors] = React.useState<{ [key: string]: string }>({});

  const [successMessage, setSuccessMessage] = React.useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    setErrors((prev) => ({ ...prev, [id]: "" })); // Clear error for this field on change
  };

  // Validate form fields before submitting
  const validateForm = () => {
    let isValid = true;
    const newErrors: { [key: string]: string } = {};

    if (!formData.username) {
      newErrors.username = "Username is required";
      isValid = false;
    }

    if (!formData.pan || !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.pan)) {
      newErrors.pan = "Invalid PAN format (e.g., ABCDE1234F)";
      isValid = false;
    }

    if (!formData.dob) {
      newErrors.dob = "Date of Birth is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        const response = await axios.post("https://your-api-url.com/verify-kyc", {
          username: formData.username,
          pan: formData.pan,
          dob: formData.dob,
        });

        console.log("KYC Verification successful:", response.data);
        setSuccessMessage("KYC Verified Successfully!");

        setTimeout(() => {
          navigate("/dashboard");
        }, 1500);
      } catch (error: any) {
        console.error("Error during KYC verification:", error);
        setSuccessMessage("");

        if (error.response) {
          alert(`Verification failed: ${error.response.data.message || "Please try again."}`);
        } else if (error.request) {
          alert("No response from server. Please check your connection.");
        } else {
          alert("An error occurred. Please try again.");
        }
      }
    } else {
      setSuccessMessage("");
    }
  };

  return (
    <div className="relative min-h-screen w-screen overflow-x-hidden overflow-y-auto">
      <BeamsBackground />

      <div className="absolute inset-0 flex items-center justify-center overflow-auto p-4">
        <div className="bg-[#020816] p-8 rounded-xl shadow-lg w-full max-w-md text-white z-10">
          <h2 className="text-2xl font-bold mb-4">Verify KYC</h2>
          <p className="text-gray-400 mb-6">
            Please provide the required details to verify your KYC
          </p>

          {[
            { label: "Username", id: "username", type: "text", placeholder: "Enter your username" },
            { label: "PAN Number", id: "pan", type: "text", placeholder: "ABCDE1234F" },
            { label: "Date of Birth", id: "dob", type: "date", placeholder: "" },
          ].map((field) => (
            <div key={field.id} className="mb-4">
              <label htmlFor={field.id} className="block mb-1 font-semibold">
                {field.label}
              </label>
              <input
                type={field.type}
                id={field.id}
                value={formData[field.id as keyof typeof formData]}
                onChange={handleChange}
                placeholder={field.placeholder}
                className="w-full px-4 py-2 rounded-md bg-black border border-gray-700 text-white focus:outline-none transition"
              />
              {errors[field.id] && (
                <p className="text-red-500 text-sm mt-1">{errors[field.id]}</p>
              )}
            </div>
          ))}

          {successMessage && (
            <div className="text-green-500 text-center font-semibold mb-4">
              {successMessage}
            </div>
          )}

          <button
            className="w-full py-2 text-white font-medium rounded-md transition hover:opacity-90"
            style={{ backgroundColor: '#3462e3' }}
            onClick={handleSubmit}
          >
            Verify KYC
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyKYC;
