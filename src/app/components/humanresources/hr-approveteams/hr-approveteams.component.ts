import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { filter, Subscription } from 'rxjs';
import { Complete_Team360, DbUserTeam360, getConflictData, User } from 'src/app/models/db-user';
import { DataSharingService } from 'src/app/services/dataManagement/data-sharing.service';
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

  searchQuery: string = ''

  constructor(
    private db: DatabaseService,
		private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.db.getUsers().subscribe(resp =>{
      this.userList = resp
      this.displayUserList = resp
    })

    // var testing: getConflictData = {
    //     owner: 2,
    //     partner: 7,
    //     evalTypeOwner: 0,
    //     evalTypePartner: 0
    // }
    // this.db.getConflictData(testing).subscribe(resp => {
    //     console.log("Conflictos.")
    //     console.log(resp)
    // })
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
				console.log("Dialog Output: ")
				console.log(data)
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
    
    this.db.getCompleteTeam360(input).subscribe(resp => {

      this.sortTeam(resp)
      
    })
  }

  sortTeam(input: Array<Complete_Team360>){
    var newUserList: Array<Complete_Team360> = []
      var newUserListNotApproved: Array<Complete_Team360> = []
      for(var i in input){
        if(input[i].OwnerCheck == null){
          input[i].OwnerCheck = true
          if(input[i].Hours ?? 0 < 40){
            input[i].warning = true
          }
          else{
            input[i].warning = false
          }
        }
        if(input[i].PartnerCheck == null){
          input[i].PartnerCheck = true
        }
        if(input[i].Approved == false){
        newUserListNotApproved.push(input[i])
        }
        else{
        newUserList.push(input[i])
        }
      }

    this.userTeam = newUserList
    this.userTeamNotApproved = newUserListNotApproved
  }

  debugging(input: string){
    console.log("Hola" + input)
  }

}
