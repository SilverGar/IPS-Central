import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SidebarComponent } from './components/shared/sidebar/sidebar.component';
import { HomeComponent } from './components/employee/home/home.component';
import { DetailsComponent } from './components/employee/details/details.component';
import { LoadFileComponent } from './components/superuser/load-file/load-file.component';
import { DashboardComponent } from './components/humanresources/dashboard/dashboard.component';
import { NotificationsComponent } from './components/humanresources/notifications/notifications.component';
import { SignInComponent } from './components/shared/sign-in/sign-in.component';

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    HomeComponent,
    DetailsComponent,
    LoadFileComponent,
    DashboardComponent,
    NotificationsComponent,
    SignInComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
