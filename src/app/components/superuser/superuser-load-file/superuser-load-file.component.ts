import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Data } from '@angular/router';
import { error } from 'console';
import { NgxCsvParser, NgxCSVParserError } from 'ngx-csv-parser';
import { Subscription } from 'rxjs';
import { User, Regular_Team, Team360 } from 'src/app/models/userModels';
import { DataSharingService } from 'src/app/services/dataManagement/data-sharing.service';
import { DatabaseService } from 'src/app/services/dataManagement/database.service';

@Component({
  selector: 'app-superuser-load-file',
  templateUrl: './superuser-load-file.component.html',
  styleUrls: ['./superuser-load-file.component.css']
})
export class SuperuserLoadFileComponent implements OnInit, OnDestroy {

  //Read file CSV
  csvRecords: any;
  userInput: Array<Array<string>> = [[]]
  header: boolean = false;
  file: File = {} as File;


  //Create user variables
  allUsers: User[] = []
  temporalTeam360: Array<Team360> = []
  allTeam360: Array<Team360> = []

  //Sharing data between views
  message?: Team360;
  subscription?: Subscription;

  //Helps subscribing to the data
  ngOnInit(): void {
    this.subscription = this.data.currentTeams.subscribe(message => this.message = message)
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe()
  }

  constructor(
    private ngxCsvParser: NgxCsvParser,
    private data: DataSharingService, 
    private db: DatabaseService
  ) { }

  // @ViewChild('fileImportInput') fileImportInput: any;
  @ViewChild("fileDropRef", { static: false }) fileDropEl!: ElementRef;

