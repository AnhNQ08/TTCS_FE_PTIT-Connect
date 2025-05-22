import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {SockJSProvider} from "@/context/SockJSContext.jsx";
import AppRoutes from "@/routes/AppRoutes.jsx";
import {AuthProvider} from "@/context/AuthContext.jsx";

function App() {
  return (
      <AuthProvider>
          <SockJSProvider>
              <AppRoutes />
          </SockJSProvider>
      </AuthProvider>
  );
}

export default App;
