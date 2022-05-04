import { HttpClient } from '@angular/common/http';
import { HttpParams, HttpRequest, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DbUserTeam360, UserType } from 'src/app/models/db-user';
import { map } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor(
    private http: HttpClient
  ) { }

  
  //SUPERUSUARIO
  getUserType(email: string){
    var URL = `http://localhost:4000/api/user_getType/` + email
    return this.http.get<Array<UserType>>(URL)
    .pipe(
      map(resp => {
        return resp
      })
    )
  }

  processFile(file: File){
    console.log(file)
    
    let formData = new FormData()
    formData.append('file', file)
    let params = new HttpParams()
    const options = {
      params: params
    }

    var URL = `http://localhost:4000/api/processFile`
    const req = new HttpRequest('POST', URL, formData, options)
    return this.http.request(req)
    // return this.http.post<any>(URL, file)
    // .pipe(
    //   map(resp => {
    //     console.log(resp)
    //     return resp;
    //   })
    // )
  }


  //EMPLEADOS

  getEmployeeEditing(email: string){
    var URL = `http://localhost:4000/api/getEmployeeEditing/` + email
    return this.http.get<boolean>(URL)
    .pipe(
      map(resp => {
        return resp
      })
    )
  }

  getEmployeeTeam(email: string){
    var URL = `http://localhost:4000/api/user_getTeam/` + email
    return this.http.get<Array<DbUserTeam360>>(URL)
    .pipe(
      map(resp => {
        return resp
      })
    )
  }

  postEmployeeTeam360(input: Array<DbUserTeam360>, publish: number){
    var URL = `http://localhost:4000/api/postEmployeeTeam360/` + publish
    return this.http.post<any>(URL, input).pipe(
      map(resp => {
        console.log(resp)
        return resp
      })
    )
  }



}
