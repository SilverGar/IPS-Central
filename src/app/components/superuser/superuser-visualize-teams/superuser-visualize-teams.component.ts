import { Component, OnInit } from '@angular/core';
import { DbUserTeam360, User } from 'src/app/models/db-user';
import { DatabaseService } from 'src/app/services/dataManagement/database.service';

@Component({
  selector: 'app-superuser-visualize-teams',
  templateUrl: './superuser-visualize-teams.component.html',
  styleUrls: ['./superuser-visualize-teams.component.css']
})
export class SuperuserVisualizeTeamsComponent implements OnInit {
  userList?: Array<User>
  userTeam?: Array<DbUserTeam360>
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
    this.db.getEmployeeTeam(input).subscribe(resp => {
      this.userTeam = resp
    })
  }

  debugging(input: string){
    console.log("Hola" + input)
  }

}
