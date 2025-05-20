import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {SockJSProvider} from "@/context/SockJSContext.jsx";
import AppRoutes from "@/routes/AppRoutes.jsx";

function App() {
  return (
      <SockJSProvider>
        <AppRoutes />
      </SockJSProvider>
  );
}

export default App;
