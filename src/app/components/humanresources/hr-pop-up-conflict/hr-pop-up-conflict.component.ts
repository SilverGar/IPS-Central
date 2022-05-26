import { Inject } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotificationData, getConflictData } from 'src/app/models/db-user';
import { DatabaseService } from 'src/app/services/dataManagement/database.service';

@Component({
  selector: 'app-hr-pop-up-conflict',
  templateUrl: './hr-pop-up-conflict.component.html',
  styleUrls: ['./hr-pop-up-conflict.component.css']
})
export class HrPopUpConflictComponent implements OnInit {

  data: any
  conflict: Array<NotificationData> = []

  saveResponse: boolean = false

  conflictType: number = 0

  constructor(
    //Se supone que la variable 'data' no tiene que tener ningun tipo de variable, segun la pagina de Angular es de tipo Any.
    //Pero el codigo no funciona si no se agrega el tipo de dato despues del 'data:'
    //WTF Angular
    private dialogRef: MatDialogRef<HrPopUpConflictComponent>,
    @Inject(MAT_DIALOG_DATA) inputDialog: boolean
  ) { 
    this.data = inputDialog
  }

  ngOnInit(): void {
    this.conflict = this.data.newUser.Notification 
    this.conflictType = this.conflict[0].RequestType
  }

  checkMessage(){
    this.saveResponse = false
    for(var i in this.conflict){
      if(this.conflict[i].HrResponse?.length ?? 0 > 0){
        this.saveResponse= true
      }
    }
  }

  save(){
    this.dialogRef.close(this.conflict)
  }

}
