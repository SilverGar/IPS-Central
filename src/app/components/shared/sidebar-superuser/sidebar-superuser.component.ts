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
  selector: 'app-sidebar-superuser',
  templateUrl: './sidebar-superuser.component.html',
  styleUrls: ['./sidebar-superuser.component.css']
})
export class SidebarSuperuserComponent implements OnInit {
  profile!: ProfileType
  constructor(
    private msSignIn: MsSignInService
  ) { }

  ngOnInit(): void {
    this.msSignIn.getProfile().subscribe(resp => this.profile = resp);
    this.msSignIn.verifyPage(2);
  }

  logout() { // Add log out function here
    this.msSignIn.logout()
  }

}
