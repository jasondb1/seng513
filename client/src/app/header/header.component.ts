import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../config.service';
import { DataService} from "../data.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  displayMenu: boolean;
  displayAdmin: boolean;

  constructor(private configService: ConfigService,
              private dataService: DataService) {
    this.displayAdmin = ConfigService.isAdmin;

  }

  logOut(): void {
    this.dataService.logOut();
  }

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
