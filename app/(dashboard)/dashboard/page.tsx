import React from "react";
import Communty from "@/components/communty";
import OverView from "@/components/OverView";
import PersonSidebar from "@/components/PersonSidebar";
import ShareSomething from "@/components/ShareSomething";

function Dashboard() {
  return (
    <div className="">
      <div className="bg-white/60">
        <div className="flex space-x-4">
          <OverView>
            <div className="sticky top-0 h-screen">
              <ShareSomething />
            </div>
            <div className="flex flex-col space-y-4 overflow-y-auto overflow-x-hidden w-1/4">
              <PersonSidebar />
              <Communty />
            </div>
          </OverView>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
