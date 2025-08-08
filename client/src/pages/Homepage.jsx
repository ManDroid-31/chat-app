import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import ChatContainer from "../components/ChatContainer";

function Home() {
  const [showSidebar, setShowSidebar] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // ttailwind md breakpoint
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex max-h-screen max-w-screen w-full">
      
      <div
        className={`
          ${isMobile ? (showSidebar ? "block" : "hidden") : "block"} 
          w-full md:w-1/3 border-r border-gray-200
        `}
      >
        <Sidebar onUserSelect={() => isMobile && setShowSidebar(false)} />
      </div>

      
      <div
        className={`
          ${isMobile ? (showSidebar ? "hidden" : "block") : "block"} 
          flex-1
        `}
      >
        <ChatContainer onBack={() => isMobile && setShowSidebar(true)} />
      </div>
    </div>
  );
}

export default Home;
