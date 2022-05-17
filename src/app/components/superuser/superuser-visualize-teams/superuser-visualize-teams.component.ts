import { Component, OnInit } from '@angular/core';
import { Complete_Team360, DbUserTeam360, User } from 'src/app/models/db-user';
import { DatabaseService } from 'src/app/services/dataManagement/database.service';

@Component({
  selector: 'app-superuser-visualize-teams',
  templateUrl: './superuser-visualize-teams.component.html',
  styleUrls: ['./superuser-visualize-teams.component.css']
})
export class SuperuserVisualizeTeamsComponent implements OnInit {
  userList?: Array<User>
  userTeam?: Array<Complete_Team360>
  userTeamNotApproved?: Array<Complete_Team360>
  currentUser: string = ""
  displayPage: boolean = false


  constructor(
    private db: DatabaseService
  ) { }

  ngOnInit(): void {
    this.db.getUsers().subscribe(resp =>{
      this.userList = resp
      this.displayPage = true
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
