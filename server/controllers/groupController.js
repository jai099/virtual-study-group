const Group = require('../models/Group');


// Create a  new Group
exports.createGroup = async (req, res) => {
    try {
        const { name, description, members } = req.body;
        const newGroup = new Group({ name, description, members });
        await newGroup.save();

        res.status(201).json(newGroup);
    } catch (error) {
        res.status(500).json({ error: "Failed to create Group" })
    }
};

// Get all Groups

exports.getAllGroups = async (req, res) => {
    try {
        const groups = await Group.find();
        res.status(200).json(groups);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch groups" });
    }
};

// Get single group by id

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

//Update group by id

exports.updateGroup = async (req, res) => {
    try {
        const { name, description, members } = req.body;

        const updatedGroup = await Group.findByIdAndUpdate(
            req.params.id,
            { name, description, members },
            { new: true }

        );

        if (!updatedGroup) {
            return res.status(404).json({ error: "Group nit found" });
        }

        res.status(200).json(updatedGroup)
    } catch (error) {
        res.status(500).json({ error: "Failed to update group" })
    }
};

//Delete group by id

exports.deleteGroup = async (req, res) => {
    try {
        const deleted = await Group.findByIdAndDelete(req.params.id)
       
        if (!deleted) {
            return res.status(404).json({ error: "Group not found" });
        }

        res.status(200).json({ message: "Group deleted Successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete group" })
    }
};