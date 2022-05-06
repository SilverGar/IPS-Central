import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { DbUserTeam360 } from 'src/app/models/db-user';

//BASE DE DATOS
import { DatabaseService } from 'src/app/services/dataManagement/database.service';
import { MsSignInService } from 'src/app/services/ms-sign-in.service';

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

  imagePath: string = ""
  textStatus: string = ""


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
    this.loadData()
    
  }

  loadData(){
    this.msSignIn.getProfile().subscribe(resp => {
      this.profile = resp

      //Obtenemos el equipo360 de la base de datos
      this.db.getEmployeeTeam(resp.mail ?? '').subscribe(resp => {
        this.displayTeam = resp
        var rhApproved = true
        for(var i in this.displayTeam){
          if(!this.displayTeam[i].Approved || this.displayTeam[i].Approved == null){
            rhApproved = false
          }
          if(this.displayTeam[i].Check1 == null){
            this.displayTeam[i].Check1 = true
          }
        }
        //Si ya confirmo su equipo, no puede realizar mas cambios y no se presentan los botones.
        this.db.getEmployeeEditing(this.profile.mail ?? '').subscribe(resp =>{
          this.allowEditing = resp
          this.loadingScreen = false
          if(!rhApproved){
            if(this.allowEditing){
              this.imagePath = "warningIcon.png"
              this.textStatus = "Todavia no has confirmado tu equipo."
            }
            else{
              this.imagePath = "confirmedIcon.png"
              this.textStatus = "Ya confirmaste tu equipo. Espera a que recursos humanos revise tu equipo."
            }
          }
          else{
            this.imagePath = "approvedTeamIcon.png"
            this.textStatus = "Ya puedes empezar tu Evaluación360."
          }
          
      })
        
        
      })

      
    })
  }
   
  confirmTeam(){
    this.db.postEmployeeTeam360(this.displayTeam ?? [], 1).subscribe(resp => {
      this.db.getEmployeeEditing(this.profile.mail ?? '').subscribe(resp => {
        this.allowEditing = false
        this.loadData()
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
