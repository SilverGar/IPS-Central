import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DbUserTeam360, UserType, ManageUsers } from 'src/app/models/db-user';
import { map } from 'rxjs';
import { response } from 'express';


@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor(
    private http: HttpClient
  ) { }

  getEmployeeTeam(email: string) {
    var URL = `http://localhost:4000/api/user_getTeam/` + email
    return this.http.get<Array<DbUserTeam360>>(URL)
      .pipe(
        map(resp => {
          return resp
        })
      )
  }

  getUserType(email: string) {
    var URL = `http://localhost:4000/api/user_getType/` + email
    return this.http.get<Array<UserType>>(URL)
      .pipe(
        map(resp => {
          return resp
        })
      )
  }

  getEmployeeEditing(email: string) {
    var URL = `http://localhost:4000/api/getEmployeeEditing/` + email
    return this.http.get<boolean>(URL)
      .pipe(
        map(resp => {
          return resp
        })
      )
  }

  postEmployeeTeam360(input: Array<DbUserTeam360>, publish: number) {
    var URL = `http://localhost:4000/api/postEmployeeTeam360/` + publish;
    return this.http.post<any>(URL, input).pipe(
      map(resp => {
        console.log(resp)
        return resp
      })
    )
  }

  getUsers() {
    var URL = `http://localhost:4000/api/user_getUsers`;
    return this.http.get<Array<ManageUsers>>(URL).pipe(
      map(resp => {
        console.log(resp);
        return resp;
      })
    )
  }

}
