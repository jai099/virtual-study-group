import React from 'react';
import { Excalidraw } from "@excalidraw/excalidraw";
import { useParams } from 'react-router-dom';

const WhiteboardPage = () => {
    const { groupId } = useParams();

    return (
        <div style={{ height: '100vh' }}>
            <h2 style={{ textAlign: 'center' }}>📝 Shared Whiteboard - Group: {groupId}</h2>
            <Excalidraw />
        </div>
    );
};

export default WhiteboardPage;