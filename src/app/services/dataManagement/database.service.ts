import { HttpClient } from '@angular/common/http';
import { HttpParams, HttpRequest, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DbUserTeam360, UserType, User, ManageUsers, Complete_Team360, getConflictData, dbConflictData } from 'src/app/models/db-user';
import { map } from 'rxjs';
import { response } from 'express';


@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor(
    private http: HttpClient
  ) { }


  //SUPERUSUARIO
  getUserType(email: string) {
    var URL = `http://localhost:4000/api/user_getType/` + email
    return this.http.get<Array<UserType>>(URL)
      .pipe(
        map(resp => {
          return resp
        })
      )
  }

  processFile(file: File) {
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
  }

  getProccessProgress(){
    var URL = `http://localhost:4000/api/getUploadProgress`
    return this.http.get<number>(URL)
      .pipe(
        map(resp => {
          return resp
        })
      )
  }


  //EMPLEADOS

  getEmployeeEditing(email: string) {
    var URL = `http://localhost:4000/api/getEmployeeEditing/` + email
    return this.http.get<boolean>(URL)
      .pipe(
        map(resp => {
          return resp
        })
      )
  }

  getEmployeeTeam(email: string) {
    var URL = `http://localhost:4000/api/user_getTeam/` + email
    return this.http.get<Array<DbUserTeam360>>(URL)
      .pipe(
        map(resp => {
          return resp
        })
      )
  }

  postEmployeeTeam360(input: Array<DbUserTeam360>, publish: number) {
    var URL = `http://localhost:4000/api/postEmployeeTeam360/` + publish
    return this.http.post<any>(URL, input).pipe(
      map(resp => {
        console.log("Respuesta de cambios")
        console.log(resp)
        return resp
      })
    )
  }

  //RECURSOS HUMANOS
  getUsersSu() {
    var URL = `http://localhost:4000/api/user_getUsers`
    return this.http.get<Array<ManageUsers>>(URL)
      .pipe(
        map(resp => {
          return resp
        })
      )
  }

  getUsers() {
    var URL = `http://localhost:4000/api/hr/getUsers`
    return this.http.get<Array<User>>(URL)
      .pipe(
        map(resp => {
          return resp
        })
      )
  }

  getCompleteTeam360(email: string){
    var URL = `http://localhost:4000/api/hr/getCompleteTeam/` + email
    return this.http.get<Array<Complete_Team360>>(URL)
      .pipe(
        map(resp =>{
          return resp
        })
      )
  }

  getConflictData(input: getConflictData){
      var URL = `http://localhost:4000/api/hr/getConflictData`
      return this.http.post<dbConflictData>(URL, input)
			.pipe(
				map(resp =>{
						return resp
				})
			)
  }

  //GENERAL
  getEmployeeUpdate(email: string){
    var URL  = `http://localhost:4000/api/getAppUpdate/` + email
    return this.http.get<number>(URL)
      .pipe(
        map(resp =>{
          return resp
        })
      )
  } 

  getReceivedUpdate(email: string){
    var URL  = `http://localhost:4000/api/getAppReceivedUpdate/` + email
    return this.http.get<number>(URL)
      .pipe(
        map(resp =>{
          return resp
        })
      )
  } 

  getReleasedStatus(){
    var URL = `http://localhost:4000/api/getReleasedStatus`
    return this.http.get<number>(URL)
      .pipe(
        map(resp =>{
          return resp
        })
      )
  }


}
