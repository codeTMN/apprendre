import React from "react";
// import Workspace from "./page";
import WelcomeBanner from "./_components/WelcomeBanner";
import CourseList from "./_components/CourseList";

function Workspace() {
  return (
    <div>
      <WelcomeBanner />
      <CourseList />
    </div>
  );
}

export default Workspace;
