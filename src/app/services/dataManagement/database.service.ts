import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DbUserTeam360 } from 'src/app/models/db-user';
import { map } from 'rxjs';


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