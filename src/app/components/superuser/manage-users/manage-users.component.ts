import { Component, OnDestroy, OnInit } from '@angular/core';

//Data service
import { DataSharingService } from 'src/app/services/dataManagement/data-sharing.service';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog'
import { PopUpAddUserComponent } from '../pop-up-add-user/pop-up-add-user.component';

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.css']
})
export class MANAGEUSERSComponent implements OnInit, OnDestroy {

  // message?: string;
  // subscription?: Subscription;

  constructor(
    private data: DataSharingService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    // this.subscription = this.data.currentMessage.subscribe(message => this.message = message)
  }

  ngOnDestroy(): void {
    // this.subscription?.unsubscribe();
  }

  openDialog(): void {
    this.dialog.open(PopUpAddUserComponent, {
      width: '30%'
    });
  }
}

// @Component({
//   selector: 'pop-up-add-user',
//   templateUrl: '../pop-up-add-user/pop-up-add-user.component.html'
// })
// export class PopUpAddUserComponent {
//   constructor
// }