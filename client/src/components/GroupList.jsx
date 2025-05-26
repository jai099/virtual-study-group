// ✅ Modified GroupList.jsx
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
        const response = await axios.get("https://virtual-study-group-seven.vercel.app/api/groups");
        setGroups(response.data);
      } catch (error) {
        console.error("Failed to fetch groups", error);
      }
    };

    fetchGroups();
  }, [refreshTrigger]);

  const handleJoinGroup = async (groupId) => {
    try {
      await axios.put(`https://virtual-study-group-seven.vercel.app/api/groups/${groupId}/join`, {
        username: currentUsername,
      });
      alert("Joined group successfully!");
    } catch (err) {
      alert(err.response?.data?.error || "Failed to join group");
    }
  };

  const handleViewGroupDetails = (groupId) => {
    navigate(`/group/${groupId}`);
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
              <button onClick={() => handleViewGroupDetails(group._id)}>🔍 View Group Details</button>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default GroupList;
