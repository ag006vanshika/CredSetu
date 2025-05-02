"use client";

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import BeamsBackground from "./Beamsbackground";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";

const initialForm = {
  username: "",
  phoneNumber: "",
  password: "",
  isLender: "",
  PAN: "",
  DOB: null as Date | null,
  KYCToken: "",
  income: "",
  age: "",
  homeOwnership: "",
  employmentLength: "",
  creditDefault: "",
};

const fields = [
  { id: "username", label: "Username", type: "text" },
  { id: "phoneNumber", label: "Phone Number", type: "tel" },
  { id: "password", label: "Password", type: "password" },
  { id: "isLender", label: "Are you a Lender?", type: "select", options: ["Lender", "Borrower"] },
  { id: "PAN", label: "PAN Number", type: "text" },
  { id: "DOB", label: "Date of Birth", type: "date" },
  { id: "income", label: "Monthly Income", type: "number" },
  { id: "age", label: "Age", type: "number" },
  { id: "homeOwnership", label: "Home Ownership", type: "select", options: ["Own", "Rent", "Mortgage"] },
  { id: "employmentLength", label: "Employment Length (years)", type: "number" },
  { id: "creditDefault", label: "Credit Default (yes/no)", type: "select", options: ["Yes", "No"] },
];

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    setErrors(prev => ({ ...prev, [id]: "" }));
  };

  // Validates form fields and sets error messages if invalid
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.username) newErrors.username = "Username is required.";
    if (!formData.phoneNumber) newErrors.phoneNumber = "Phone number is required.";
    else if (!/^\d{10}$/.test(formData.phoneNumber)) newErrors.phoneNumber = "Phone number must be 10 digits.";

    if (!formData.password) newErrors.password = "Password is required.";
    else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters.";

    if (!formData.isLender) newErrors.isLender = "Please select Lender or Borrower.";

    if (!formData.PAN) newErrors.PAN = "PAN Number is required.";
    else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.PAN)) newErrors.PAN = "Invalid PAN format.";

    if (!formData.DOB) newErrors.DOB = "Date of Birth is required.";

    if (!formData.income) newErrors.income = "Income is required.";
    else if (Number(formData.income) <= 0) newErrors.income = "Income must be positive.";

    if (!formData.age) newErrors.age = "Age is required.";
    else if (Number(formData.age) <= 0) newErrors.age = "Age must be positive.";

    if (!formData.homeOwnership) newErrors.homeOwnership = "Select Home Ownership.";

    if (!formData.employmentLength) newErrors.employmentLength = "Employment Length is required.";

    if (!formData.creditDefault) newErrors.creditDefault = "Select Credit Default.";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await axios.post("https://your-api-url.com/signup", formData);
      setSuccessMessage("Profile Updated Successfully!");
      setTimeout(() => navigate("/Dashboard"), 1500);
    } catch (error: any) {
      alert(error?.response?.data?.message || "Submission failed. Try again.");
    }
  };

  const inputClasses = "w-full px-4 py-2 rounded-md bg-black border border-gray-700 text-white focus:outline-none transition";

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <BeamsBackground />

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="bg-[#020816] p-6 rounded-xl shadow-lg w-full max-w-md text-white z-10 h-[90vh] flex flex-col">
          
          <div className="mb-2 flex-shrink-0">
            <h2 className="text-2xl font-bold mb-2">Complete Profile</h2>
            <p className="text-gray-400 mb-4">Enter your details below for verification</p>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            <form onSubmit={handleSubmit}>
              {fields.map(({ id, label, type, options }) => (
                <div key={id} className="mb-4">
                  <label htmlFor={id} className="block mb-1 font-semibold">{label}</label>

                  {type === "date" ? (
                    <DatePicker
                      selected={formData.DOB}
                      onChange={(date) => setFormData(prev => ({ ...prev, DOB: date }))}
                      dateFormat="dd/MM/yyyy"
                      placeholderText="Select date"
                      className={inputClasses}
                      showYearDropdown
                      scrollableYearDropdown
                    />
                  ) : type === "select" ? (
                    <select
                      id={id}
                      value={String(formData[id as keyof typeof formData] ?? "")}
                      onChange={handleChange}
                      className={inputClasses}
                    >
                      <option value="" disabled hidden>Select {label}</option>
                      {options?.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      id={id}
                      type={type}
                      value={formData[id as keyof typeof formData] as string}
                      onChange={handleChange}
                      placeholder={`Enter ${label}`}
                      className={inputClasses}
                    />
                  )}

                  {errors[id] && (
                    <p className="text-red-500 text-sm mt-1">{errors[id]}</p>
                  )}
                </div>
              ))}

              {successMessage && (
                <div className="text-green-500 text-center font-semibold mb-4">{successMessage}</div>
              )}

              <button
                type="submit"
                className="w-full py-2 mt-2 text-white font-medium rounded-md transition hover:opacity-90"
                style={{ backgroundColor: '#3462e3' }}
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #3462e3;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #0a0f1a;
        }
      `}</style>
    </div>
  );
};

export default Register;
