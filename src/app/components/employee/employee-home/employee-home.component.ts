import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import { EventMessage, EventType, InteractionStatus } from '@azure/msal-browser';
import { filter } from 'rxjs/operators';
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
export class EmployeeHomeComponent implements OnInit {

  profile!: ProfileType;
  loginDisplay = false;
  constructor(private http: HttpClient, private authService: MsalService, private msalBroadcastService: MsalBroadcastService) { }

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
  }

  setLoginDisplay() {
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

  logout() { // Add log out function here
    this.authService.logoutPopup({
      mainWindowRedirectUri: "/"
    });
  }

}
