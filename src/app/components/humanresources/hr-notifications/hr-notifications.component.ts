import { Component, OnInit } from '@angular/core';
import { Day } from 'src/app/models/db-user';
import { DatabaseService } from 'src/app/services/dataManagement/database.service';
import { threadId } from 'worker_threads';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-hr-notifications',
  templateUrl: './hr-notifications.component.html',
  styleUrls: ['./hr-notifications.component.css']
})
export class HrNotificationsComponent implements OnInit {
  today:Date = new Date();
  Notificationdata?: Array<Day>
  currentID: number = 0
  constructor(
    private db: DatabaseService, 
    public dp: DatePipe
  ) { }
  

  ngOnInit(): void {
    this.getDays();
  }

  searchNotifications(){
    this.getDays()
  }

  getDays(){
    this.db.getNotificationsDays(this.currentID).subscribe(resp =>{
      console.log(this.currentID)
      this.Notificationdata = resp
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
