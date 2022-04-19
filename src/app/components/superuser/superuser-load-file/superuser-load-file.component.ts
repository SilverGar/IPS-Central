import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgxCsvParser, NgxCSVParserError } from 'ngx-csv-parser';
import { import_user } from 'src/app/models/import_user';

@Component({
  selector: 'app-superuser-load-file',
  templateUrl: './superuser-load-file.component.html',
  styleUrls: ['./superuser-load-file.component.css']
})
export class SuperuserLoadFileComponent implements OnInit {

  csvRecords: any;
  userInput: Array<Array<string>> = [[]]
  header: boolean = false;


  currentLead: string = ""
  allUsers: import_user[] = []


  constructor(
    private ngxCsvParser: NgxCsvParser
  ) { }

  @ViewChild('fileImportInput') fileImportInput: any;

  fileChangeListener($event: any): void{
    const files = $event.srcElement.files;
    this.header = (this.header as unknown as string) === 'true' || this.header === true;
    this.ngxCsvParser.parse(files[0], {header: this.header, delimiter: ','})
    .pipe().subscribe({
      next: (result): void =>{
        //console.log('Result', result);
        this.csvRecords = result
        try{
          this.userInput = this.csvRecords
          this.createUser(this.userInput)
        }
        catch{
          console.log("Archivo no valido")
        }
        
      },
      error: (error: NgxCSVParserError): void =>{
        console.log('Error', error)
      }
    })
  }

  createUser(input: Array<Array<string>>){
   
    var currentID: number = 0
    var newID: number = 0
    for(var index in input){
      //Excluye primeras dos filas
      if(index > '2'){
        //Excluye la fila que tenga nombre "Totals"
        if(input[index][3] != 'Totals'){

          var newUser: import_user = {
            ID: -1,
            userName: "",
            project: "",
            projectLead: "",
            clientname: "",
            hours: 0
          }

          var totalHours: number = 0
          

          newID = this.getNewID(input[index][3], currentID)
          if(newID > currentID){
            currentID = newID
          }
          newUser.ID = newID
          newUser.clientname = input[index][0]
          newUser.project = input[index][1]
          newUser.projectLead = this.currentLead
          newUser.userName = input[index][3]
          for(var indexHours in input[index]){
            if(indexHours > '3'){
              if(input[index][indexHours] != '-'){
                totalHours = totalHours + parseFloat(input[index][indexHours])
              }
            }
          }
          newUser.hours = totalHours
          this.allUsers.push(newUser)
        }
        else{
          this.currentLead = input[index][2]
        }
      }
    }
    
    for(var index in this.allUsers){
      console.log(this.allUsers[index])
    }

  }

  getNewID(name: string, newID: number): number{
    if(this.allUsers != null){
      for(var i in this.allUsers){
        if(this.allUsers[i].userName == name){
          //Si encuentra un nombre igual, regresa el mismo ID
          return this.allUsers[i].ID
        }
      }
      //Si es una nueva ID, regresa un ID nuevo
      return newID + 1
    }
    //Si la lista esta vacia, envia 1
    return 1
  }


  ngOnInit(): void {
    
  }





}
