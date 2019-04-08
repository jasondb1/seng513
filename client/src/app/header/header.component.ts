import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../config.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  displayMenu: boolean;

  constructor(private configService: ConfigService) { }

  //Toggles the chat box on the side
  toggleChat(): void {
    //this.messagingComponent.openChat();


    this.configService.displayChat = !this.configService.displayChat;

    if (this.configService.displayChat) {
      document.getElementById("content").className = "order-4 col-12 col-md-9";
      document.getElementById("chat").style.display = "block";
    } else {
      document.getElementById("chat").style.display = "none";
      document.getElementById("content").className = "order-0 col-12 col-md-12";
    }

    //console.log("[toggle chat called]" + this.configService.displayChat);
  }


  //TODO: Do not display chat unless a project is selected

  ngOnInit() {

    this.configService.displayChat = false;
    this.displayMenu = false;

  }


}
