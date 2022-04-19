import { Injectable } from '@angular/core';
import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { MsalService, MsalBroadcastService, MSAL_GUARD_CONFIG, MsalGuardConfiguration } from '@azure/msal-angular';
import { InteractionStatus, PopupRequest } from '@azure/msal-browser';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators'

import { Router as Router2 } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class MsSignInService {

  isIframe = false;
  loginDisplay = false;
  private readonly _destroying$ = new Subject<void>();


  constructor(@Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration, private broadcastService: MsalBroadcastService, private authService: MsalService, private router: Router2) {}

  ngOnInit(): void {
    this.isIframe = window !== window.parent && !window.opener;

    this.broadcastService.inProgress$
    .pipe(
      filter((status: InteractionStatus) => status === InteractionStatus.None),
      takeUntil(this._destroying$)
    )
    .subscribe(() => {
      this.setLoginDisplay();
    })
  }

  login(){
    if(this.msalGuardConfig.authRequest){
      //this.router.navigate(['./employee_details'])
      this.authService.loginPopup({...this.msalGuardConfig.authRequest} as PopupRequest)
      .subscribe({
        next: (result) => {
          console.log(result);
          return true;
        },
        error: (error) => {
          console.log(error)
          return false;
        }
      });
    }
    return false;
  }

  logout() { // Add log out function here
    this.authService.logoutPopup({
      mainWindowRedirectUri: "/"
    });
  }

  setLoginDisplay() {
    this.loginDisplay = this.authService.instance.getAllAccounts().length > 0;
  }

  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }
}
