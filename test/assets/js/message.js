$(document).ready(function () {
    const DEBUG = true;
    let socket = io();
    //let socket = io.connect("http://localhost:8080");
    let currentUser = {};
    let users=[];


    //////////////////////////////////////////
    //Send a message from the client to server
    $('form').submit(msg => {
        msg.preventDefault();

        message = $('#clientMessage').val();

        if (message == ''){
            return;
        } else {
            socket.emit('clientMessage', message);
            if (DEBUG) console.log("[Sending Message]:" + message);
            $('#clientMessage').val('');
            return false;
        }
    });

    ///////////////////////////////////
    //Receive a message from the server
    socket.on('serverMessage', msg => {
        displayHtml(msg);

    });

    ///////////////////
    //Refresh Messages
    socket.on('refreshMessages', msgArr => {
        if (DEBUG) {
            console.log('[refreshMessages]')
            console.log(msgArr);
        }

        for (let msg of msgArr){
            displayHtml(msg);
        }

    });

    //////////////////////////
    //Update users from server
    socket.on('updateUsers', msg => {
        users = msg;

        let newHTML = [];
        for (let i = 0; i < msg.length; i++) {
            newHTML.push('<span style="color:' +  msg[i].color + ';">' + msg[i].name + '</span>');
        }
        $('#users').html(newHTML.join(''));

        if (DEBUG) console.log('[update Users]');

    });

    //////////////////////////////////////////////////////////////
    //Acknowledges the client connection returning the user object
    socket.on('acknowledgeConn', msg => {
       currentUser = msg;
       console.log(msg);
        $('#currentUser').text(currentUser.name);
        $('#status').text('Connected');
        document.cookie = 'uname=' + currentUser.name;
        document.cookie = 'uid=' + currentUser.ID;
        document.cookie = 'color=' + currentUser.color;
    });

    ///////////////////
    //Refresh Messages
    socket.on('status', msg => {
        $('#status').text(msg);
    });


    //////////////////
    //Compose Message
    function displayHtml(msg) {

        if (DEBUG) {
            console.log("[received message]:");
            console.log(msg);
            console.log(users);
        }

        //determine user specific parameters
        let ts = new Date(msg.timestamp);
        let i = users.findIndex(x => {return x.ID === msg.UID});
        let color;
        let name;
        if (i < 0){ //not a current user
            color = msg.color;
            name = msg.name;
        } else { //a current user
            color = users[i].color;
            name = users[i].name
        }

        //compose html content of message
        let html = '<div class="msg_head">';
        html += '<span class="timestamp">' + ts.getHours() + ':' + ( ts.getMinutes() > 9 ? ts.getMinutes() : '0' + ts.getMinutes()) + '</span>';
        html += '<span class="username" style="color:' + color + ';">' + name + '</span>';
        html += '</div>';
        html += '<span ' + ((currentUser.ID === msg.UID) ? 'class="bold"' : '') + '>' + msg.message + '</span>';

        //$('#messages').prepend($('<div class="msg">').html(html) );
        $('#msg_container').append($('<div class="msg">').html(html) );

        //This keeps the scroll bar at the bottom of the message window
        //let scrollDiv = document.getElementById("#messages");
        let scrollDiv = document.getElementById("msg_container");

        if(scrollDiv !== null) {
            scrollDiv.scrollTop = scrollDiv.scrollHeight;
        }
    };


});//end of script