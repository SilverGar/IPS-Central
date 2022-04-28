import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DbUserTeam360 } from 'src/app/models/db-user';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { DataSharingService } from './data-sharing.service';
import { map } from 'rxjs';
import { newArray } from '@angular/compiler/src/util';


@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor(
    private http: HttpClient
  ) { }

  getEmployeeTeam(user: number){
    var URL = `http://localhost:4000/api/user_getTeam/` + user
    return this.http.get<Array<DbUserTeam360>>(URL)
    .pipe(
      map(resp => {
        return resp
      })
    )
  }

}
