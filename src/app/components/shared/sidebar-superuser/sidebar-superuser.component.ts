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
  imageSrc = 'https://yt3.ggpht.com/a/AGF-l79b_9Tw9iTZ9nM_qOeACpuCz3kUc1EWEsgKUQ=s900-mo-c-c0xffffffff-rj-k-no'  
  imageAlt = 'Inflection Point'


  isMenuOpened: boolean = false;

  constructor(
    private msSignIn: MsSignInService
  ) { }


  
  toggleMenu(): void{
    this.isMenuOpened = !this.isMenuOpened;
  }

  clickedOutside(): void{
    this.isMenuOpened = false;
  }

  ngOnInit(): void {
    this.msSignIn.getProfile().subscribe(resp => this.profile = resp);
    this.msSignIn.verifyPage(2);
  }

  logout() { // Add log out function here
    this.msSignIn.logout()
  }

}
