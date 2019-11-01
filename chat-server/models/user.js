var db = require('../database');
const util = require('util');
const jwt = require("jsonwebtoken");
const moment = require('moment');

process.env.SECRET_KEY = 'secret';

const query = util.promisify(db.query).bind(db);

const getAllUsers = async (req) => {

    let response;
    response = await query(`SELECT * FROM USERS`);
    return response;

}

const getUserByEmail = async (email) => {
    try {
        const user = await query(`SELECT * FROM USERS WHERE email = ?`, [email]);
        return user;
    }
    catch (err) {
        console.log('error in getUserByEmail', err);
    }
}

const register = async (user) => {
    let response = {};
    let userEmail = user.email;
    let userObject = {
        email: user.email,
        userName: user.userName,
        password: user.password
    }
    let userExists = await getUserByEmail(userEmail);
    if (userExists.length > 0) {
        response.status = "error";
        response.message = "Email already exists"
    } else {
        const registerUser = await query(`INSERT INTO USERS SET ? `, userObject);
        let insertId = registerUser.insertId;
        if (insertId > 0) {
            userObject.userId = insertId;
            let token = jwt.sign(userObject, process.env.SECRET_KEY, {
                expiresIn: 1440
            })
            response.status = "ok";
            response.message = "User registered sucessfully";
            response.token = token;
        }
    }
    return response;


}

const login = async (user) => {
    let response = {};
    let userEmail = user.email;
    let userPassword = user.password;

    try {
        const userDetails = await query(`SELECT * FROM USERS WHERE email = ? AND password = ? `, [userEmail, userPassword]);
        if (userDetails.length > 0) {
            let userObject = {
                email: userDetails[0].email,
                password: userDetails[0].password,
                userId: userDetails[0].userId,
                userName: userDetails[0].userName
            };
            let token = jwt.sign(userObject, process.env.SECRET_KEY, {
                expiresIn: 1440
            })
            response.token = token;
            response.message = "User is logged In";
        } else {
            response.message = "User does not exists";
        }

    } catch (err) {
        console.log('error in login', err);
    }
    return response;

}

const sendMessage = async (message) => {
    let currentDate = moment().format('YYYY-MM-DD HH:mm:ss');
    // console.log('curent date================', currentDate)
    let messageObject = {
        senderId: message.senderId,
        recieverId: message.recieverId,
        chatRoom: message.chatRoom,
        chatMessage: message.chatMessage,
        sentOn: currentDate 
    }
    // console.log('message 0bject==========', message);
    try {
        const insertMessage = await query(`INSERT INTO MESSAGES SET ? `, messageObject);
        // console.log('insert message===', insertMessage);
    }
    catch(err) {
        console.log(err);
    }
}

const getMessageByChatRoom = async (chatRoom) => {
    let response = {};
    try {
        const getMessage = await query(`SELECT * FROM MESSAGES WHERE chatRoom = ?`, [chatRoom]);
        // console.log('getMessage=======', getMessage);
        if (getMessage.length > 0) {
            response.chat = getMessage;
            response.status = 'ok'
        }
        return response;
    } catch(err) {
        console.log(err);
    }
}


module.exports = {
    getAllUsers: getAllUsers,
    register: register,
    login: login,
    getUserByEmail: getUserByEmail,
    sendMessage: sendMessage,
    getMessageByChatRoom: getMessageByChatRoom

}