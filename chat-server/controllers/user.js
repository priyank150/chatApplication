var userModel = require('../models/user');

exports.getAllUsers = async (req, res) => {
    try {
        const response = await userModel.getAllUsers(req);
        res.status(200).json(response);
    } catch(err) {
        console.log('error in getAllusers',err)
    }
    
}

exports.register = async (req, res) => {
    const user = req.body;
    try {
        const response = await userModel.register(user);
        res.status(200).json(response);
    } catch(err) {
        console.log(err)
    }
    
}

exports.login = async (req, res) => {
    const userDetails = req.body;
    try {
        const response = await userModel.login(userDetails);
        res.status(200).json(response);
    } catch(err) {
        console.log(err)
    }
    
}

exports.sendMessage = async (req, res) => {
    const messageObject = req.body;
    try {
        const response = await userModel.sendMessage(messageObject);
        res.status(200).json(response);
    } catch(err) {
        console.log(err)
    }
    
}

exports.getMessageByChatRoom = async (req, res) => {
    const chatRoom = req.body.chatRoom;
    try {
        const response = await userModel.getMessageByChatRoom(chatRoom);
        res.status(200).json(response);
    } catch(err) {
        console.log('error in getMessageByChatRoom',err)
    }
    
}

