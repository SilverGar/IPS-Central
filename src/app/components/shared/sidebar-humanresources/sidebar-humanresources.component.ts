import { Component, OnInit } from '@angular/core';
import { MsalService } from '@azure/msal-angular';

@Component({
  selector: 'app-sidebar-humanresources',
  templateUrl: './sidebar-humanresources.component.html',
  styleUrls: ['./sidebar-humanresources.component.css']
})
export class SidebarHumanresourcesComponent implements OnInit {

  constructor(
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
