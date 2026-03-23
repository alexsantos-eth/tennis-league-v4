import React from "react";
import useGoogleLogin from "./hooks";

const Login: React.FC = () => {
  const { handler: googleHandler, loading } = useGoogleLogin();

  return (
    <div data-id="login" className="relative min-h-dvh w-full overflow-hidden bg-black">
      <video
        loop
        muted
        autoPlay
        playsInline
        className="fixed inset-0 h-full w-full object-cover"
      >
        <source src="/video/authvideo.mov" type="video/mp4" />
      </video>

      <div
        data-id="login-shadow"
        className="fixed inset-0 bg-linear-to-b from-black/55 via-black/40 to-black/70"
      />

      <div
        data-id="login-container"
        className="relative z-10 flex min-h-dvh w-full flex-col items-center justify-center px-6 pb-20 pt-10 text-center animate-fade-down"
      >
        <div
          data-id="login-header"
          className="flex flex-col items-center justify-center space-y-3"
        >
          <div data-id="login-image">
            <img src="/images/logo.webp" alt="Logo" width={110} height={110} />
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-white">Bienvenido a la GTL</h1>
        </div>

        <button
          onClick={googleHandler}
          disabled={loading}
          className="mt-6 inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-white px-6 py-3 text-xl font-semibold text-black shadow-lg shadow-black/20 transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-70"
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google"
            width={22}
            height={22}
          />
          {loading ? "Ingresando..." : "Entrar con Google"}
        </button>
      </div>
    </div>
  );
};

export default Login;
