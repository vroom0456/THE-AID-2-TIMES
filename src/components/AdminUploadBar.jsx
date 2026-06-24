// src/components/AdminUploadBar.jsx
import React from 'react';
import { saveSubjectResources } from '../utils/resourceManager';

const AdminUploadBar = ({ subject, reg, branch, sem }) => {
  const handleAdd = () => {
    // Add your logic here to update subject.resources and call saveSubjectResources
    alert("Resource added!");
  };

  return (
    <div className="admin-upload-bar" style={{ border: "1px dashed gold", padding: "10px" }}>
      <h4>⚡ Admin Upload</h4>
      <input id="title" placeholder="Resource Title" />
      <input id="url" placeholder="Google Drive Link" />
      <button onClick={handleAdd}>Add to Vault</button>
    </div>
  );
};

export default AdminUploadBar;



