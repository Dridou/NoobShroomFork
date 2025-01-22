"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import EditSection from "@/components/EditSection/EditSection";

const EditSectionButton = ({ sectionId , postId}) => {
  const { data: session } = useSession();
  const [isEditing, setIsEditing] = useState(false);

  const authorizedUsers = ["aneboncarle@hotmail.fr", "blacksnake1234451@gmail.com", "bieze.mike@gmail.com"];
  const partialAuthorizedUsers = ["joyboy06210@hotmail.fr"];
  const magePosts = ['cm0wn8t4a000acfyajmdmr0jp', 'clzjvah2y000j4z4auy3dxiw5'];
  const isUserAuthorized = session?.user?.email && authorizedUsers.includes(session.user.email);
  const isPartialUserAuthorizedForSpecialPage = session?.user?.email && partialAuthorizedUsers.includes(session.user.email) && magePosts.includes(postId);
  const toggleEdit = () => setIsEditing(!isEditing);

  if (!isUserAuthorized && !isPartialUserAuthorizedForSpecialPage) return null; // Ne rien afficher si l'utilisateur n'est pas autorisé

  return (
    <div>
      <button onClick={toggleEdit}>
        {isEditing ? "Fermer l'éditeur" : "Éditer cette section"}
      </button>
      {isEditing && <EditSection sectionId={sectionId} />}
    </div>
  );
};

export default EditSectionButton;
