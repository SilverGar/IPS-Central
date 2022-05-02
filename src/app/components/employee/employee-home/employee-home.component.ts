import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import { EventMessage, EventType, InteractionStatus } from '@azure/msal-browser';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { DataSharingService } from 'src/app/services/dataManagement/data-sharing.service';
import { Router } from '@angular/router';
import { DbUserTeam360 } from 'src/app/models/db-user';

//BASE DE DATOS
import { DatabaseService } from 'src/app/services/dataManagement/database.service';
import { MsSignInService } from 'src/app/services/ms-sign-in.service';

const GRAPH_ENDPOINT = 'https://graph.microsoft.com/v1.0/me';
const GRAPH_ENDPOINTPHOTO = 'https://graph.microsoft.com/v1.0/me/photo/$value';

type ProfileType = {
  givenName?: string;
  surname?: string,
  userPrincipalName?: string,
  id?: string,
  mail?: string
};
@Component({
  selector: 'app-employee-home',
  templateUrl: './employee-home.component.html',
  styleUrls: ['./employee-home.component.css']
})
export class EmployeeHomeComponent implements OnInit, OnDestroy {

  profile!: ProfileType;
  allowEditing: Boolean = false

  displayTeam?: Array<DbUserTeam360>;
  loadingScreen: boolean = true



  //Data Sharing Service
  subscription?: Subscription;

  constructor(
    private router: Router,
    private db: DatabaseService,
    private msSignIn: MsSignInService
    ) { }

  ngOnInit(): void {

    //Obtenemos el perfil de Microsoft, con esto obtenemos el Correo, con el cual cuando se obtiene una respuesta
    //se llama a la funcion this.db.getEmployeeTeam(), esto obtiene el equipo 360 del empleado con el correo correspondiente.
    this.msSignIn.getProfile().subscribe(resp => {
      this.profile = resp

      //Obtenemos el equipo360 de la base de datos
      this.db.getEmployeeTeam(resp.mail ?? '').subscribe(resp => {
        this.displayTeam = resp
      })

      //Si ya confirmo su equipo, no puede realizar mas cambios y no se presentan los botones.
      this.db.getEmployeeEditing(resp.mail ?? '').subscribe(resp =>{
          this.allowEditing = resp
          this.loadingScreen = false
      })
    })
  }

  confirmTeam(){
    this.db.postEmployeeTeam360(this.displayTeam ?? [], 1).subscribe(resp => {
      this.db.getEmployeeEditing(this.profile.mail ?? '').subscribe(resp => {
        this.allowEditing = resp
      })
    })
    
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe()
  }


  displayRequest(){
    this.router.navigateByUrl('/home/request')
  }
  
}
