import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-hr-notifications',
  templateUrl: './hr-notifications.component.html',
  styleUrls: ['./hr-notifications.component.css']
})
export class HrNotificationsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  title = 'Menu';

  isMenuOpened: boolean = false;
  
  toggleMenu(): void{
    this.isMenuOpened = !this.isMenuOpened;
  }

  clickedOutside(): void{
    this.isMenuOpened = false;
  }
}
