import React from "react";
import { useDesiner } from "../context/DesignerContex";
import UserProfile from "@/components/UserProfile";
import DesignerProfile from "@/components/DesignerProfile";

const Profile = () => {
  const designer = useDesiner();
  const currentDesigner = designer.currentDesigner

  // console.log("Profile: ",currentDesigner);
  

  return (
    <>
      {currentDesigner?.length > 0 ? (
        <DesignerProfile  />
      ) : (
        <UserProfile />
      )}
    </>
  );
};

export default Profile;
