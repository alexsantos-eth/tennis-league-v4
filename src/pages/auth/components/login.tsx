import React from "react";
import useGoogleLogin from "./hooks";

const Login: React.FC = () => {
  const { handler: googleHandler, loading } = useGoogleLogin();

  return (
    <div data-id="login" className="h-full w-full relative">
      <video
        loop
        muted
        autoPlay
        playsInline
        className="fixed top-0 left-0 w-full h-full object-cover z-0"
      >
        <source src="/video/authvideo.mov" type="video/mp4" />
      </video>

      <div
        data-id="login-shadow"
        className="fixed inset-0 bg-linear-to-t from-transparent via-black/70 to-transparent z-2"
      />

      <div
        data-id="login-container"
        className="relative z-2 h-full w-full flex flex-col items-center justify-center space-y-4 animate-fade-down"
      >
        <div
          data-id="login-header"
          className="flex flex-col items-center space-y-2 justify-center"
        >
          <div data-id="login-image">
            <img src="/images/logo.webp" alt="Logo" width={100} height={100} />
          </div>

          <h1 className="text-2xl text-white font-bold">Bienvenido a la GTL</h1>
        </div>

        <button onClick={googleHandler}>
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google"
            width={20}
            height={20}
          />
          Entrar con Google
        </button>
      </div>
    </div>
  );
};

export default Login;
