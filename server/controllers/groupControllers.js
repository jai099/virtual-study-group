const mongoose = require('mongoose');

const express = require ('express');
const  Group = require('../models/Group')

// ✅ Create Group
exports.createGroup = async (req, res) => {
    try {
        const { name, description, owner } = req.body;
        if (!owner) return res.status(400).json({ error: "Owner username is required" });

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
        if (!group) return res.status(404).json({ error: "Group not found" });
        res.status(200).json(group);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch group" });
    }
};

// ✅ Send Join Request
exports.joinGroup = async (req, res) => {
    try {
        const { username } = req.body;
        if (!username) return res.status(400).json({ error: "Username is required" });

        const group = await Group.findById(req.params.id);
        if (!group) return res.status(404).json({ error: "Group not found" });

        if (group.members.includes(username))
            return res.status(400).json({ error: "Already a member" });

        if (group.pendingRequests.includes(username))
            return res.status(400).json({ error: "Join request already sent" });

        group.pendingRequests.push(username);
        await group.save();

        res.status(200).json({ message: "Join request sent" });
    } catch (error) {
        res.status(500).json({ error: "Failed to send join request" });
    }
};

// ✅ Approve Request
exports.approveRequest = async (req, res) => {
    try {
        const { username } = req.body;
        const group = await Group.findById(req.params.id);
        if (!group) return res.status(404).json({ error: "Group not found" });

        if (!group.pendingRequests.includes(username))
            return res.status(400).json({ error: "No such join request" });

        group.pendingRequests = group.pendingRequests.filter(user => user !== username);
        group.members.push(username);
        await group.save();

        res.status(200).json({ message: "User approved", group });
    } catch (error) {
        res.status(500).json({ error: "Approval failed" });
    }
};

// ✅ Deny Request
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
