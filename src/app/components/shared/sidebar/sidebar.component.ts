import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  constructor(
    private router: Router,
    private authService: MsalService
  ) { }

  ngOnInit(): void {
  }

  logout() { // Add log out function here
    this.authService.logoutPopup({
      mainWindowRedirectUri: "/"
    });
  }
  }

//   toggleSidebar(){
//     let btn = document.querySelector("btn");
//     let sidebar = document.querySelector(".sidebar");
//     let searchBtn = document.querySelector(".bx-search");
//     console.log("Test")

    
// }
//   }

