import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import { EventMessage, EventType, InteractionStatus } from '@azure/msal-browser';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { User, Team360 } from 'src/app/models/userModels';
import { DataSharingService } from 'src/app/services/dataManagement/data-sharing.service';
import { Router } from '@angular/router';

import * as e from 'express';
import { DbUserTeam360 } from 'src/app/models/db-user';

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
export class EmployeeRequestComponent implements OnInit {

  profile!: ProfileType;
  loginDisplay = false;

  displayTeam?: Array<DbUserTeam360>;


  //Data Sharing Service
  subscription?: Subscription;

  //Checkbox
  itemCheckbox: Array<boolean> = [true, true, true]

  constructor(
    private http: HttpClient, 
    private authService: MsalService, 
    private msalBroadcastService: MsalBroadcastService,
    private data: DataSharingService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.msalBroadcastService.msalSubject$
      .pipe(
        filter((msg: EventMessage) => msg.eventType === EventType.LOGIN_SUCCESS),
      )
      .subscribe((result: EventMessage) => {
        console.log(result);
      });

    this.msalBroadcastService.inProgress$
      .pipe(
        filter((status: InteractionStatus) => status === InteractionStatus.None)
      )
      .subscribe(() => {
        this.setLoginDisplay();
      })
    this.getProfile();


    //Carga la informacion
    //this.subscription = this.data.currentTeams.subscribe(message => this.displayTeam = message)
    
    this.displayTeam = this.loadTemporaryData()

  }

  setLoginDisplay() {
    this.subscription?.unsubscribe();
    this.loginDisplay = this.authService.instance.getAllAccounts().length > 0;
  }

  getProfile(){
    this.http.get(GRAPH_ENDPOINT)
      .subscribe(profile =>{
        this.profile = profile;
        console.log(profile);
      });
  }

  getImage(){
    this.http.get(GRAPH_ENDPOINTPHOTO)
      .subscribe(photo =>{
        console.log(photo);
      })
  }

  printData(){
    console.log(this.displayTeam)
  }


  loadTemporaryData(): Array<DbUserTeam360>{

    var user1: DbUserTeam360 = {
      ID: 0,
      name: 'Christian',
      Check1: true,
      Check2: false,
      hours: 30,
      TipoEval: 0
    }

    var user2: DbUserTeam360 = {
      ID: 0,
      name: 'Pedro',
      Check1: true,
      Check2: false,
      hours: 30,
      TipoEval: 1
    }

    var user3: DbUserTeam360 = {
      ID: 0,
      name: 'Jorge',
      Check1: true,
      Check2: false,
      hours: 30,
      TipoEval: 2
    }

    var user4: DbUserTeam360 = {
      ID: 0,
      name: 'Silver',
      Check1: true,
      Check2: false,
      hours: 30,
      TipoEval: 0
    }


    var newDisplay: Array<DbUserTeam360> = [user1, user2, user3, user4]

    return newDisplay
  }


}
