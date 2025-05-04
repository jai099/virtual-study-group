import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const GroupDetails = ({ currentUsername }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(false);

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/groups/${id}`);
        setGroup(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching group:", err);
      }
    };

    fetchGroup();
  }, [id, refreshTrigger]);

const handleJoinRequest = async () => {
  try {
    const response = await axios.put(`http://localhost:5000/api/groups/${id}/join`, {
      username: currentUsername,
    });

    alert(response.data.message || "Join request sent successfully");
    setRefreshTrigger((prev) => !prev);
  } catch (err) {
    if (err.response && err.response.data && err.response.data.error) {
      alert("❌ " + err.response.data.error);
    } else {
      alert("❌ Failed to send join request. Please try again.");
    }
    console.error("Join request failed:", err);
  }
};


  const handleApprove = async (username) => {
    try {
      await axios.put(`http://localhost:5000/api/groups/${id}/approve`, {
        username,
      });
      setRefreshTrigger((prev) => !prev);
    } catch (err) {
      console.error("Approve failed:", err);
    }
  };

  const handleDeny = async (username) => {
    try {
      await axios.put(`http://localhost:5000/api/groups/${id}/deny`, {
        username,
      });
      setRefreshTrigger((prev) => !prev);
    } catch (err) {
      console.error("Deny failed:", err);
    }
  };

  const handleOpenChat = () => {
    navigate(`/chat/${id}`);
  };

  const handleJoinCall = () => {
    window.open(`https://meet.jit.si/StudyGroup-${id}`, "_blank");
  };

  if (loading || !group) return <p>Loading...</p>;

  const isOwner = group.owner === currentUsername;
  const isMember = group.members.includes(currentUsername);
  const isPending = group.pendingRequests?.includes(currentUsername);

  return (
    <div style={{ textAlign: "center", padding: "30px" }}>
      <h2>{group.name}</h2>
      <p>{group.description}</p>

      {!isMember && !isPending && (
        <button onClick={handleJoinRequest}>🔔 Request to Join</button>
      )}
      {!isMember && isPending && <p>⏳ Request Sent</p>}

      {isOwner && group.pendingRequests.length > 0 && (
        <div style={{ marginTop: "30px" }}>
          <h4>Pending Join Requests</h4>
          {group.pendingRequests.map((username) => (
            <div key={username} style={{ marginBottom: "10px" }}>
              <span>{username}</span>{" "}
              <button onClick={() => handleApprove(username)}>✅ Approve</button>{" "}
              <button onClick={() => handleDeny(username)}>❌ Deny</button>
            </div>
          ))}
        </div>
      )}

      {isMember && (
        <div style={{ marginTop: "20px" }}>
          <button onClick={handleOpenChat}>💬 Open Chat</button>{" "}
          <button onClick={handleJoinCall}>🎥 Join Call</button>
        </div>
      )}
    </div>
  );
};

export default GroupDetails;
