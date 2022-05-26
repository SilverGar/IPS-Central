import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Complete_Team360, NotificationData, getConflictData, User } from 'src/app/models/db-user';
import { DatabaseService } from 'src/app/services/dataManagement/database.service';
import { HrPopUpConflictComponent } from '../hr-pop-up-conflict/hr-pop-up-conflict.component';

@Component({
  selector: 'app-hr-approveteams',
  templateUrl: './hr-approveteams.component.html',
  styleUrls: ['./hr-approveteams.component.css']
})
export class HrApproveteamsComponent implements OnInit {

  userList?: Array<User>
  displayUserList?: Array<User> 
  userTeam?: Array<Complete_Team360>
  userTeamNotApproved?: Array<Complete_Team360>
  currentUser: string = ""
  currentUserMail: string = ""

  searchQuery: string = ''

  ownerEditing: boolean = false

  constructor(
    private db: DatabaseService,
		private dialog: MatDialog,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.db.getUsers().subscribe(resp =>{
      this.userList = resp
      this.displayUserList = resp
    })
  }

  checkConflict(input: Complete_Team360){
      const dialogConfig = new MatDialogConfig()
      dialogConfig.disableClose = true
      dialogConfig.autoFocus = true

			dialogConfig.data = {
				newUser: input
			}

			const dialogRef = this.dialog.open(HrPopUpConflictComponent, dialogConfig)
			dialogRef.afterClosed().subscribe(data => {
        input.Notification = data
			})

  }

  sortUserList(input: number, query: string){
    if(this.userList != null){
      switch (input){
        case 1:
          this.displayUserList = this.filterItems(query)
          break
        case 2:
          this.displayUserList?.sort((a, b) => (a.name ?? '').localeCompare((b.name ?? '')))
          break
        case 3:
          this.displayUserList?.sort((a, b) => (b.name ?? '').localeCompare((a.name ?? '')))
          break
        case 4:
          this.displayUserList = this.filterApproved(false)
          break
        case 5:
          this.displayUserList = this.filterApproved(true)
          break
      }
    }
  }

