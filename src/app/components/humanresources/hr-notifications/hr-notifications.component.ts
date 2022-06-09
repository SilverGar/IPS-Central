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
  alphabeticSort: boolean = false
  approvedSort: boolean = false
  orphanSort: boolean = false
  searchQuery: string = ''

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

  sortUserList(input: number, query: string){
    if(this.userList != null){
      switch (input){
        case 1:
          this.userList = this.filterItems(query)
          break
        case 2:
          this.userList?.sort((a, b) => (b.name ?? '').localeCompare((a.name ?? '')))
          this.alphabeticSort = !this.alphabeticSort
          break
        case 3:
          this.userList?.sort((a, b) => (a.name ?? '').localeCompare((b.name ?? '')))
          this.alphabeticSort = !this.alphabeticSort
          break
        case 4:
          this.approvedSort = !this.approvedSort
          this.userList = this.filterApproved(this.approvedSort)
          break
        case 5:
          this.orphanSort = !this.orphanSort
          this.userList = this.filterOrphans(this.orphanSort)
          break;
          
      }
    }
  }

  filterOrphans(input: boolean){
    var newDisplay: Array<User> = []
    if(this.userList != null){
      for(var i in this.userList){
        if(input){
          if(this.userList[i].Status == 0){
            newDisplay.push(this.userList[i])
          }
        }
        else{
          if(this.userList[i].Status != 0){
            newDisplay.push(this.userList[i])
          }
        }
        
      }
    }
    return newDisplay
  }

  filterApproved(input: boolean){
    var newDisplay: Array<User> = []
    if(this.userList != null){
      for(var i in this.userList){
        if(input){
          if(this.userList[i].Status != 2){
            newDisplay.push(this.userList[i])
          }
        }
        else{
          if(this.userList[i].Status == 2){
            newDisplay.push(this.userList[i])
          }
        }
        
      }
    }
    return newDisplay
  }

  filterItems(query: string){
    return this.userList?.filter(function(el) {
        return el.name?.toLocaleLowerCase().indexOf(query.toLowerCase()) !== -1
    })
}
}
