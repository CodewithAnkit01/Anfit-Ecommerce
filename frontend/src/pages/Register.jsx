  import { User, Mail, Lock } from "lucide-react";
  import { Link } from "react-router-dom";

  import { useState } from "react";
 import { registerUser } from "../api/auth.api";
  import { useNavigate } from "react-router-dom";
  import { toast } from "react-toastify";

  export default function Register() {
    const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const res = await registerUser({
        name,
        email,
        password,
      });

      toast.success("Account created successfully");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Register failed");
    }
  };
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center px-6">

        {/* Background Blur */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute w-80 h-80 bg-indigo-200/40 blur-3xl rounded-full -top-20 -left-20" />
          <div className="absolute w-80 h-80 bg-violet-200/40 blur-3xl rounded-full -bottom-20 -right-20" />
        </div>

        {/* Card */}
        <div className="relative w-full max-w-md">

          <div className="bg-white/80 backdrop-blur-xl border border-gray-100 shadow-xl rounded-[32px] p-8">

            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                Create Account
              </h1>

              <p className="text-gray-500 mt-2">
                Join us and start shopping today
              </p>
            </div>

            {/* Form */}
            <div className="space-y-5">

              {/* Name */}
              <div>
                <label className="text-sm text-gray-600">
                  Full Name
                </label>

                <div className="mt-2 flex items-center gap-3 px-4 py-3 rounded-2xl border border-gray-100 bg-gray-50">
                  <User size={18} className="text-gray-400" />

                  <input
                      type="text"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="text-sm text-gray-600">
                  Email Address
                </label>

                <div className="mt-2 flex items-center gap-3 px-4 py-3 rounded-2xl border border-gray-100 bg-gray-50">
                  <Mail size={18} className="text-gray-400" />

                  <input
                      type="email"
                      placeholder="john@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="text-sm text-gray-600">
                  Password
                </label>

                <div className="mt-2 flex items-center gap-3 px-4 py-3 rounded-2xl border border-gray-100 bg-gray-50">
                  <Lock size={18} className="text-gray-400" />

                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              {/* Confirm Password */}

              {/* Button */}
              <Link onClick={handleRegister}
                className="
                  w-full
                  bg-black
                  text-white
                  py-3.5
                  rounded-2xl
                  font-medium
                  hover:opacity-90
                  transition
                "
              >
                Create Account
              </Link>

            </div>

            {/* Footer */}
            <p className="text-center text-sm text-gray-500 mt-6">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-black font-medium"
              >
                Sign In
              </Link>
            </p>

          </div>

        </div>
      </div>
    );
  }