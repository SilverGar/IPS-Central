import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';

//Superusuario


//Recursos humanos


//Empleado
import { EmployeeHomeComponent } from './components/employee/employee-home/employee-home.component';
import { EmployeeDetailsComponent } from './components/employee/employee-details/employee-details.component';

//Shared
import { SidebarComponent } from './components/shared/sidebar/sidebar.component';

const routes: Routes = [
  
  {
    path: 'employee_home', 
    component: EmployeeHomeComponent,
    canActivate: [MsalGuard]
  },
  {
    path: 'employee_details',
    component: EmployeeDetailsComponent,
    canActivate: [MsalGuard]
  },
  {
    path: 'sidebar',
    component: SidebarComponent,
    canActivate: [MsalGuard]
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

