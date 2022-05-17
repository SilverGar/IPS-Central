import { Component, OnInit } from '@angular/core';
import { filter } from 'rxjs';
import { Complete_Team360, DbUserTeam360, User } from 'src/app/models/db-user';
import { DatabaseService } from 'src/app/services/dataManagement/database.service';

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
    private db: DatabaseService
  ) { }

  ngOnInit(): void {
    this.db.getUsers().subscribe(resp =>{
      this.userList = resp
      this.displayUserList = resp
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

    var newUserList: Array<Complete_Team360> = []
    var newUserListNotApproved: Array<Complete_Team360> = []
    for(var i in resp){
      if(resp[i].OwnerCheck == null){
      resp[i].OwnerCheck = true
      }
      if(resp[i].PartnerCheck == null){
      resp[i].PartnerCheck = true
      }

      if(resp[i].Approved == false){
      newUserListNotApproved.push(resp[i])
      }
      else{
      newUserList.push(resp[i])
      }
    }

    this.userTeam = newUserList
    this.userTeamNotApproved = newUserListNotApproved
    })
  }

  debugging(input: string){
    console.log("Hola" + input)
  }

}
