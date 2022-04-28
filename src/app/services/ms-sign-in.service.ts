import { Injectable } from '@angular/core';
import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { MsalService, MsalBroadcastService, MSAL_GUARD_CONFIG, MsalGuardConfiguration } from '@azure/msal-angular';
import { InteractionStatus, PopupRequest } from '@azure/msal-browser';
import { BehaviorSubject, Subject } from 'rxjs';
import { filter, map, takeUntil } from 'rxjs/operators'
import { Router as Router2 } from '@angular/router';
import { HttpClient } from '@angular/common/http';

const GRAPH_ENDPOINT = 'https://graph.microsoft.com/v1.0/me';
const GRAPH_ENDPOINTPHOTO = 'https://graph.microsoft.com/v1.0/me/photo/$value'
type ProfileType = {
  givenName?: string;
  surname?: string,
  userPrincipalName?: string,
  id?: string,
  mail?: string
};

@Injectable({
  providedIn: 'root'
})

export class MsSignInService {
  isIframe = false;
  loginDisplay = false;
  private readonly _destroying$ = new Subject<void>();
  profile!: ProfileType

  constructor(
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: 
    MsalGuardConfiguration, private broadcastService: MsalBroadcastService, 
    private authService: MsalService, 
    private router: Router2,
    private http: HttpClient) {}


  ngOnInit(): void {
    this.isIframe = window !== window.parent && !window.opener;

    this.setLoginDisplay()
    this.broadcastService.inProgress$
    .pipe(
      filter((status: InteractionStatus) => status === InteractionStatus.None),
      takeUntil(this._destroying$)
    )
    .subscribe(() => {
      this.setLoginDisplay();
    })
  }


  logout() {
    this.authService.logoutPopup({
      mainWindowRedirectUri: "/login"
    });
  }

  getProfile() {

    return this.http.get<ProfileType>(GRAPH_ENDPOINT)
      .pipe(
        map(resp => {
          return resp
        })
      )
  }

  setLoginDisplay(): boolean {
    return this.authService.instance.getAllAccounts().length > 0
  }

  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }
}
