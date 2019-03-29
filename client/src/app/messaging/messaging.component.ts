import { Component, OnInit, Input } from '@angular/core';
import { ConfigService} from "../config.service";
import { ChatService } from '../chat.service';

@Component({
  selector: 'app-messaging',
  templateUrl: './messaging.component.html',
  styleUrls: ['./messaging.component.css']
})
export class MessagingComponent implements OnInit {

  //@Input() displayChat: boolean;
  displayChat: boolean = null;
  project: number = null;
  message: string;

  constructor(private configService: ConfigService,
              private chatService: ChatService) { }

  sendMessage() {
    this.chatService.sendMessage(this.message);
    this.message = '';
  }

  closeChat(): void {
    document.getElementById("chat").style.display = "none";
    document.getElementById("content").className = "col-12";
    this.displayChat = false;
    this.configService.displayChat = false;
  }

  openChat(): void {
    document.getElementById("content").className = "col-9";
    document.getElementById("chat").style.display = "block";
    this.displayChat = true;
    this.configService.displayChat = true;
  }

  //TODO: save and load discussions


  ngOnInit() {
    this.project = this.configService.projectNumber;
    console.log("[messaging initialized] display chat:" + this.displayChat);

  }

}
