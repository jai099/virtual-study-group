// ✅ Modified GroupDetails.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './GroupDetails.module.css';

const GroupDetails = ({ currentUsername }) => {
  const { id: groupId } = useParams();
  const navigate = useNavigate();
  const [group, setGroup] = useState(null);
  const [isMember, setIsMember] = useState(false);
  const [hasRequested, setHasRequested] = useState(false);
  const [pendingRequests, setPendingRequests] = useState([]);

  const fetchGroup = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/groups/${groupId}`);

      setGroup(res.data);
      setIsMember(res.data.members.includes(currentUsername));
      setHasRequested(res.data.pendingRequests?.includes(currentUsername));
      setPendingRequests(res.data.pendingRequests || []);
    } catch (err) {
      console.error('Error fetching group:', err);
    }
  };

  useEffect(() => {
    fetchGroup();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleJoinRequest = async () => {
    try {
      await axios.put(`/api/groups/${groupId}/request`, {
        username: currentUsername,
      });
      setHasRequested(true);
    } catch (err) {
      console.error('Error sending join request:', err);
    }
  };

  const handleApprove = async (username) => {
    try {
      await axios.put(`/api/groups/${groupId}/approve`, { username });
      setPendingRequests((prev) => prev.filter((u) => u !== username));
      setGroup((prev) => ({
        ...prev,
        members: [...prev.members, username],
      }));
    } catch (err) {
      console.error('Error approving user:', err);
    }
  };

  const handleDeny = async (username) => {
    try {
      await axios.put(`/api/groups/${groupId}/deny`, { username });
      setPendingRequests((prev) => prev.filter((u) => u !== username));
    } catch (err) {
      console.error('Error denying user:', err);
    }
  };

  const handleOpenChat = () => {
    navigate(`/chat/${groupId}`);
  };

  const handleJoinCall = () => {
    const jitsiRoom = `https://meet.jit.si/StudyGroup-${groupId}`;
    window.open(jitsiRoom, "_blank");
  };

  const handleOpenWhiteboard = () => {
    navigate(`/whiteboard/${groupId}`);
  }

  if (!group) return <div className={styles.loading}>Loading group details...</div>;

  return (
    <div className={styles.groupContainer}>
      <h2 className={styles.groupTitle}>{group.name}</h2>
      <p className={styles.groupDescription}>{group.description}</p>

      <h4>👥 Members:</h4>
      <ul>
        {group.members.map((member) => (
          <li key={member}>{member}</li>
        ))}
      </ul>

      {!isMember && !hasRequested && (
        <button className={styles.groupButton} onClick={handleJoinRequest}>
          🔔 Request to Join
        </button>
      )}

      {isMember && (
        <div>
          <button className={styles.groupButton} onClick={handleOpenChat}>
            💬 Open Chat
          </button>
          <button className={styles.groupButton} onClick={handleJoinCall}>
            🎥 Join Call
          </button>
          <button className={styles.groupButton} onClick={handleOpenWhiteboard}>
             📝 Open Whiteboard
        </button>
        
        </div>
      )}

      {group.owner === currentUsername && pendingRequests.length > 0 && (
        <div className={styles.pendingSection}>
          <h3>Pending Requests:</h3>
          {pendingRequests.map((username) => (
            <div className={styles.pendingUser} key={username}>
              <span>{username}</span>
              <button
                className={`${styles.actionButton} ${styles.approve}`}
                onClick={() => handleApprove(username)}
              >
                ✅ Approve
              </button>
              <button
                className={`${styles.actionButton} ${styles.deny}`}
                onClick={() => handleDeny(username)}
              >
                ❌ Deny
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GroupDetails;
