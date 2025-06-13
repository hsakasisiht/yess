"use client";
import { useState } from "react";
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, updateProfile } from "firebase/auth";
import { auth } from "../../lib/firebase";
import { useRouter } from "next/navigation";
import { syncUser } from "../../lib/syncUser";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (!auth) throw new Error("Authentication is not available.");
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      if (name) {
        await updateProfile(cred.user, { displayName: name });
      }
      await syncUser({
        firebaseUid: cred.user.uid,
        email: cred.user.email || "",
        name: name || cred.user.displayName || undefined,
      });
      if (typeof window !== "undefined") {
        localStorage.removeItem('mightRange');
      }
      // Sign out the user after signup
      await auth.signOut();
      // Redirect to login with a query param to show a message
      router.push("/login?signup=success");
    } catch (err: any) {
      let msg = "An unknown error occurred";
      if (err && err.code === "auth/email-already-in-use") {
        msg = "This email is already registered. Please log in or use a different email.";
      } else if (err instanceof Error) {
        msg = err.message;
      }
      setError(msg);
    }
    setLoading(false);
  };

  const handleGoogle = async () => {
    setLoading(true);
    setError("");
    try {
      const provider = new GoogleAuthProvider();
      const cred = await signInWithPopup(auth, provider);
      await syncUser({
        firebaseUid: cred.user.uid,
        email: cred.user.email || "",
        name: cred.user.displayName || undefined,
      });
      router.push("/");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#10111a] via-[#181c24] to-[#0a0a0a] relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-radial from-blue-700/40 via-purple-600/30 to-transparent rounded-full blur-3xl opacity-60 -z-10" />
      <form
        onSubmit={handleSignup}
        className="bg-black/60 backdrop-blur-2xl border border-white/10 p-8 rounded-2xl shadow-2xl w-full max-w-md flex flex-col gap-5 animate-fade-in"
      >
        <h1 className="text-2xl sm:text-3xl font-extrabold text-center mb-2 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-lg">Sign Up for Konoha Shop</h1>
        {error && <div className="text-red-400 text-sm text-center font-semibold bg-red-900/30 rounded py-2 px-3 animate-fade-in">{error}</div>}
        <input
          type="text"
          placeholder="Name"
          className="p-3 rounded-lg bg-[#181c24] text-white border border-[#333] focus:outline-none focus:border-blue-500 transition"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          className="p-3 rounded-lg bg-[#181c24] text-white border border-[#333] focus:outline-none focus:border-blue-500 transition"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="p-3 rounded-lg bg-[#181c24] text-white border border-[#333] focus:outline-none focus:border-blue-500 transition"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:to-pink-700 text-white font-bold py-3 rounded-xl shadow-lg transition-transform hover:scale-105 flex items-center justify-center gap-2 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? "Signing up..." : "Sign Up"}
        </button>
        <button
          type="button"
          onClick={handleGoogle}
          className="bg-white text-black font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-200 transition shadow-lg border border-white/10 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          <svg width="22" height="22" viewBox="0 0 48 48"><g><path fill="#4285F4" d="M24 9.5c3.54 0 6.7 1.22 9.19 3.23l6.85-6.85C35.64 2.7 30.18 0 24 0 14.82 0 6.71 5.82 2.69 14.29l7.98 6.2C12.13 13.16 17.56 9.5 24 9.5z"/><path fill="#34A853" d="M46.1 24.55c0-1.64-.15-3.22-.42-4.74H24v9.04h12.42c-.54 2.9-2.18 5.36-4.64 7.04l7.19 5.6C43.93 37.13 46.1 31.3 46.1 24.55z"/><path fill="#FBBC05" d="M10.67 28.49a14.5 14.5 0 0 1 0-9.02l-7.98-6.2A23.94 23.94 0 0 0 0 24c0 3.77.9 7.34 2.69 10.51l7.98-6.02z"/><path fill="#EA4335" d="M24 48c6.18 0 11.36-2.05 15.14-5.59l-7.19-5.6c-2.01 1.35-4.6 2.15-7.95 2.15-6.44 0-11.87-3.66-14.33-8.98l-7.98 6.02C6.71 42.18 14.82 48 24 48z"/></g></svg>
          Continue with Google
        </button>
        <div className="text-gray-400 text-sm text-center mt-2">
          Already have an account? <a href="/login" className="text-blue-400 hover:underline font-bold">Login</a>
        </div>
      </form>
    </div>
  );
} 