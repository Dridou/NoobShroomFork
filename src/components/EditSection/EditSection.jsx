"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import styles from "./EditSection.module.css";

// Import dynamique de React Quill pour éviter le rendu côté serveur
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css"; // Import des styles de Quill

const EditSection = ({ sectionId }) => {
  const [sectionData, setSectionData] = useState({
    title: "",
    content: "",
    icon: "",
    displayOrder: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  // Définir la fonction fetchSection en dehors de useEffect pour pouvoir la réutiliser
  const fetchSection = async () => {
    try {
      const response = await fetch(`/api/sections/${sectionId}`);
      const data = await response.json();
      setSectionData(data);
      setLoading(false);
    } catch (err) {
      setError("Failed to load section");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSection();
  }, [sectionId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSectionData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleContentChange = (content) => {
    setSectionData((prevData) => ({
      ...prevData,
      content: content,
    }));
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/sections/${sectionId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sectionData),
      });

      if (!response.ok) throw new Error("Failed to update section");
      const updatedSection = await response.json();
      alert("Section updated successfully");
      setSectionData(updatedSection);
	  await fetchSection();
    } catch (err) {
      setError("Error updating section");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className={styles.formContainer}>
      <h2>Edit Section</h2>
      <form onSubmit={(e) => e.preventDefault()}>
        <label className={styles.label}>
          Title:
          <input
            type="text"
            name="title"
            value={sectionData.title}
            onChange={handleChange}
            className={styles.input}
          />
        </label>

        <label className={styles.label}>
          Content:
          <ReactQuill
            value={sectionData.content}
            onChange={handleContentChange}
            className={styles.textarea}
            theme="snow" // Thème de Quill
          />
        </label>

        <label className={styles.label}>
          Icon:
          <input
            type="text"
            name="icon"
            value={sectionData.icon}
            onChange={handleChange}
            className={styles.input}
          />
        </label>

        <label className={styles.label}>
          Display Order:
          <input
            type="number"
            name="displayOrder"
            value={sectionData.displayOrder}
            onChange={handleChange}
            className={styles.input}
          />
        </label>

        <button type="button" onClick={handleSave} className={styles.button}>
          Save Section
        </button>
      </form>
    </div>
  );
};

export default EditSection;