  formatSize(size: number, decimal = 2){
    if(size === 0){
      return "0 bytes";
    }
    const k = 1024;
    const dm = decimal <= 0 ? 0 : decimal;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(size) / Math.log(k));
    return parseFloat((size / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

  fileBrowserHandler(file: any){
    this.progressDisplay(file);
  }
  
  progressBarSim(){
    setTimeout(() =>{
      const progressInterval = setInterval(() =>{
        if(this.csvRecords.progress === 100){
          clearInterval(progressInterval);
        }
        else{
          this.csvRecords.progress += 1;
        }
      }, 5);
    }, 1000);
  }

  progressDisplay(file: any){
    file.progress = 0;
    this.csvRecords = file;
    this.fileDropEl.nativeElement.value = "";
    this.progressBarSim();
  }

  fileChangeListener($event: any): void{
    const files = $event.srcElement.files;
    this.file = files[0];
    this.fileBrowserHandler(this.file);
    this.header = (this.header as unknown as string) === 'true' || this.header === true;

    //CARGAR ARCHIVO
    this.ngxCsvParser.parse(files[0], {header: this.header, delimiter: ','})
    .pipe().subscribe({
      next: (result): void =>{
        //console.log('Result', result);
        this.csvRecords = result
        try{
          this.userInput = this.csvRecords

          //Crea empleados en base al CSV
          this.allUsers = this.createUser(this.userInput)
          this.temporalTeam360 = this.getTeams(this.allUsers)
          this.allTeam360 = this.mergeTeams(this.temporalTeam360)

          //Guarda los equipos localmente
          this.data.changeLocalTeam(this.allTeam360[1])
          
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

  createData() {
    this.db.processFile(this.file).subscribe(resp =>{
      console.log(resp)
    })

    // PARSING!
    // this.ngxCsvParser.parse(this.file, {header: this.header, delimiter: ','})
    // .pipe().subscribe({
    //   next: (result): void =>{
    //     //console.log('Result', result);
    //     this.csvRecords = result
    //     try{
    //       this.userInput = this.csvRecords

    //       //Crea empleados en base al CSV
    //       this.allUsers = this.createUser(this.userInput)
    //       this.temporalTeam360 = this.getTeams(this.allUsers)
    //       this.allTeam360 = this.mergeTeams(this.temporalTeam360)

    //       //Guarda los equipos localmente
    //       this.data.changeLocalTeam(this.allTeam360[1])
          
    //     }
    //     catch{
    //       console.log("Archivo no valido")
    //     }
        
        
    //   },
    //   error: (error: NgxCSVParserError): void =>{
    //     console.log('Error', error)
    //   }
    // })
  }

  createUser(input: Array<Array<string>>): User[]{
    //console.log("Entradas: " + input.length)

    //Lista de todos los empleados, aunque esten duplicados. Si un usuario se repite, se le asigna la ID anterior que se hubiera generado.
    var newUserList: User[] = []

    //Obtiene el lider del empleado en el proyecto que este participando.
    var currentLead: string = ""

    //Lleva el conteo de la ID actual
    var currentID: number = 0

    //El ID que se ha generado y se asigna al usuario
    var newID: number = 0
    for(var index = 3; index < input.length; index++){

      //Excluye la fila que tenga nombre "Totals"
      if(input[index][3] != 'Totals'){
        //Obtiene una ID nueva en caso que el usuario no lo hubiera visto antes
        newID = this.getNewID(newUserList, input[index][3], currentID)
        if(newID > currentID){
          currentID = newID
        }

        //Establece como horas totales 0
        var totalHours: number = 0

        //Genera un nuevo usuario vacio
        var newUser: User = {
          ID: -1,
          userName: "",
          project: "",
          projectLead: "",
          clientname: "",
          hours: 0
        }
        newUser.ID = newID
        newUser.clientname = input[index][0]
        newUser.project = input[index][1]
        newUser.projectLead = currentLead
        newUser.userName = input[index][3]

        //Suma las horas del empleado en el proyecto que hubiera participado.
        for(var indexHours in input[index]){
          if(indexHours > '3'){
            if(input[index][indexHours] != '-'){
              totalHours = totalHours + parseFloat(input[index][indexHours])
            }
          }
        }

        newUser.hours = totalHours

        //El nuevo usuario se añade al array de todos los usuarios.
        newUserList.push(newUser)
      }
      else{
        currentLead = input[index][2]
      }
      
    }
    
    

    //console.log(newUserList.length)
    return newUserList

  }

  getNewID(input: Array<User>, name: string, newID: number): number{
    if(input != null){
      for(var i in input){
        if(input[i].userName == name){
          //Si encuentra un nombre igual, regresa el mismo ID
          return input[i].ID
        }
      }
      //Si es una nueva ID, regresa un ID nuevo
      return newID + 1
    }
    //Si la lista esta vacia, envia 1
    return 1
  }

  getTeams(input: Array<User>): Array<Team360>{
    //Se crean equipos normales [Proyecto -> Empleados involucrados]
    //Se crea para poder determinar que empleados trabajaron con otros en los proyectos.
    

    var currentTeam = input[0].project
    var currentID = -1
    var teamList: Array<Regular_Team> = []
    var currentMembers: Array<User> = []

    //Cicla por toda la longitud de la lista de empleados generados
    for(var i in input){
      if(currentTeam == input[i].project){
        currentMembers.push(input[i])
        if(parseInt(i) == (input.length - 1)){
          currentID = currentID + 1
        
          //Inicializa un equipo con los valores establecidos
          var newTeam: Regular_Team = {
            ID: -1,
            projectName: "",
            teamMembers: []
          }
          newTeam.ID = currentID
          newTeam.projectName = currentTeam
          newTeam.teamMembers = currentMembers
          teamList.push(newTeam)

          var emptyMembers: Array<User> = []
          currentMembers = emptyMembers
          


          currentMembers.push(input[i])
          currentTeam = input[i].project
          
        }
      }
      else{
        currentID = currentID + 1
        
        //Inicializa un equipo con los valores establecidos
        var newTeam: Regular_Team = {
          ID: -1,
          projectName: "",
          teamMembers: []
        }
        newTeam.ID = currentID
        newTeam.projectName = currentTeam
        newTeam.teamMembers = currentMembers
        teamList.push(newTeam)

        var emptyMembers: Array<User> = []
        currentMembers = emptyMembers
        


        currentMembers.push(input[i])
        currentTeam = input[i].project
      }
    }

    var newCompanions: Array<User> = []
    var finishedTeams: Array<Team360> = []
    currentID = -1

    for(var i in teamList){
      for(var j in teamList[i].teamMembers){
        newCompanions = []
        currentID = currentID + 1
        for(var k in teamList[i].teamMembers){
          if(teamList[i].teamMembers[j].ID != teamList[i].teamMembers[k].ID){
            //Añadir empleados que trabajaron juntos
            newCompanions.push(teamList[i].teamMembers[k])
          }
        }
        var newTeam360: Team360 = {
          ID: currentID,
          teamOwner: teamList[i].teamMembers[j],
          relationships: newCompanions
        }
        finishedTeams.push(newTeam360)
      }
    }

    
    return finishedTeams
  }

  mergeTeams(input: Array<Team360>): Array<Team360>{
    var mergedTeams: Array<Team360> = []
    var finishedMembers: Array<number> = []
    
    for(var i in input){
      if(finishedMembers.indexOf(input[i].teamOwner.ID) == -1){
        var newTeam: Team360 = {
          ID: -1,
          teamOwner: input[i].teamOwner,
          relationships: this.getUniqueRelations(input, input[i].teamOwner.ID)
        }
        mergedTeams.push(newTeam)
        finishedMembers.push(input[i].teamOwner.ID)
      }
      else{
        console.log("Ya termine con ese")
      }
    }



    for(var i in mergedTeams){
      console.log("ID: " +  mergedTeams[i].teamOwner.ID + " TeamOwner: " + mergedTeams[i].teamOwner.userName)
      for (var j in mergedTeams[i].relationships){
        console.log("  Persona: " + mergedTeams[i].relationships[j].userName)
      }
    }

    return mergedTeams

  }

  getUniqueRelations(input: Array<Team360>, currentMember: number): Array<User>{
    var uniqueRelations: Array<User> = []
    for(var i in input){
      if(input[i].teamOwner.ID == currentMember){
        for(var j in input[i].relationships){
          uniqueRelations.push(input[i].relationships[j])
        }
      }
    }
    return uniqueRelations
  }
}
