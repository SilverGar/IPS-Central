import { Component, OnInit } from '@angular/core';
import { MsalService } from '@azure/msal-angular';

@Component({
  selector: 'app-sidebar-superuser',
  templateUrl: './sidebar-superuser.component.html',
  styleUrls: ['./sidebar-superuser.component.css']
})
export class SidebarSuperuserComponent implements OnInit {

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
