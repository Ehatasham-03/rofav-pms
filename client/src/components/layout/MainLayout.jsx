import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

function MainLayout(props) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  return (
    <section className="flex">
      <Sidebar isSidebarOpen={isSidebarOpen} />
      <div
        className={`main-content w-full transition-width duration-500 ${
          isSidebarOpen ? "ps-[280px]" : "ps-0 md:ps-[80px]"
        }`}
      >
        <div className="p-[20px]">
          <Header isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
          {props.children}
        </div>
      </div>
    </section>
  );
}

export default MainLayout;
