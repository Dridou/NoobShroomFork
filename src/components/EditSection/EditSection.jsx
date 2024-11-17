"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import styles from "./EditSection.module.css";

// Import dynamique de TinyMCE
const Editor = dynamic(() => import("@tinymce/tinymce-react").then(mod => mod.Editor), { ssr: false });

const EditSection = ({ sectionId }) => {
  const editorRef = useRef(null); // Référence pour TinyMCE
  const [sectionData, setSectionData] = useState({
    title: "",
    content: "",
    icon: "",
    displayOrder: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fonction pour récupérer les données de la section
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

  const handleSave = async () => {
    try {
      // Récupère le contenu HTML depuis TinyMCE
      const content = editorRef.current.getContent();
      const updatedData = { ...sectionData, content };

      const response = await fetch(`/api/sections/${sectionId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) throw new Error("Failed to update section");

      alert("Section updated successfully");
      setSectionData(updatedData);
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
          <Editor
            apiKey="x3eer1vn0bqep5rm8ntkj0jmckwk8qtd6okbe9fnukhokmmf"
            onInit={(evt, editor) => (editorRef.current = editor)}
            initialValue={sectionData.content}
            init={{
              height: 500,
              menubar: false,
              plugins: [
                "advlist autolink lists link image charmap print preview anchor",
                "searchreplace visualblocks code fullscreen",
                "insertdatetime media table paste code help wordcount",
              ],
              toolbar:
                "undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | code",
              content_style:
                "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
            }}
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
