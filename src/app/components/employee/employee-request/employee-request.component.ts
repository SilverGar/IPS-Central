import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DataSharingService } from 'src/app/services/dataManagement/data-sharing.service';
import { DbUserTeam360 } from 'src/app/models/db-user';
import { DatabaseService } from 'src/app/services/dataManagement/database.service';
import { MsSignInService } from 'src/app/services/ms-sign-in.service';
import { Router } from '@angular/router';


type ProfileType = {
  givenName?: string;
  surname?: string,
  userPrincipalName?: string,
  id?: string,
  mail? : string
};

type messages = {
  message: string,
  partner: number,
  evalType: number
}

@Component({
  selector: 'app-employee-request',
  templateUrl: './employee-request.component.html',
  styleUrls: ['./employee-request.component.css']
})
export class EmployeeRequestComponent implements OnInit, OnDestroy {

  //EQUIPOS
  profile!: ProfileType;
  displayTeam?: Array<DbUserTeam360>;

  //HTML UI
  allowEditing: boolean = false
  loadingScreen: boolean = true
  subscription?: Subscription



  constructor(
    private router: Router,
    private db: DatabaseService,
    private msSignIn: MsSignInService,
    private dataSharingService: DataSharingService
  ) { }

  ngOnInit(): void {
    this.loadData(false)
    this.subscription = this.dataSharingService.currentUpdate.subscribe(resp => {
      if(resp != 0){
        this.loadData(true)
      }
    })
  }

  loadData(merge: boolean){
    this.msSignIn.getProfile().subscribe(resp => {
      this.profile = resp
      //Si ya confirmo su equipo, no se desplegara la informacion. Esto evitara entrar a la pagina y querer hacer clicks para hacer cambios.
      //La UI no se presentara hasta que sepa el programa si puede editar.
      this.db.getEmployeeEditing(this.profile.mail ?? '').subscribe(resp =>{
        this.allowEditing = resp
        if(!this.allowEditing){
          this.router.navigateByUrl('/home/employee_home')
        }
        else{
          this.db.getEmployeeTeam(this.profile.mail ?? '').subscribe(resp => {
            console.log(resp)
            this.displayTeam = this.mergeTeams(resp, this.displayTeam ?? [], merge)
            for(let i in this.displayTeam){
              if(this.displayTeam[i].Check1 == null){
                this.displayTeam[i].Check1 = true
              }
            }
            this.loadingScreen = false
          })
        }
      })
    })
  }

  mergeTeams(newTeam: Array<DbUserTeam360>, currentTeam: Array<DbUserTeam360>, merge: boolean): Array<DbUserTeam360>{
    if(merge){
      if(currentTeam.length > 0){
        var localMessages: Array<messages> = []
        for(var i in currentTeam){
          if(currentTeam[i].Reason != ''){
            var newMessage: messages = {
              message: currentTeam[i].Reason ?? '',
              partner: currentTeam[i].PartnerID ?? 0,
              evalType: currentTeam[i].EvalType ?? 0
            }
            localMessages.push(newMessage)
          }
        }

        for(var i in newTeam){
          if(localMessages.length > 0){
            for(var j in localMessages){
              if(newTeam[i].PartnerID == localMessages[j].partner && newTeam[i].EvalType == localMessages[j].evalType){
                newTeam[i].Reason = localMessages[i].message
                newTeam[i].Check1 = false
                delete localMessages[j]
              }
            }
          }
        }
      }
    }

    return newTeam
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe()
  }

  postEmployeeChanges(){
    this.db.postEmployeeTeam360(this.displayTeam ?? [], 0).subscribe(resp => {
      this.router.navigateByUrl('/home/employee_home')
    })
  }

  




}
