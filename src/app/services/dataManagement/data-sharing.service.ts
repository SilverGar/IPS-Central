import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Team360 } from 'src/app/models/userModels';

@Injectable({
  providedIn: 'root'
})
export class DataSharingService {
  private messageSource = new BehaviorSubject('Default Message');
  currentMessage = this.messageSource.asObservable();

  initTeams: Team360 = {} as Team360;
  private generatedTeams = new BehaviorSubject<Team360>(this.initTeams)
  currentTeams = this.generatedTeams.asObservable();
  

  constructor() { }

  changeMessage(message: string){
    this.messageSource.next(message)
  }

  changeLocalTeam(message: Team360){
    this.generatedTeams.next(message)
  }
}
