import { useState } from "react";
import GoogleIcon from "@mui/icons-material/Google";
import Toast from "../../components/Toast";
import { useNavigate } from "react-router-dom";

import {
  handleForgetPassword,
  handleLogin,
  handleSignup,
  signInWithPopup,
  auth,
  provider,
  updateProfile
} from "../../firebase/auth";
import DectectAuthError from "../../firebase/firebaseError";

export default function AuthenticationPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [forgotPassword, setForgotPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState(""); 
  const [confirmPassword, setConfirmPassword] = useState("")
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
      if (forgotPassword) {
        const result = await handleForgetPassword(email);
        if (result.error) {            
            setToast({ type: "error", message: DectectAuthError(result.error) });
        } else {
            setToast({ type: "success", message: "Password reset email sent successfully!" });
            setForgotPassword(false);
        }
      } else if (isLogin) {
        const result = await handleLogin(email,password);
        if (result.error) {
            setToast({ type: "error", message: DectectAuthError(result.error) });
        } else {
            localStorage.setItem("userName", result.userName || localStorage.getItem("userName")); 
            setToast({ type: "success", message: "Login successful!" });
            navigate("/dashboard")
        }
      } else {
        if (password !== confirmPassword) {
          setToast({ type: "error", message: "Passwords do not match" });
          return;
        }
        const result = await handleSignup(email,userName,password);
        if (result.error) {
            setToast({ type: "error", message: DectectAuthError(result.error) });
        } else {
            setToast({ type: "success", message: "Signup successful!" });
            localStorage.setItem("userName", userName);
            navigate("/dashboard")
        }
      }
  };

  const handleGoogle = async () => {
    signInWithPopup(auth, provider)
        .then((result) => {
            const user = result.user;
            const displayName = user.displayName || "New User";    
            updateProfile(user, { displayName })
            .then(() => {
                navigate("/dashboard");
            })
            .catch((error) => {
                const errMsg = DectectAuthError(error);
                setToast({ type: "error", message: errMsg });
            });
        })
        .catch((error) => {
            const errMsg = DectectAuthError(error);
            setToast({ type: "error", message: errMsg });
        });
  };

  return (
    <>
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
      <div className="min-h-screen flex items-center justify-center bg-gray-950 relative p-4 overflow-hidden">
        <div className="w-full max-w-md z-10">
          <div className="backdrop-blur-2xl bg-white/10 shadow-2xl rounded-2xl border border-white/10 p-6 flex flex-col items-center">
            {!forgotPassword ? (
              <>
                <h2 className="text-3xl font-extrabold text-white drop-shadow-md">
                  {isLogin ? "Welcome Back" : "Join Us"}
                </h2>

                <p className="text-sm text-gray-300 mb-6">
                  {isLogin ? "Login to continue" : "Create your account"}
                </p>

                <form className="w-full space-y-3" onSubmit={handleSubmit}>
                  {!isLogin && (
                    <input
                      placeholder="Full Name"
                      name="name"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      className="w-full px-3 py-2 bg-white/10 text-white placeholder:text-gray-400 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  )}

                  <input
                    placeholder="Email"
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-white/10 text-white placeholder:text-gray-400 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                  />

                  <input
                    placeholder="Password"
                    type="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 bg-white/10 text-white placeholder:text-gray-400 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                  />

                  {!isLogin && (
                    <input
                      placeholder="Confirm Password"
                      type="password"
                      name="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-3 py-2 bg-white/10 text-white placeholder:text-gray-400 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  )}

                  <div className="flex justify-between text-xs text-gray-400">
                    {isLogin && (
                      <button
                        type="button"
                        onClick={() => setForgotPassword(true)}
                        className="hover:underline"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-xl shadow-lg border border-indigo-700 active:scale-95"
                  >
                    {isLogin ? "Login" : "Sign Up"}
                  </button>

                  <div className="flex items-center my-3">
                    <div className="flex-grow border-t border-gray-600"></div>
                    <span className="mx-2 text-gray-500 text-sm">or</span>
                    <div className="flex-grow border-t border-gray-600"></div>
                  </div>

                  <button
                    type="button"
                    onClick={handleGoogle}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-xl shadow-md flex items-center justify-center gap-2 active:scale-95"
                  >
                    <GoogleIcon fontSize="small" /> Sign in with Google
                  </button>
                </form>

                <div className="mt-6 text-gray-300 text-sm">
                  {isLogin ? "Don’t have an account?" : "Already have an account?"}
                  <button
                    onClick={() => setIsLogin(!isLogin)}
                    className="ml-2 text-indigo-400 hover:underline"
                  >
                    {isLogin ? "Sign Up" : "Login"}
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-extrabold text-white drop-shadow-md mb-6">
                  Reset Password
                </h2>
                <form className="w-full space-y-3" onSubmit={handleSubmit}>
                  <input
                    placeholder="Enter your email"
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-white/10 text-white placeholder:text-gray-400 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-xl shadow-lg border border-indigo-700 active:scale-95"
                  >
                    Reset Password
                  </button>
                </form>
                <div className="mt-6 text-gray-300 text-sm">
                  <button
                    onClick={() => setForgotPassword(false)}
                    className="text-indigo-400 hover:underline"
                  >
                    Back to Login
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
