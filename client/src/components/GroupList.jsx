// 📁 src/components/GroupList.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const GroupList = ({ refreshTrigger }) => {
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);

  // 🔁 Fetch groups on refresh trigger
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/groups");
        setGroups(response.data);
      } catch (error) {
        console.error("Failed to fetch groups", error);
      }
    };

    fetchGroups();
  }, [refreshTrigger]);

  const handleJoinCall = (groupId) => {
    const jitsiRoom = `https://meet.jit.si/StudyGroup-${groupId}`;
    window.open(jitsiRoom, "_blank");
  };

  const handleOpenChat = (groupId) => {
    navigate(`/chat/${groupId}`);
  };

  return (
    <div className="group-list-container">
      <h2>Available Study Groups</h2>
      {groups.map((group) => (
        <div key={group._id} className="group-card">
          <h4>{group.name}</h4>
          <p><strong>Group ID:</strong> {group._id}</p>
          <button onClick={() => handleOpenChat(group._id)}>💬 Open Chat</button>
          <button onClick={() => handleJoinCall(group._id)}>🎥 Join Call</button>
        </div>
      ))}
    </div>
  );
};

export default GroupList;
