import { Mail, Lock } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { loginUser } from "../api/auth.api";
import { toast } from "react-toastify";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    try {
      const res = await loginUser(form);

      // backend should return { token, user }
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      window.dispatchEvent(new Event("authChange"));
      toast.success("Login successful");

      navigate("/");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Login failed"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center px-6">

      <div className="relative w-full max-w-md">

        <div className="bg-white/80 backdrop-blur-xl border border-gray-100 shadow-xl rounded-3xl p-8">

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold">Welcome back</h1>
            <p className="text-gray-500 mt-2">
              Sign in to continue shopping
            </p>
          </div>

          {/* EMAIL */}
          <div className="space-y-4">

            <div className="flex items-center gap-2 px-4 py-3 rounded-2xl border bg-gray-50">
              <Mail className="w-4 h-4 text-gray-400" />
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full bg-transparent outline-none"
              />
            </div>

            {/* PASSWORD */}
            <div className="flex items-center gap-2 px-4 py-3 rounded-2xl border bg-gray-50">
              <Lock className="w-4 h-4 text-gray-400" />
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full bg-transparent outline-none"
              />
            </div>

            <button
              onClick={handleLogin}
              className="w-full py-3 rounded-2xl bg-black text-white"
            >
              Sign in
            </button>

          </div>

          <p className="text-center text-sm text-gray-500 mt-6">
            Don’t have an account?{" "}
            <Link to="/register" className="font-medium text-black">
              Create account
            </Link>
          </p>

        </div>

      </div>
    </div>
  );
}