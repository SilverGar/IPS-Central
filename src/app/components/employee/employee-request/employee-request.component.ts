import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MsalBroadcastService } from '@azure/msal-angular';
import { EventMessage, EventType } from '@azure/msal-browser';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { DataSharingService } from 'src/app/services/dataManagement/data-sharing.service';

import * as e from 'express';
import { DbUserTeam360 } from 'src/app/models/db-user';
import { DatabaseService } from 'src/app/services/dataManagement/database.service';
import { MsSignInService } from 'src/app/services/ms-sign-in.service';
import { Router } from '@angular/router';



const GRAPH_ENDPOINT = 'https://graph.microsoft.com/v1.0/me';
const GRAPH_ENDPOINTPHOTO = 'https://graph.microsoft.com/v1.0/me/photo/$value';

type ProfileType = {
  givenName?: string;
  surname?: string,
  userPrincipalName?: string,
  id?: string
};

@Component({
  selector: 'app-employee-request',
  templateUrl: './employee-request.component.html',
  styleUrls: ['./employee-request.component.css']
})
export class EmployeeRequestComponent implements OnInit, OnDestroy {

  profile!: ProfileType;
  displayTeam?: Array<DbUserTeam360>;


  //Data Sharing Service
  subscription?: Subscription;

  allowEditing: boolean = false
  loadingScreen: boolean = true

  constructor(
    private http: HttpClient, 
    private msalBroadcastService: MsalBroadcastService,
    private router: Router,
    private db: DatabaseService,
    private msSignIn: MsSignInService
  ) { }

  ngOnInit(): void {
    this.msalBroadcastService.msalSubject$
      .pipe(
        filter((msg: EventMessage) => msg.eventType === EventType.LOGIN_SUCCESS),
      )
      .subscribe((result: EventMessage) => {
        //console.log(result);
      });

    this.msSignIn.getProfile().subscribe(resp => {
      this.profile = resp
      this.db.getEmployeeTeam(resp.mail ?? '').subscribe(resp => {
        this.displayTeam = resp;
        console.log(resp)
        for(let i in this.displayTeam){
          if(this.displayTeam[i].Check1 == null){
            this.displayTeam[i].Check1 = true
          }
        }
      })

      //Si ya confirmo su equipo, no se desplegara la informacion. Esto evitara entrar a la pagina y querer hacer clicks para hacer cambios.
      //La UI no se presentara hasta que sepa el programa si puede editar.
      this.db.getEmployeeEditing(resp.mail ?? '').subscribe(resp =>{
        this.allowEditing = resp
        if(!this.allowEditing){
          this.router.navigateByUrl('/home/employee_home')
        }
        else{
          this.loadingScreen = false
        }
      })
    })

    //Carga la informacion [Con DataSharingService]
    //this.subscription = this.data.currentUserTeams.subscribe(message => this.displayTeam = message)

    //Carga la informacion [Con Base de Datos directo]
    
  }

  postEmployeeChanges(){
    this.db.postEmployeeTeam360(this.displayTeam ?? [], 0).subscribe(resp => {
      this.router.navigateByUrl('/home/employee_home')
    })
  }
  

  ngOnDestroy(): void {
    this.subscription?.unsubscribe()
  }


  // getProfile(){
  //   this.http.get(GRAPH_ENDPOINT)
  //     .subscribe(profile =>{
  //       this.profile = profile;
  //     });
  // }
}
