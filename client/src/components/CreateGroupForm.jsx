import React, { useState } from 'react';
import axios from 'axios';
import styles from './CreateGroupForm.module.css'
const CreateGroupForm = ({ onGroupCreated }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [members, setMembers] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const memberList = members.split(',').map(m => m.trim()).filter(Boolean);
            const response = await axios.post('http://localhost:5000/api/groups', {
                name,
                description,
                members: memberList,
            });

            onGroupCreated(response.data);
            setName('');
            setDescription('');
            setMembers('');
            alert("Group created successfully");
        } catch (error) {
            console.error("Failed to create group:", error);
            alert("Failed to create group");
        }
    }

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <h2>Create a New Group</h2>
            <input
                type='text'
                placeholder='Group Name'
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
            />
            <textarea
                placeholder='Group Description'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />
            <input
                type='text'
                placeholder='Members (comma seperated)'
                value={members}
                onChange={(e) => setMembers(e.target.value)}
            />
            <button type='submit'>Create Group</button>
        </form>
    );
};

export default CreateGroupForm;