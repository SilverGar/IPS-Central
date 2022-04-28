import { Component, OnInit } from '@angular/core';
import { MsSignInService } from 'src/app/services/ms-sign-in.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  constructor(
    private msSignIn: MsSignInService
  ) { }

  ngOnInit(): void {
    
  }

  logout() { // Add log out function here
    this.msSignIn.logout()
  }
}
