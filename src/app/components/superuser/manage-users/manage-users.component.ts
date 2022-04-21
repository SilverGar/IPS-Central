import { Component, OnDestroy, OnInit } from '@angular/core';

//Data service
import { DataSharingService } from 'src/app/services/dataManagement/data-sharing.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.css']
})
export class MANAGEUSERSComponent implements OnInit, OnDestroy{

  // message?: string;
  // subscription?: Subscription;

  constructor(
    private data: DataSharingService
  ) { }

  ngOnInit(): void {
    // this.subscription = this.data.currentMessage.subscribe(message => this.message = message)
  }

  ngOnDestroy(): void {
    // this.subscription?.unsubscribe();
  }

  // Variables
  // newMessage(){
  //   this.data.changeMessage("Hello new message")
  // }

}
