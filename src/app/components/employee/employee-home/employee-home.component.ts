import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import { EventMessage, EventType, InteractionStatus } from '@azure/msal-browser';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { DataSharingService } from 'src/app/services/dataManagement/data-sharing.service';
import { Router } from '@angular/router';
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
  selector: 'app-employee-home',
  templateUrl: './employee-home.component.html',
  styleUrls: ['./employee-home.component.css']
})
export class EmployeeHomeComponent implements OnInit, OnDestroy {

  profile!: ProfileType;
  loginDisplay = false;

  displayTeam?: Array<DbUserTeam360>;



  //Data Sharing Service
  subscription?: Subscription;

  constructor(
    private http: HttpClient, 
    private msalBroadcastService: MsalBroadcastService,
    private data: DataSharingService,
    private router: Router
    ) { }

  ngOnInit(): void {

    this.msalBroadcastService.msalSubject$
      .pipe(
        filter((msg: EventMessage) => msg.eventType === EventType.LOGIN_SUCCESS),
      )
      .subscribe((result: EventMessage) => {
        //console.log(result);
      });

    this.getProfile();

    //Carga la informacion
    this.subscription = this.data.currentUserTeams.subscribe(message => this.displayTeam = message)


  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe()
  }

  getProfile(){
    this.http.get(GRAPH_ENDPOINT)
      .subscribe(profile =>{
        this.profile = profile;
      });
  }

  getImage(){
    this.http.get(GRAPH_ENDPOINTPHOTO)
      .subscribe(photo =>{
        console.log(photo);
      })
  }

  displayRequest(){
    this.router.navigateByUrl('/home/request')
  }
  
}
