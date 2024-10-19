import React, { createContext, useState, useContext, useEffect } from "react";
// Proveedor del contexto
import { ReactNode } from "react";

  // Crear el contexto
  const SessionContext = createContext('');

  // Hook para usar el contexto
  export const useSession = () => useContext(SessionContext);

export const SessionProvider = ({ children }: { children: ReactNode }) => {

  const [sessionId, setSessionId] = useState('');

  useEffect(() => {
    async function checkSession() {
      const response = await fetch("http://localhost:8001/poll/assign-session", {
        method: "GET",
        credentials: "include", // Asegúrate de que cookies se envíen con la solicitud
      });
      const data = await response.json();
      if (data.status === "ok") {
        console.log("Session ID:", data.session_id);
        setSessionId(data.session_id);
      } else {
        console.log("Session not found");
      }
    }

    checkSession();
  }, []);

  return (
    <SessionContext.Provider value={sessionId}>
      {children}
    </SessionContext.Provider>
  )
}
