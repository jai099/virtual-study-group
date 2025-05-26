import React, { useState } from 'react';
import axios from 'axios';
import styles from './CreateGroupForm.module.css';

const CreateGroupForm = ({ onGroupCreated, owner }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [members, setMembers] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const manualMembers = members
        .split(',')
        .map((m) => m.trim())
        .filter(Boolean);

      const finalMembers = Array.from(new Set([owner, ...manualMembers])); // ✅ Owner always included

      const response = await axios.post('https://virtual-study-group-seven.vercel.app/api/groups', {
        name,
        description,
        members: finalMembers,
        owner,
      });

      onGroupCreated(response.data);
      setName('');
      setDescription('');
      setMembers('');
      alert('Group created successfully');
    } catch (error) {
      console.error('Failed to create group:', error);
      alert('Failed to create group');
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2>Create a New Group</h2>
      <input
        type="text"
        placeholder="Group Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <textarea
        placeholder="Group Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <input
        type="text"
        placeholder="Members (comma separated, optional)"
        value={members}
        onChange={(e) => setMembers(e.target.value)}
      />
      <button type="submit">Create Group</button>
    </form>
  );
};

export default CreateGroupForm;
