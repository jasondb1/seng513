import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  currentUser: any = {};
  users: string[] = [];

  private url = 'http://localhost:3000';
  private socket;

  public sendMessage(message) {
    this.socket.emit('clientMessage', message);
  }

  constructor() {
    this.socket = io(this.url);
  }



}
