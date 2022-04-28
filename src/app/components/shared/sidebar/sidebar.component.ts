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
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  profile!: ProfileType
  constructor(
    private msSignIn: MsSignInService
  ) { }

  ngOnInit(): void {
    this.msSignIn.getProfile().subscribe(resp => {
      this.profile = resp
    })
  }

  logout() { // Add log out function here
    this.msSignIn.logout()
  }
}
