import { Component, OnInit } from '@angular/core';
import Chatkit from '@pusher/chatkit-client';
import {ConfigService} from "../config.service";
import axios from 'axios';
declare var $: any;

@Component({
  selector: 'app-messaging',
  templateUrl: './messaging.component.html',
  styleUrls: ['./messaging.component.css']
})

export class MessagingComponent implements OnInit {
  //userId = '';
  uid = '';
  currentUser = <any>{};
  messages = [];
  currentRoom = <any>{};
  roomUsers = [];
  userRooms = [];
  newMessage = '';
  newRoom = {
    name: '',
    isPrivate: false
  };
  joinableRooms = [];
  newUser = '';

  constructor(
    private configService: ConfigService
  ){}

  ngOnInit(){
    this.currentUser.id = this.configService.currentUser;
    this.uid = this.currentUser.id;
    console.log(this.currentUser.id);
    this.addUser();
  }

  scrollDown(){
    let scrollDiv = document.getElementById("chat-session");

    if(scrollDiv !== null) {
      scrollDiv.scrollTop = scrollDiv.scrollHeight;
    }
  }

  addUserToRoom() {
    const { newUser, currentUser, currentRoom } = this;
    currentUser.addUserToRoom({
      userId: newUser,
      roomId: currentRoom.id
    })
      .then((currentRoom) => {
        this.roomUsers = currentRoom.users;
      })
      .catch(err => {
        console.log(`Error adding user: ${err}`);
      });

    this.newUser = '';
  }

  createRoom() {
    const { newRoom: { name, isPrivate }, currentUser } = this;

    if (name.trim() === '') return;

    currentUser.createRoom({
      name,
      private: isPrivate,
    }).then(room => {
      this.connectToRoom(room.id);
      this.newRoom = {
        name: '',
        isPrivate: false,
      };
    })
      .catch(err => {
        console.log(`Error creating room ${err}`)
      })
  }

  getJoinableRooms() {
    const { currentUser } = this;
    currentUser.getJoinableRooms()
      .then(rooms => {
        this.joinableRooms = rooms;
      })
      .catch(err => {
        console.log(`Error getting joinable rooms: ${err}`)
      })
  }

  joinRoom(id) {
    const { currentUser } = this;
    currentUser.joinRoom({ roomId: id })
      .catch(err => {
        console.log(`Error joining room ${id}: ${err}`)
      })
  }

  connectToRoom(id) {
    this.messages = [];
    const { currentUser } = this;

    currentUser.subscribeToRoom({
      roomId: `${id}`,
      messageLimit: 100,
      hooks: {
        onMessage: message => {
          this.messages.push(message);


          let scrollDiv = document.getElementById("chat-session");

          if(scrollDiv !== null) {
            scrollDiv.scrollTop = scrollDiv.scrollHeight;
          }

        },
        onPresenceChanged: () => {
          this.roomUsers = this.currentRoom.users.sort((a) => {
            if (a.presence.state === 'online') return -1;

            return 1;
          });
        },
      },
    })
      .then(currentRoom => {
        this.currentRoom = currentRoom;
        this.roomUsers = currentRoom.users;
        this.userRooms = currentUser.rooms;

      });
  }

  sendMessage() {
    const { newMessage, currentUser, currentRoom } = this;

    if (newMessage.trim() === '') return;

    currentUser.sendMessage({
      text: newMessage,
      roomId: `${currentRoom.id}`,
    });

    this.newMessage = '';
  }

  addUser() {

    const { uid } = this;
    axios.post('/api/msg/users', { username: uid })
      .then(() => {
        const tokenProvider = new Chatkit.TokenProvider({
          url: this.configService.messagingUrl
        });

        const chatManager = new Chatkit.ChatManager({
          instanceLocator: 'v1:us1:03c31da5-6cc7-4d98-9fcd-db504679cac0',
          userId: uid,
          tokenProvider
        });

        return chatManager
          .connect({
            onAddedToRoom: room => {
              console.log(`Added to room ${room.name}`);
              this.userRooms.push(room);
              this.getJoinableRooms();
            },
          })
          .then(currentUser => {
            this.currentUser = currentUser;
            this.connectToRoom('19391085');
            this.getJoinableRooms();
          });
      })
      .catch(error => console.error(error))
  }
}