  filterApproved(input: boolean){
    var newDisplay: Array<User> = []
    if(this.userList != null){
      for(var i in this.userList){
        if(this.userList[i].AllowEditing == input){
          newDisplay.push(this.userList[i])
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

  getTeam(input: string){
    this.currentUserMail = input
    this.db.getEmployeeEditing(input).subscribe(resp => {
      this.ownerEditing = resp
      this.db.getCompleteTeam360(input).subscribe(resp => {
        this.processTeam(resp, this.ownerEditing)
      })
    })
  }

  processTeam(input: Array<Complete_Team360>, allowEditing: boolean){
    //Warning Levels:
    //0 -> Approved already
    //1 -> Not confirmed one or the other or both
    //2 -> Conflicts
    //3 -> Exceptions

    for(var i in input){
      input[i].Notification = []
      switch (input[i].EvalType){
        case 2:
          input[i].EvalTypePartner = 1
          break
        case 1:
          input[i].EvalTypePartner = 2
          break
        default:
          input[i].EvalTypePartner = 0
          break
      }

      input[i].HrDecision = true
      if(allowEditing){
        input[i].warning = 0
        if(input[i].OwnerCheck == null || input[i].PartnerCheck == null){
          input[i].warning = 1
        }

        if(input[i].PartnerCheck == false){
          input[i].warning = 2
          this.notificationModule(input[i], 0, false)
        }

        if((input[i].Approved == false || input[i].Hours < 40) && input[i].warning != 2){
          input[i].warning = 3
          input[i].HrDecision = false
          this.notificationModule(input[i], 1, false)
        }
        
        if(input[i].OwnerCheck == null){
          input[i].OwnerCheck = true
        }
      }
      else{
        input[i].warning = 0

        if(input[i].PartnerCheck == null){
          input[i].warning = 1
        }

        if(input[i].PartnerCheck == false || input[i].OwnerCheck == false){
          input[i].warning = 2
          this.notificationModule(input[i], 0, false)
        }

        if((input[i].Approved == false || input[i].Hours < 40) && input[i].warning != 2){
          input[i].warning = 3
          input[i].HrDecision = input[i].Approved
          this.notificationModule(input[i], 1, false)
        }
      }
    }
    this.userTeam = input
  }

  notificationModule(input: Complete_Team360, notificationAction: number, flipSwitch: boolean){
    //Notification Action
    // 0-> Query conflict data and replace
    // 1-> Delete user from conflict and push
    // 2-> Add Notificacion due to adding user

    

    if(flipSwitch){
      input.HrDecision = !input.HrDecision
      if(input.warning == 2){
        notificationAction = 1
      }

      if(input.warning == 3){
        if(input.Approved == false){
          input.Approved = true
          input.HrDecision = true
        }
        else{
          input.Approved = false
          input.HrDecision = false
        }
        notificationAction = 2
      }
      

    }

    if(notificationAction == 0){
      this.notificationConflict(input)
    }
    else if(notificationAction == 1){
      this.notificationDualConflict(input)
    }
    else{
      this.notificationAddUser(input)
    }
  }

  notificationConflict(input: Complete_Team360){
    var conflictQuery: getConflictData ={
      owner: input.TeamOwnerID ?? 0,
      partner: input.PartnerID ?? 0,
      evalTypeOwner: input.EvalType ?? 0,
      evalTypePartner: input.EvalTypePartner ?? 0,
      RequestType: 0
    }

    input.Notification = []
    this.db.getConflictData(conflictQuery).subscribe(resp => {
      input.Notification = resp
      for(var i in input.Notification){
        input.conflictStatus = input.Notification[i].Status
      }
    })
  }

  notificationDualConflict(input: Complete_Team360){
    if(input.Approved == true && input.HrDecision == true){
      var conflictQuery: getConflictData ={
        owner: input.TeamOwnerID ?? 0,
        partner: input.PartnerID ?? 0,
        evalTypeOwner: input.EvalType ?? 0,
        evalTypePartner: input.EvalTypePartner ?? 0,
        RequestType: 0
      }
  
      input.Notification = []
      this.db.getConflictData(conflictQuery).subscribe(resp => {
        input.Notification = resp
        if(resp.length < 2 && input.HrDecision == false){
          if(input.OwnerCheck == false){
            var notificationPartner: NotificationData = {
              OwnerName: input.Partner ?? '',
              OwnerID: input.PartnerID ?? 0,
              PartnerID: input.TeamOwnerID ?? 0,
              EvalType: input.EvalTypePartner ?? 0,
              Reason: '',
              HrResponse: '',
              RequestType: 0,
              Status: false
            }
            input.Notification.push(notificationPartner)
          }
          else{
            var notificationOwner: NotificationData = {
              OwnerName: input.TeamOwner ?? '',
              OwnerID: input.TeamOwnerID ?? 0,
              PartnerID: input.PartnerID ?? 0,
              EvalType: input.EvalType ?? 0,
              Reason: '',
              HrResponse: '',
              RequestType: 0,
              Status: false
            }
            input.Notification.push(notificationOwner)
          }
        }
      })
    }
  }

  notificationAddUser(input: Complete_Team360){

    var conflictQuery: getConflictData ={
      owner: input.TeamOwnerID ?? 0,
      partner: input.PartnerID ?? 0,
      evalTypeOwner: input.EvalType ?? 0,
      evalTypePartner: input.EvalTypePartner ?? 0,
      RequestType: 1
    }

    this.db.getConflictData(conflictQuery).subscribe(resp => {
      if(resp.length != 0){
        input.Notification = resp
      }
      else{
        if(input.Approved == false && input.HrDecision == false){
          input.Notification = []
        }
        else{
          input.Notification = []
          var notificationOwner: NotificationData = {
            OwnerName: input.TeamOwner ?? '',
            OwnerID: input.TeamOwnerID ?? 0,
            PartnerID: input.PartnerID ?? 0,
            EvalType: input.EvalType ?? 0,
            Reason: '',
            HrResponse: '',
            RequestType: 1,
            Status: false
          }
        
          var notificationPartner: NotificationData = {
            OwnerName: input.Partner ?? '',
            OwnerID: input.PartnerID ?? 0,
            PartnerID: input.TeamOwnerID ?? 0,
            EvalType: input.EvalTypePartner ?? 0,
            Reason: '',
            HrResponse: '',
            RequestType: 1,
            Status: false
          }
          input.Notification = []
          input.Notification?.push(notificationOwner)
          input.Notification?.push(notificationPartner)
        
          }
        }
    })
  }

  checkMessage(input: Array<NotificationData>): boolean{
    var output = false
    if(input.length > 0){
      for(var i in input){
        if((input[i].HrResponse?.length ?? 0) > 0){
          output = true
        }
      }
    }
    return output
  }

  confirmTeam(){
    this.db.hr_ConfirmTeam(this.userTeam ?? []).subscribe(resp => {
      this.getTeam(this.currentUserMail)
    })
  } 
}
