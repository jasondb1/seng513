import { Component, OnInit, Input } from '@angular/core';
import { ViewOptionsService} from "../view-options.service";

@Component({
  selector: 'app-messaging',
  templateUrl: './messaging.component.html',
  styleUrls: ['./messaging.component.css']
})
export class MessagingComponent implements OnInit {

  //@Input() displayChat: boolean;
  displayChat: boolean = null;
  project: number = null;

  closeChat(): void {
    document.getElementById("chat").style.display = "none";
    document.getElementById("content").className = "col-12";
    this.displayChat = false;
    this.viewOptionsService.displayChat = false;
  }

  openChat(): void {
    document.getElementById("content").className = "col-9";
    document.getElementById("chat").style.display = "block";
    this.displayChat = true;
    this.viewOptionsService.displayChat = true;
  }

  //TODO: save and load discussions

  constructor(private viewOptionsService: ViewOptionsService) { }

  ngOnInit() {
    this.displayChat = true;
    //this.displayChat = this.viewOptionsService.displayChat;
    this.project = this.viewOptionsService.projectNumber;
    console.log("[messaging initialized]" + this.displayChat);
  }

}
