import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';

//Superusuario


//Recursos humanos


//Empleado
import { EmployeeHomeComponent } from './components/employee/employee-home/employee-home.component';
import { EmployeeDetailsComponent } from './components/employee/employee-details/employee-details.component';
import { EmployeeRequestComponent } from './components/employee/employee-request/employee-request.component';

//Shared
import { SidebarComponent } from './components/shared/sidebar/sidebar.component';

const routes: Routes = [
  
  
  {
    path: 'employee_details',
    component: EmployeeDetailsComponent,
    canActivate: [MsalGuard]
  },
  {
    path: 'home',
    component: SidebarComponent,
    canActivate: [MsalGuard],
    children:[
      {
        path: 'employee_home', 
        component: EmployeeHomeComponent,
        canActivate: [MsalGuard]
      },
      {
        path: 'request',
        component: EmployeeRequestComponent,
        canActivate: [MsalGuard]
      }
    ]
  }
]

const isIFrame = window !== window.parent && !window.opener;

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes, {
      initialNavigation: !isIFrame ? 'enabled' : 'disabled'
    })],
  exports: [RouterModule]
})
export class AppRoutingModule { }

