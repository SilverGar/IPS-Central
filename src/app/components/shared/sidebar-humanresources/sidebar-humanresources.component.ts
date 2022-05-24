import { Component, OnInit } from '@angular/core';
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
  selector: 'app-sidebar-humanresources',
  templateUrl: './sidebar-humanresources.component.html',
  styleUrls: ['./sidebar-humanresources.component.css']
})
export class SidebarHumanresourcesComponent implements OnInit {

  profile!: ProfileType
  imageSrc = 'https://yt3.ggpht.com/a/AGF-l79b_9Tw9iTZ9nM_qOeACpuCz3kUc1EWEsgKUQ=s900-mo-c-c0xffffffff-rj-k-no'  
  imageAlt = 'Inflection Point'


  isMenuOpened: boolean = false;

  currentReleasedStatus: number = -1
  currentUpdateStatus: number = 0
  subscription?: Subscription

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
    this.msSignIn.verifyPage(1);
  }
  
  toggleMenu(): void{
    this.isMenuOpened = !this.isMenuOpened;
  }

  clickedOutside(): void{
    this.isMenuOpened = false;
  }

  async fetchUpdate(){
    //Que tan frecuente tiene que ver la base de datos por actualizaciones.
    await this.delay(5000)
    this.db.getEmployeeUpdate(this.profile.mail ?? '').subscribe(resp => {
      if(resp != 0){
        this.dataSharingService.changeUpdateStatus(resp)
        this.db.getReceivedUpdate(this.profile.mail ?? '').subscribe(resp =>{
          this.dataSharingService.changeUpdateStatus(resp)
        })
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

  logout() { // Add log out function here
    this.msSignIn.logout()
  }
}
