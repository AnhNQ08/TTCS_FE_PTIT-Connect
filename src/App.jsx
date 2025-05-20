import React from "react";
import { Routes, Route } from "react-router-dom";
import { AppRouters } from "./routes";

const MyComponent = () => {
  return (
    <Routes>
      <Route path="/*" element={<AppRouters />} />
    </Routes>
  );
};

export default MyComponent;
