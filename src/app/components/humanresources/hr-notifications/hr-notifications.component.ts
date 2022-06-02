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
  constructor(
    private db: DatabaseService, 
    public dp: DatePipe
  ) { }
  

  ngOnInit(): void {
    this.getDays();

  }

  getDays(){
    this.db.getNotificationsDays(287).subscribe(resp =>{
      this.Notificationdata = resp
      this.getNotifications();
    })
  }

  getNotifications(){
    if(this.Notificationdata != null){
      for(let i in this.Notificationdata){
        // console.log("Fecha query: " + this.Notificationdata[i].date)
        this.db.getNotifications(this.Notificationdata[i].date, 287).subscribe(resp=>{
          if(this.Notificationdata != null){
            this.Notificationdata[i].Notifications = resp;
          }
        })
      }
    }
  }
}
