import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { PopUpLoadInfoComponent } from '../pop-up-load-info/pop-up-load-info.component';

@Component({
  selector: 'app-load-info',
  templateUrl: './load-info.component.html',
  styleUrls: ['./load-info.component.css']
})
export class LoadInfoComponent implements OnInit {

  ngOnInit(): void {
  }

  constructor(
    public dialog: MatDialog
    ) { }
  openDialog(): void {
    const dialogConfig = new MatDialogConfig()
    dialogConfig.disableClose = true
    dialogConfig.autoFocus = true

    dialogConfig.data = {
      selection: false
    }

    const dialogRef = this.dialog.open(PopUpLoadInfoComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(data => {
      console.log(data)
    })
  }
}
