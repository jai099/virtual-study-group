import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./GroupList.module.css";

const floatingEmojis = ["📚", "📝", "👨‍💻", "👩‍🏫", "📖", "🧠", "📓", "✏️"];

const GroupList = ({ refreshTrigger, currentUsername }) => {
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);

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

  const handleJoinGroup = async (groupId) => {
    try {
      await axios.put(`http://localhost:5000/api/groups/${groupId}/join`, {
        username: currentUsername,
      });
      alert("Joined group successfully!");
    } catch (err) {
      alert(err.response?.data?.error || "Failed to join group");
    }
  };

  const handleJoinCall = (groupId) => {
    const jitsiRoom = `https://meet.jit.si/StudyGroup-${groupId}`;
    window.open(jitsiRoom, "_blank");
  };

  const handleOpenChat = (groupId) => {
    navigate(`/chat/${groupId}`);
  };

  return (
    <div className={styles.groupListContainer}>
      <h2 className={styles.title}>📚 Available Study Groups</h2>
      {groups.map((group) => {
        const isMember = group.members.includes(currentUsername);
        return (
          <div key={group._id} className={styles.groupCard}>
            <div className={styles.emojiBackground}>
              {floatingEmojis.map((emoji, i) => (
                <div
                  key={i}
                  className={styles.emoji}
                  style={{
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 10}s`,
                    fontSize: `${Math.random() * 30 + 20}px`,
                  }}
                >
                  {emoji}
                </div>
              ))}
            </div>

            <h4>{group.name}</h4>
            <p><strong>Group ID:</strong> {group._id}</p>

            {!isMember ? (
              <button onClick={() => handleJoinGroup(group._id)}>➕ Join Group</button>
            ) : (
              <>
                <button onClick={() => handleOpenChat(group._id)}>💬 Open Chat</button>
                <button onClick={() => handleJoinCall(group._id)}>🎥 Join Call</button>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default GroupList;
