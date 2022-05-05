import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PopUpLoadInfoComponent } from '../pop-up-load-info/pop-up-load-info.component';

@Component({
  selector: 'app-load-info',
  templateUrl: './load-info.component.html',
  styleUrls: ['./load-info.component.css']
})
export class LoadInfoComponent implements OnInit {

  ngOnInit(): void {
  }

  constructor(public dialog: MatDialog) { }
  openDialog(): void {
    this.dialog.open(PopUpLoadInfoComponent, {
      width: '300px'
    });
  }
}
