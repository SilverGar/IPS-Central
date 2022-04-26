import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DbUserTeam360 } from 'src/app/models/db-user';
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

  initDataTeams: Array<DbUserTeam360> = []
  private databaseUserTeams = new BehaviorSubject<Array<DbUserTeam360>>(this.loadTemporalData())
  currentUserTeams = this.databaseUserTeams.asObservable()


  constructor() { }

  changeMessage(message: string){
    this.messageSource.next(message)
  }

  changeLocalTeam(message: Team360){
    this.generatedTeams.next(message)
  }

  changeUserTeam(message: Array<DbUserTeam360>){
    this.databaseUserTeams.next(message)
  }

  loadTemporalData(): Array<DbUserTeam360>{
    var user1: DbUserTeam360 = {
      ID: 0,
      name: 'Christian',
      Check1: true,
      Check2: false,
      hours: 30,
      TipoEval: 0
    }

    var user2: DbUserTeam360 = {
      ID: 0,
      name: 'Pedro',
      Check1: true,
      Check2: false,
      hours: 30,
      TipoEval: 1
    }

    var user3: DbUserTeam360 = {
      ID: 0,
      name: 'Jorge',
      Check1: true,
      Check2: false,
      hours: 30,
      TipoEval: 2
    }

    var user4: DbUserTeam360 = {
      ID: 0,
      name: 'Silver',
      Check1: true,
      Check2: false,
      hours: 30,
      TipoEval: 0
    }


    var newDisplay: Array<DbUserTeam360> = [user1, user2, user3, user4]
    return newDisplay
  }
}
