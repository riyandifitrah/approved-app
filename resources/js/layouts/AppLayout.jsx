import React from "react";
import Sidebar from "../components/Sidebar";

export default function AppLayout({ children }) {
  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1 p-0" style={{ marginLeft: 250 }}>
        {children}
      </div>
    </div>
  );
}
