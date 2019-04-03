import {Injectable} from '@angular/core';
import * as io from 'socket.io-client';
import $ from 'jquery';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  currentUser: any = {};
  users: any[] = [];
  DEBUG: boolean = true;

  private url = 'http://localhost:3000';
  private socket;

  constructor() {
    this.socket = io(this.url);
    this.setupListeners();
  }


  ///////////////////
  //sendMessage
  public sendMessage(message) {
    this.socket.emit('clientMessage', message);
  }

  ///////////////////
  //Change project
  public changeProject(projectNumber) {
    this.socket.emit('changeProject', projectNumber);
  }

  ///////////////////
  //Setup Listeners
  private setupListeners() {

    ///////////////////////////////////
    //Receive a message from the server
    this.socket.on('serverMessage', msg => {
      this.displayHtml(msg);
    });

    ///////////////////
    //Refresh Messages
    this.socket.on('refreshMessages', msgArr => {
      if (this.DEBUG) {
        console.log('[refreshMessages]')
        console.log(msgArr);
      }
      for (let msg of msgArr) {
        this.displayHtml(msg);
      }
    });

    ///////////////////
    //Refresh Status
    this.socket.on('status', msg => {
      $('#status').text(msg);
    });

/////////////////////////////////////////////////////////////////
//TODO Remove these methods once uname cookie is set by node.js login

    //Update users from server
    this.socket.on('updateUsers', msg => {
      this.users = msg;

      let newHTML = [];
      for (let i = 0; i < msg.length; i++) {
        newHTML.push('<span style="color:' +  msg[i].color + ';">' + msg[i].name + '</span>');
      }
      $('#users').html(newHTML.join(''));

      if (this.DEBUG) console.log('[update Users]');

    });

    //////////////////////////////////////////////////////////////
    //Acknowledges the client connection returning the user object
    this.socket.on('acknowledgeConn', msg => {
      this.currentUser = msg;
      console.log(msg);
      $('#currentUser').text(this.currentUser.name);
      $('#status').text('Connected');
      document.cookie = 'uname=' + this.currentUser.name;
      document.cookie = 'uid=' + this.currentUser.ID;
      document.cookie = 'color=' + this.currentUser.color;
    });

////////////////////////////////////////////////////////////////////////



  }//end of setupListeners

  //////////////////
  //Compose Message
  private displayHtml(msg) {

    if (this.DEBUG) {
      console.log("[received message]:");
      console.log(msg);
      console.log(this.users);
    }

    //determine user specific parameters
    let ts = new Date(msg.timestamp);
    let i = this.users.findIndex(x => {
      return x.ID === msg.UID
    });
    let color;
    let name;
    if (i < 0) { //not a current user
      color = msg.color;
      name = msg.name;
    } else { //a current user
      color = this.users[i].color;
      name = this.users[i].name
    }

    //compose html content of message
    let html = '<div class="msg_head">';
    html += '<span class="timestamp" style="color: #aaa; margin-left: 0.5em;">' + ts.getHours() + ':' + (ts.getMinutes() > 9 ? ts.getMinutes() : '0' + ts.getMinutes()) + '</span>';
    html += '<span class="username" style="color:' + color + '; margin-left: 0.5em;">' + name + '</span>';
    html += '</div>';
    html += '<span ' + ((this.currentUser.ID === msg.UID) ? 'class="bold"' : '') + '>' + msg.message + '</span>';

    //$('#messages').prepend($('<div class="msg">').html(html) );
    $('#msg_container').append($('<div class="msg">').html(html));

    //This keeps the scroll bar at the bottom of the message window
    //let scrollDiv = document.getElementById("#messages");
    let scrollDiv = document.getElementById("msg_container");

    if (scrollDiv !== null) {
      scrollDiv.scrollTop = scrollDiv.scrollHeight;
    }
  };



}
