"use client";
import { useState } from "react";
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, updateProfile } from "firebase/auth";
import { auth } from "../../lib/firebase";
import { useRouter } from "next/navigation";
import { syncUser } from "../../lib/syncUser";

export default function SignupClient() {
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
      if (!auth) throw new Error("Authentication is not available.");
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
          className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-500 hover:via-purple-500 hover:to-pink-500 text-white font-bold py-3 px-6 rounded-lg transition duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:scale-100"
          disabled={loading}
        >
          {loading ? "Creating Account..." : "Sign Up"}
        </button>
        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-[#333]" />
          <span className="text-gray-400 text-sm">OR</span>
          <div className="flex-1 h-px bg-[#333]" />
        </div>
        <button
          type="button"
          onClick={handleGoogle}
          className="bg-white hover:bg-gray-100 text-gray-900 font-bold py-3 px-6 rounded-lg transition duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:scale-100"
          disabled={loading}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          {loading ? "Signing up..." : "Sign up with Google"}
        </button>
        <p className="text-center text-gray-400 text-sm">
          Already have an account?{" "}
          <a href="/login" className="text-blue-400 hover:text-blue-300 transition">
            Log in
          </a>
        </p>
      </form>
    </div>
  );
}
