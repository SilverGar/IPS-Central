import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Complete_Team360, User } from 'src/app/models/db-user';
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


  dbResponseTeams: Array<Complete_Team360> = []

  searchQuery: string = ''

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
      console.log("RAW DATA COMPONENT")
      console.log(resp)
      if(resp != null){
        this.processTeam(resp)
        //this.testingNull(resp)
      }
    })
  }

  testingNull(input?: Array<Complete_Team360>){
    console.log("Debug")
    console.log(input)
  }

  processTeam(input?: Array<Complete_Team360>){
    if(input != null){
      for(var i in input){
        //Warning Levels:
        //0 -> Not important
        //1 -> Conflict
        //2 -> Doesn't have the requirement
        
        input[i].warning = 0
  
  
        // Checamos si ya estan aprobados.
        if(input[i].Approved == null){
          input[i].warning = 1
        }
  
        if(input[i].Approved == null || input[i].Approved == true){
          input[i].Approved = true
        }
        else{
          input[i].Approved = false
        }
  
        //Los null del Owner y Partner se vuelven true para poder desplegar en la pagina web.
        if(input[i].OwnerCheck == null){
          input[i].OwnerCheck = true
        }
  
        if(input[i].PartnerCheck == null){
          input[i].PartnerCheck = true
        }
  
        //En base a lo anterior, se "precalifica" los resultados.
        input[i].HrDecision = input[i].Approved
  
        //Asignamos prioridades y warnings.
        if(input[i].PartnerCheck && input[i].OwnerCheck){
          input[i].warning = 1
        }
  
        if(input[i].OwnerCheck == false || input[i].PartnerCheck == false){
          input[i].warning = 2
        }
  
        if(input[i].Approved == false){
          input[i].warning = 3
        }
      }
      console.log("Sort result")
      console.log(input)
      this.userTeam = input
    }
    
  }


  debugging(input: string){
    console.log("Hola" + input)
  }

}
