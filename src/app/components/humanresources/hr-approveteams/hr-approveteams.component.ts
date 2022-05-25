import { HttpClient } from '@angular/common/http';
import { IfStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { info } from 'console';
import { identity } from 'rxjs';
import { Complete_Team360, dbConflictData, getConflictData, User } from 'src/app/models/db-user';
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
    console.log("Busqueda: " + query)
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
    console.log("Nombre")
    console.log(input)
    this.currentUserMail = input
    this.db.getEmployeeEditing(input).subscribe(resp => {
      this.ownerEditing = resp
      console.log("Respuesta")
      console.log(resp)
      this.db.getCompleteTeam360(input).subscribe(resp => {
        this.processTeam(resp, this.ownerEditing)
      })
    })
  }

  processTeam(input: Array<Complete_Team360>, allowEditing: boolean){
    console.log(input)
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
          this.getNotification(input[i])
        }

        if(input[i].Approved == false){
          input[i].warning = 3
          input[i].HrDecision = false
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
          this.getNotification(input[i])
        }

        if(input[i].Approved == false){
          input[i].warning = 3
          input[i].HrDecision = false
        }
      }

      

    }
    this.userTeam = input
  }

  checkMessage(input: Array<dbConflictData>): boolean{
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
    console.log("Post now")
    this.db.hr_ConfirmTeam(this.userTeam ?? []).subscribe(resp => {
      console.log("Respuesta")
      console.log(resp)
      this.getTeam(this.currentUserMail)
    })
  }

  getNotification(input: Complete_Team360){


    var conflictData: getConflictData ={
      owner: input.TeamOwnerID ?? 0,
      partner: input.PartnerID ?? 0,
      evalTypeOwner: input.EvalType ?? 0,
      evalTypePartner: input.EvalTypePartner ??0
    }



    input.Notification = []
    console.log("Query Notificacion")
    console.log(conflictData)
    this.db.getConflictData(conflictData).subscribe(resp => {
      console.log("Conflicto")
      console.log(resp)
      input.Notification = resp
    })
  }


  conflictDecision(input: Complete_Team360){
    input.HrDecision = !input.HrDecision
    
    var conflictData: getConflictData ={
      owner: input.TeamOwnerID ?? 0,
      partner: input.PartnerID ?? 0,
      evalTypeOwner: input.EvalType ?? 0,
      evalTypePartner: input.EvalTypePartner ??0
    }
    input.Notification = []
    // console.log("Query Notificacion")
    // console.log(conflictData)
    this.db.getConflictData(conflictData).subscribe(resp => {
      input.Notification = resp
      if(resp.length < 2 && input.HrDecision == false){
        if(input.OwnerCheck == false){
          var notificationPartner: dbConflictData = {
            OwnerName: input.Partner ?? '',
            OwnerID: input.PartnerID ?? 0,
            PartnerID: input.TeamOwnerID ?? 0,
            EvalType: input.EvalTypePartner ?? 0,
            Reason: '',
            HrResponse: '',
            requestType: 0
          }
          input.Notification.push(notificationPartner)
        }
        else{
          var notificationOwner: dbConflictData = {
            OwnerName: input.TeamOwner ?? '',
            OwnerID: input.TeamOwnerID ?? 0,
            PartnerID: input.PartnerID ?? 0,
            EvalType: input.EvalType ?? 0,
            Reason: '',
            HrResponse: '',
            requestType: 0
          }
          input.Notification.push(notificationOwner)
        }
      }
      console.log("Resultado")
      console.log(input.Notification)
    })
  }

  addNewUser(input: Complete_Team360){
    input.Approved = !input.Approved
    input.HrDecision = !input.HrDecision

    

    if(input.HrDecision == true){
      var notificationOwner: dbConflictData = {
        OwnerName: input.TeamOwner ?? '',
        OwnerID: input.TeamOwnerID ?? 0,
        PartnerID: input.PartnerID ?? 0,
        EvalType: input.EvalType ?? 0,
        Reason: '',
        HrResponse: '',
        requestType: 1
        }
    
      var notificationPartner: dbConflictData = {
        OwnerName: input.Partner ?? '',
        OwnerID: input.PartnerID ?? 0,
        PartnerID: input.TeamOwnerID ?? 0,
        EvalType: input.EvalTypePartner ?? 0,
        Reason: '',
        HrResponse: '',
        requestType: 1
      }
  
      input.Notification = []
      input.Notification?.push(notificationOwner)
      input.Notification?.push(notificationPartner)
    }
    else{
      input.Notification = []
    }
    
  }
    
}
