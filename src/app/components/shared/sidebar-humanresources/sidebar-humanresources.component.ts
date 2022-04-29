import { Component, OnInit } from '@angular/core';
import { MsSignInService } from 'src/app/services/ms-sign-in.service';

type ProfileType = {
  givenName?: string;
  surname?: string,
  userPrincipalName?: string,
  id?: string,
  mail?: string
};

@Component({
  selector: 'app-sidebar-humanresources',
  templateUrl: './sidebar-humanresources.component.html',
  styleUrls: ['./sidebar-humanresources.component.css']
})
export class SidebarHumanresourcesComponent implements OnInit {

  profile!: ProfileType

  constructor(
    private msSignIn: MsSignInService
  ) { }

  ngOnInit(): void {
    this.msSignIn.getProfile().subscribe(resp => this.profile = resp);
    this.msSignIn.verifyPage(1);
  }

  logout() { // Add log out function here
    this.msSignIn.logout()
  }
}
