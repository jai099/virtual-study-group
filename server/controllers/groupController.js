const Group = require('../models/Group');

// ✅ Create Group
exports.createGroup = async (req, res) => {
    try {
        const { name, description, owner } = req.body;

        if (!owner) {
            return res.status(400).json({ error: "Owner username is required" });
        }

        const newGroup = new Group({ name, description, members: [owner], owner });
        await newGroup.save();

        res.status(201).json(newGroup);
    } catch (error) {
        res.status(500).json({ error: "Failed to create group" });
    }
};

// ✅ Get All Groups
exports.getAllGroups = async (req, res) => {
    try {
        const groups = await Group.find();
        res.status(200).json(groups);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch groups" });
    }
};

// ✅ Get Group by ID
exports.getGroupById = async (req, res) => {
    try {
        const group = await Group.findById(req.params.id);
        if (!group) {
            return res.status(404).json({ error: "Group not found" });
        }
        res.status(200).json(group);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch group" });
    }
};

// ✅ Update Group
exports.updateGroup = async (req, res) => {
    try {
        const { name, description, members } = req.body;
        const updatedGroup = await Group.findByIdAndUpdate(
            req.params.id,
            { name, description, members },
            { new: true }
        );
        if (!updatedGroup) {
            return res.status(404).json({ error: "Group not found" });
        }
        res.status(200).json(updatedGroup);
    } catch (error) {
        res.status(500).json({ error: "Failed to update group" });
    }
};

// ✅ Delete Group
exports.deleteGroup = async (req, res) => {
    try {
        const deleted = await Group.findByIdAndDelete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ error: "Group not found" });
        }
        res.status(200).json({ message: "Group deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete group" });
    }
};

// ✅ Send Join Request (username -> pendingRequests[])

exports.joinGroup = async (req, res) => {
    exports.joinGroup = async (req, res) => {
        try {
            const { username } = req.body;
            const group = await Group.findById(req.params.id);

            if (!group) return res.status(404).json({ error: "Group not found" });

            // 🔐 Fallback in case somehow owner is missing
            if (!group.owner) group.owner = "unknown-owner";

            if (group.members.includes(username))
                return res.status(400).json({ error: "Already a member" });

            if (group.pendingRequests.includes(username))
                return res.status(400).json({ error: "Join request already sent" });

            group.pendingRequests.push(username);
            await group.save();

            res.status(200).json({ message: "Join request sent" });
        } catch (error) {
            console.error("Join group error:", error);
            res.status(500).json({ error: "Failed to send join request" });
        }
    };

};

// ✅ Approve Join Request
exports.approveRequest = async (req, res) => {
    try {
        const { username } = req.body;
        const group = await Group.findById(req.params.id);

        if (!group) return res.status(404).json({ error: "Group not found" });

        if (!group.pendingRequests.includes(username))
            return res.status(400).json({ error: "No such request" });

        group.pendingRequests = group.pendingRequests.filter(user => user !== username);
        group.members.push(username);

        await group.save();
        res.status(200).json({ message: "User approved", group });
    } catch (error) {
        res.status(500).json({ error: "Approval failed" });
    }
};

// ✅ Deny Join Request
exports.denyRequest = async (req, res) => {
    try {
        const { username } = req.body;
        const group = await Group.findById(req.params.id);

        if (!group) return res.status(404).json({ error: "Group not found" });

        group.pendingRequests = group.pendingRequests.filter(user => user !== username);

        await group.save();
        res.status(200).json({ message: "Request denied" });
    } catch (error) {
        res.status(500).json({ error: "Deny failed" });
    }
};
