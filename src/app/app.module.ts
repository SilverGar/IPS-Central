import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http"; // Import 
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SidebarComponent } from './components/shared/sidebar/sidebar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import { MsalModule, MsalGuard, MsalInterceptor } from '@azure/msal-angular'; // Import MsalInterceptor
import { InteractionType, PublicClientApplication } from '@azure/msal-browser';
import { EmployeeDetailsComponent } from './components/employee/employee-details/employee-details.component';
import { EmployeeHomeComponent } from './components/employee/employee-home/employee-home.component';
import { HrDashboardComponent } from './components/humanresources/hr-dashboard/hr-dashboard.component';
import { HrNotificationsComponent } from './components/humanresources/hr-notifications/hr-notifications.component';
import { SuperuserHomeComponent } from './components/superuser/superuser-home/superuser-home.component';
import { SuperuserLoadFileComponent } from './components/superuser/superuser-load-file/superuser-load-file.component';
import { SignInComponent } from './components/shared/sign-in/sign-in.component';
import { MANAGEUSERSComponent } from './components/superuser/manage-users/manage-users.component';
import { EmployeeRequestComponent } from './components/employee/employee-request/employee-request.component';
import { ProgressBarComponent } from './components/shared/progress-bar/progress-bar.component';
import { EmployeeNotificationsComponent } from './components/employee/employee-notifications/employee-notifications.component';
import { SidebarHumanresourcesComponent } from './components/shared/sidebar-humanresources/sidebar-humanresources.component';
import { SidebarSuperuserComponent } from './components/shared/sidebar-superuser/sidebar-superuser.component';
import { ConfirmationDialogLogoutComponent } from './components/shared/ui/confirmation-dialog-logout/confirmation-dialog-logout.component';
import { LoadInfoComponent } from './components/superuser/load-info/load-info.component';
import { InvalidUserComponent } from './components/shared/invalid-user/invalid-user.component';
import { HrApproveteamsComponent } from './components/humanresources/hr-approveteams/hr-approveteams.component';

import { MatDialogModule } from '@angular/material/dialog';
import { PopUpLoadInfoComponent } from './components/superuser/pop-up-load-info/pop-up-load-info.component';
import { PopUpAddUserComponent } from './components/superuser/pop-up-add-user/pop-up-add-user.component';
import { SuperuserVisualizeTeamsComponent } from './components/superuser/superuser-visualize-teams/superuser-visualize-teams.component';
import { PopUpConfirmTeamComponent } from './components/employee/pop-up-confirm-team/pop-up-confirm-team.component';
import { HrPopUpConflictComponent } from './components/humanresources/hr-pop-up-conflict/hr-pop-up-conflict.component';

const isIE = window.navigator.userAgent.indexOf('MSIE ') > -1 || window.navigator.userAgent.indexOf('Trident/') > -1;


@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    EmployeeDetailsComponent,
    EmployeeHomeComponent,
    HrDashboardComponent,
    HrNotificationsComponent,
    SuperuserHomeComponent,
    SuperuserLoadFileComponent,
    SignInComponent,
    MANAGEUSERSComponent,
    EmployeeRequestComponent,
    ProgressBarComponent,
    EmployeeNotificationsComponent,
    SidebarHumanresourcesComponent,
    SidebarSuperuserComponent,
    ConfirmationDialogLogoutComponent,
    InvalidUserComponent,
    LoadInfoComponent,
    HrApproveteamsComponent,
    PopUpLoadInfoComponent,
    PopUpAddUserComponent,
    SuperuserVisualizeTeamsComponent,
    PopUpConfirmTeamComponent,
    HrPopUpConflictComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MatButtonModule,
    MatToolbarModule,
    MatListModule,
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MsalModule.forRoot(new PublicClientApplication({
      auth: {
        //clientId: '01f29e73-b3dc-4096-9f42-51fed93bedc5',
        clientId: 'cba815b2-a711-4989-b197-d77ffd118ba6',
        authority: 'https://login.microsoftonline.com/c65a3ea6-0f7c-400b-8934-5a6dc1705645',
        redirectUri: 'http://localhost:4200',
      },
      cache: {
        cacheLocation: 'localStorage',
        storeAuthStateInCookie: isIE,
      }
    }), {
      interactionType: InteractionType.Redirect,
      authRequest: {
        scopes: ['user.read']
      }
    }, {
      interactionType: InteractionType.Redirect, // MSAL Interceptor Configuration
      protectedResourceMap: new Map([
        ['https://graph.microsoft.com/v1.0/me', ['User.Read']]
      ])
    })
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true
    },
    MsalGuard
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    PopUpLoadInfoComponent,
    PopUpAddUserComponent,
    PopUpConfirmTeamComponent
  ]
})
export class AppModule { }
