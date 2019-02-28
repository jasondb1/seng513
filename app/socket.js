//let express = require('express');
const DEBUG = true;
const cookie = require('cookie');

let firstNames = ['Bodacious', 'Wandering', 'Somber', 'Wallowing', 'Crazy', 'Smiling', 'Sulking',
    'Snickering', 'Cackling', 'Worried', 'Contented'];
let lastNames = ['Bear', 'Fox', 'Snake', 'Rhino', 'Hippo', 'Snail', 'Moose', 'Primate', 'Llama',
    'Ibex', 'Hedgehog', 'Ocelot', 'Penguin'];
let colors =   [ "#007bff", "#6610f2", "#6f42c1", "#e83e8c",
    "#dc3545", "#fd7e14", "#ffc107", "#28a745", "#20c997", "#6f42c1",
    "#17a2b8", "#ffffff", "#6c757d"];

//Form of message { clientId: [ID], timestamp: [time], message: [message]}
let messageLog = [];

//object { ID: [ID], name:[firstName], color: [#RRGGBB], sessionID:[SID] };
let currentUsers = [];
let allUsers = [];

let currentUID = 10000;
let currentMID = 1000000;


module.exports = function (io) {
//Establish a client connection
    io.on('connection', socket => {

        /////////////////////
        //Creates a new user if cookie does not exist
        let user = {};
        let cookies = {};
        let cstr = socket.handshake.headers['cookie'];
        if (cstr !== undefined) {
            cookies = cookie.parse(cstr);
        }
        if (cookies.uid === undefined) {
            do {
                user.name = firstNames[randInt(10)] + " " + lastNames[randInt(12)];
            } while (userExists(user.name));

            user.color = colors[randInt(12)];
            user.ID = randInt(100000000);
            allUsers.push(user);
        } else {
            user.color = cookies.color;
            user.color = cookies.color;
            user.name = cookies.uname;
            user.ID = parseInt(cookies.uid);
        }

        //add user to list of users and send to connected Users
        socket.emit('acknowledgeConn', user);
        if (currentUsers.find(obj => {
            return obj.ID === user.ID;
        }) === undefined) {
            currentUsers.push(user);
            console.log(`a new user- ${user.name}(${user.ID}) connected - Users Online: ${currentUsers.length}`)
        }

        let i = currentUsers.findIndex(obj => {
            return (obj.ID === user.ID);
        });
        if (isFinite(currentUsers[i].connections)) {
            currentUsers[i].connections++;
        } else {
            currentUsers[i].connections = 1;
        }


        io.emit('updateUsers', currentUsers);       //transmit updated user list to everyone
        socket.emit('refreshMessages', messageLog); //must come after updateUsers

        if (DEBUG) {
            console.log('[Connect Current Users:]');
            console.log(currentUsers);
        }

        /////////////////////////////
        //Event: user disconnects
        socket.on('disconnect', () => {

            if (!isFinite(currentUsers[i].connections)) {
                currentUsers[i].connections--;
                if (currentUsers[i].connections < 1) {
                    let removed = currentUsers.splice(i, 1);
                }


            }

            io.emit('updateUsers', currentUsers);
            console.log(`${user.name}(${user.ID}) disconnected`);

            if (DEBUG) {
                console.log('[Disconnect Current Users]')
                console.log(currentUsers);
            }

        });

        //////////////////////////////////////////////////////////////////////
        //Event: userMessage - logs and transmits a message to connected users
        socket.on('clientMessage', msg => {

            if (/^\//.test(msg)) { //test if command

                if (/^\/nickcolor\s[0-9a-f]{6}$/i.test(msg)) { //change color

                    //change the color
                    msg = msg.replace(/\/nickcolor\s*|/gi, '');
                    user.color = "#" + msg;
                    let i = currentUsers.findIndex(obj => {
                        return obj.ID === user.ID;
                    });
                    currentUsers[i].color = user.color;

                    //propogate to all users
                    socket.emit('acknowledgeConn', user);
                    io.emit('updateUsers', currentUsers)
                    socket.emit('status', 'Color Changed');

                } else if (/^\/nick\s/.test(msg)) { //change nickname

                    msg = msg.replace(/\/nick\s*|/gi, '');

                    if (userExists(msg)) {
                        socket.emit('status', 'ERROR: Name Exists - name was not unique');
                    } else {
                        user.name = msg;
                        let i = currentUsers.findIndex(obj => {
                            return obj.ID === user.ID;
                        });
                        currentUsers[i].name = user.name;

                        //propogate new name to all users
                        socket.emit('acknowledgeConn', user);
                        io.emit('updateUsers', currentUsers);
                        socket.emit('status', 'Name Changed');
                    }

                } else {
                    socket.emit('status', 'ERROR: Command is not valid');
                }

            } else {

                let timestamp = new Date();
                //format the message and push to message log
                let formattedMessage = {};
                formattedMessage.UID = user.ID;
                formattedMessage.message = msg;
                formattedMessage.timestamp = timestamp;
                formattedMessage.messageID = currentMID++;
                formattedMessage.color = user.color;
                formattedMessage.name = user.name;

                messageLog.push(formattedMessage); //store test in a volatile log

                socket.emit('status', 'Ready');

                io.emit('serverMessage', formattedMessage);
                if (DEBUG) {
                    console.log('current message: ');
                    console.log(formattedMessage);
                }

            }
        });

        ///////////////////////////////////////
        //Get a random integer between 0 and x
        function randInt(num) {
            return Math.floor((Math.random() * num));
        };

        //////////////////////////////////////
        //Tests if a user exists
        function userExists(name) {
            return allUsers.find(obj => {
                return obj.name === name;
            }) !== undefined;
        }

    });
};