import { Component, OnInit } from '@angular/core';
import { Day } from 'src/app/models/db-user';
import { DatabaseService } from 'src/app/services/dataManagement/database.service';
import { threadId } from 'worker_threads';
import { DatePipe } from '@angular/common';
import { User } from 'src/app/models/db-user';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-hr-notifications',
  templateUrl: './hr-notifications.component.html',
  styleUrls: ['./hr-notifications.component.css']
})
export class HrNotificationsComponent implements OnInit {
  today:Date = new Date();
  Notificationdata?: Array<Day>
  currentID: number = 0
  userList?: Array<User>
  constructor(
    private db: DatabaseService, 
    public dp: DatePipe, 
    private http: HttpClient
  ) {}
  

  ngOnInit(): void {
    this.queryUsers();
  }

queryUsers() {
    this.db.getUsers().subscribe(resp =>{
      this.userList = resp;
  })
}

  searchNotifications(){
    this.getDays()
  }

  getDays(){
    this.db.getNotificationsDays(this.currentID).subscribe(resp =>{
      this.Notificationdata = resp
      console.log(resp)
      console.log(this.currentID)
      this.getNotifications();
    })
  }

  getNotifications(){
    if(this.Notificationdata != null){
      for(let i in this.Notificationdata){
        // console.log("Fecha query: " + this.Notificationdata[i].date)
        this.db.getNotifications(this.Notificationdata[i].date, this.currentID).subscribe(resp=>{
          if(this.Notificationdata != null){
            this.Notificationdata[i].Notifications = resp;
          }
        })
      }
    }
  }
}
