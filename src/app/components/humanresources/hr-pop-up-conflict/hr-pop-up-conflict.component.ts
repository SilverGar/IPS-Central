import { Inject } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { dbConflictData, getConflictData } from 'src/app/models/db-user';
import { DatabaseService } from 'src/app/services/dataManagement/database.service';

@Component({
  selector: 'app-hr-pop-up-conflict',
  templateUrl: './hr-pop-up-conflict.component.html',
  styleUrls: ['./hr-pop-up-conflict.component.css']
})
export class HrPopUpConflictComponent implements OnInit {

  data: any
  conflict: Array<dbConflictData> = []

  constructor(
    //Se supone que la variable 'data' no tiene que tener ningun tipo de variable, segun la pagina de Angular es de tipo Any.
    //Pero el codigo no funciona si no se agrega el tipo de dato despues del 'data:'
    //WTF Angular
    private dialogRef: MatDialogRef<HrPopUpConflictComponent>,
    @Inject(MAT_DIALOG_DATA) inputDialog: boolean,
    private db: DatabaseService
  ) { 
    this.data = inputDialog
  }

  ngOnInit(): void {
    console.log(this.data.newUser)
    var conflictData: getConflictData ={
      owner: this.data.newUser.TeamOwnerID,
      partner: this.data.newUser.PartnerID,
      evalTypeOwner: 0,
      evalTypePartner: 0
    }
    this.db.getConflictData(conflictData).subscribe(resp => {
      this.conflict = resp
      console.log(this.conflict)
    })
  }

  cancel(){
    this.dialogRef.close();
  }

}
