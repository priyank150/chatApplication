import { Component, OnInit } from '@angular/core';
import { DashboardService } from './dashboard.service';
import { AuthenticationService } from 'src/app/authentication.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  usersArray = [];
  selectedUserName;
  loggedInUserName;
  loggedInUserId;
  selectedUserId;
  userDetails;
  chatRoom;
  chatMessage;
  chatBackground = '';
  usersChatMessage = [];
  messageObject = {
    senderId: null,
    recieverId: null,
    chatRoom: null,
    chatMessage: null
  };

  constructor(private dashboardService: DashboardService, private auth: AuthenticationService) { 
    this.auth.newMessageReceived()
      .subscribe(data => {
        console.log('new message emmited', data)
        if(data.chatRoom){
          this.dashboardService.getMessageByChatRoom({chatRoom : this.chatRoom}).subscribe(res => {
            // console.log('response========', res);
            if(res){
              this.usersChatMessage = res.chat; 
            }
          })
        }
        // this.usersChatMessage.push(data)
      });
  }

  ngOnInit() {

    this.dashboardService.getAllUsers().subscribe(users => {
      if(users) {
        this.usersArray = users;
      }
      // console.log('users array ==', this.usersArray)
    })
    this.userDetails = this.auth.getUserDetails();
    this.loggedInUserName = this.userDetails.userName;
    // console.log('user', this.userDetails)
    
  }

  signOut() {
    this.auth.logout();
  }

  userSelected(user) {
    // console.log('user ====', user);
    this.chatBackground = 'chat-window-user';
    this.usersChatMessage = [];
    this.selectedUserName = user.userName;
    this.selectedUserId = parseInt(user.userId);
    this.loggedInUserId = parseInt(this.userDetails.userId);
    if(this.selectedUserId > this.loggedInUserId) {
      this.chatRoom = this.selectedUserId.toString() + this.loggedInUserId.toString();
    } else {
      this.chatRoom = this.loggedInUserId.toString() + this.selectedUserId.toString();
    }
    // console.log('chaatRoom =============', this.chatRoom);
    this.messageObject.senderId = this.loggedInUserId;
    this.messageObject.recieverId = this.selectedUserId;
    this.messageObject.chatRoom = this.chatRoom;
    this.auth.joinRoom({userName: this.loggedInUserName, chatRoom: this.chatRoom});
      // console.log('users chat', this.usersChatMessage);

    this.dashboardService.getMessageByChatRoom({chatRoom : this.chatRoom}).subscribe(res => {
      // console.log('response========', res);
      if(res){
        this.usersChatMessage = res.chat; 
      }
    })

  }

  sendMessage() {
    
    this.messageObject.chatMessage = this.chatMessage;
    this.chatMessage = '';
    console.log('messageObje=========', this.messageObject);
    this.dashboardService.sendChatMessage(this.messageObject).subscribe(res => {
      console.log('res', res);
      this.auth.sendMessage(this.messageObject);
      
    });
  }

}
