import React from "react";
import { useNavigate } from "react-router-dom";


const groups = [
    { _id: '661f84c8a9f78f18d7c7f8a1', name: 'React Study Group' },
    { _id: '66201abc9876dc4567fedcba', name: 'AI & ML Buddies' },
];

const GroupList = () => {
    const navigate = useNavigate();

    const handleJoinCall = (groupId) => {
        const jitsiRoom = `https://meet.jit.si/StudyGroup-${groupId}`;
        window.open(jitsiRoom, '_blank');
    };

    const handleOpenChat = (groupId) => {
        navigate(`/chat/${groupId}`);
    };

    return (
        <div className="group-list-container">
            <h2>Availabe Study Groups</h2>
            {groups.map((group) => (
                <div key={group._id} className="group-card">
                    <h4>{group.name}</h4>
                    <p><strong>Group ID:</strong>{group._id}</p>
                    <button onClick={() => handleOpenChat(group._id)}>💬 Open Chat</button>
                    <button onClick={() => handleJoinCall(group._id)}>🎥 Join Call</button>
                </div>
            ))}
        </div>
    );
};

export default GroupList;