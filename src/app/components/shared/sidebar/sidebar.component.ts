import { OnDestroy } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import * as e from 'express';
import { Subscription } from 'rxjs';
import { DataSharingService } from 'src/app/services/dataManagement/data-sharing.service';
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
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit, OnDestroy {
  profile!: ProfileType
  imageSrc = 'https://yt3.ggpht.com/a/AGF-l79b_9Tw9iTZ9nM_qOeACpuCz3kUc1EWEsgKUQ=s900-mo-c-c0xffffffff-rj-k-no'  
  imageAlt = 'Inflection Point'


  isMenuOpened: boolean = false;

  subscription?: Subscription
  currentUpdateStatus: number = 0
  currentReleasedStatus: number = -1



  constructor(
    private msSignIn: MsSignInService,
    private dataSharingService: DataSharingService,
    private db: DatabaseService
  ) { }

  ngOnInit(): void {
    this.msSignIn.getProfile().subscribe(resp => {
      this.profile = resp
      if(this.profile != null){
        this.subscription = this.dataSharingService.currentUpdate.subscribe(resp => {
          this.currentUpdateStatus = resp
        })
      }
    })
    this.getReleasedStatus()
    this.msSignIn.verifyPage(0);
  }
  


  async fetchUpdate(){
    //Que tan frecuente tiene que ver la base de datos por actualizaciones.
    await this.delay(5000)
    this.db.getEmployeeUpdate(this.profile.mail ?? '').subscribe(resp => {
      if(resp != 0){
        this.dataSharingService.changeUpdateStatus(resp)
        this.db.getReceivedUpdate(this.profile.mail ?? '').subscribe(resp =>{
          console.log("Actualizacion recibida.")
          this.dataSharingService.changeUpdateStatus(resp)
        })
      }
      else{
        console.log("Sin actualizacion")
      }
    })
    
    this.fetchUpdate()
  }

  getReleasedStatus(){
    this.db.getReleasedStatus().subscribe(resp =>{
      this.currentReleasedStatus = resp
      if(resp == 1){
        this.fetchUpdate()
      }
    })
  }

  delay(ms: number){
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  toggleMenu(): void{
    this.isMenuOpened = !this.isMenuOpened;
  }

  clickedOutside(): void{
    this.isMenuOpened = false;
  }


  ngOnDestroy(): void {
    this.subscription?.unsubscribe()
  }

  

  logout() { // Add log out function here
    this.msSignIn.logout()
  }
}
