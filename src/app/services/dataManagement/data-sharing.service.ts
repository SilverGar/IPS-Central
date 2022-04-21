import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Team360 } from 'src/app/models/userModels';

@Injectable({
  providedIn: 'root'
})
export class DataSharingService {
  private messageSource = new BehaviorSubject('Default Message');
  currentMessage = this.messageSource.asObservable();

  private generatedTeams = new BehaviorSubject('')
  currentTeams = this.generatedTeams.asObservable();
  

  constructor() { }

  changeMessage(message: string){
    this.messageSource.next(message)
  }
}
