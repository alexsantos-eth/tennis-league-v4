import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

import { useState } from "react";

import { useAuthStore } from "../../../../store/auth";
import { auth } from "../../../../config/firebase";

const useGoogleLogin = () => {
  const { fetchCurrentUserData } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const handler = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();

    provider.setCustomParameters({ prompt: "select_account" });

    try {
      const userCredential = await signInWithPopup(auth, provider);
      const userData = await fetchCurrentUserData(userCredential);

      if (userData && userCredential.user.uid) {
        const uid = userCredential.user.uid;
        const idToken = await userCredential.user.getIdToken();

        try {
          const response = await fetch("/api/auth", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${idToken}`,
            },
            body: JSON.stringify({ uid }),
          });

          if (!response.ok) {
            throw new Error("No se pudo crear la sesion");
          }
        } catch (error) {
          console.error("Error al crear la sesion del usuario:", error);
          return;
        }

        window.location.href = "/";
      }
    } catch (error) {
      console.error("Error durante el inicio de sesión con Google:", error);
    } finally {
      setLoading(false);
    }
  };

  return { handler, loading };
};

export default useGoogleLogin;
