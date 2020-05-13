import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { isSameDay, isSameMonth } from 'date-fns';

import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent, CalendarView } from 'angular-calendar';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Subject } from 'rxjs';

import { AppService } from '../../app.service';
import { SocketService } from '../../socket.service';

import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { Cookie } from 'ng2-cookies/ng2-cookies';


const colors: any = {
  green: {
    primary: '#008000',
    secondary: '#FAE3E3'
  }
};

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})



export class AdminDashboardComponent implements OnInit {
  @ViewChild('modalDetails') modalDetails: TemplateRef<any>;
  @ViewChild('modalDelete') modalDelete: TemplateRef<any>;
  @ViewChild('modalReminder') modalReminder: TemplateRef<any>;

  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;

  viewDate: Date = new Date();

  public userName: any;

  modalData: {
    action: string;
    event: CalendarEvent;
  };

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fas fa-pencil-alt"></i>       ',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      }
    },
    {
      label: '<i class="fas fa-trash-alt"></i>        ',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Deleted', event);
      }
    }
  ];

  refresh: Subject<any> = new Subject();
  activeDayIsOpen: boolean = false;

  public selectedUser: any;
  public allUsers: any[];
  public allUsersData: any[];
  public userInfo: any;
  public authToken: any;
  public receiverId: any;
  public receiverName: any;
  public adminId: any;
  public adminName: any;

  public onlineUserList: any = []
  public meetings: any = [];
  public events: CalendarEvent[] = [];

  public gentleReminder: Boolean = true;


  constructor(
    public appService: AppService,
    public socketService: SocketService,
    public _route: ActivatedRoute,
    public router: Router,
    private toastr: ToastrService,
    private modal: NgbModal,

  ) {

  }

  ngOnInit() {
    this.authToken = Cookie.get('authToken');
    this.receiverId = Cookie.get('receiverId');
    this.receiverName = Cookie.get('receiverName');
    this.userInfo = this.appService.getUserInfoFromLocalStorage()
    this.adminId = Cookie.get('receiverId');
    this.adminName = Cookie.get('receiverName');


    if (this.userInfo.isAdmin == 'true') {
      this.verifyUserConfirmation()
      this.getOnlineUserList()
      this.getAllUsers();

      this.getUserAllMeetingFunction()
      this.authErrorFunction()
    }
    else {
      this.router.navigate(['/user/normal/meeting/dashboard']);
    }

    setInterval(() => {
      this.meetingReminder();
    }, 5000); 

  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }


  /* Calendar Events */

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      //console.log('Day CLicked')
      this.viewDate = date;
      if ((isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) || events.length === 0) {
        this.activeDayIsOpen = false;
      } else {
        //this.activeDayIsOpen = true;
        this.view = CalendarView.Day;
      }
    }
  }

  eventTimesChanged({ event, newStart, newEnd }: CalendarEventTimesChangedEvent): void {
    event.start = newStart;
    event.end = newEnd;
    this.handleEvent('Dropped or resized', event);
    this.refresh.next();
  }

  handleEvent(action: string, event: any): void {

    if (action === 'Edited') {
      this.router.navigate([`/admin/meeting/update/${event.meetingId}`]);
    }

    else if (action === 'Deleted') {
      console.log(action === 'Deleted')

      this.modalData = { event, action };
      this.modal.open(this.modalDelete, { size: 'lg' });

    }
    else {
      this.modalData = { event, action };
      this.modal.open(this.modalDetails, { size: 'lg' });
    }
  }

  deleteEvent(event: any): void {

    this.deleteMeetingFunction(event);

    this.events = this.events.filter(iEvent => iEvent !== event);
    this.refresh.next();
    this.activeDayIsOpen = false;
  }

  /* End Calendar Events */

  public goToAddMeeting(): any {
    this.router.navigate(['admin/meeting/create']);
  }

  public meetingReminder(): any {
    let currentTime = new Date().getTime();
    for (let meetingEvent of this.meetings) {

      if (isSameDay(new Date(), meetingEvent.start) && new Date(meetingEvent.start).getTime() - currentTime <= 60000
        && new Date(meetingEvent.start).getTime() > currentTime) {
        if (meetingEvent.remindMe && this.gentleReminder) {

          this.modalData = { action: 'clicked', event: meetingEvent };
          this.modal.open(this.modalReminder, { size: 'lg' });
          this.gentleReminder = false
          break;
        }

      }
      else if (currentTime > new Date(meetingEvent.start).getTime() &&
        new Date(currentTime - meetingEvent.start).getTime() < 10000) {
        this.toastr.info(`Meeting ${meetingEvent.meetingTopic} Started!`, `Gentle Reminder`);
      }
    }

  }


  /* Data base functions */

  public getUserMeetings(userId, userName): any {  
    this.receiverId = userId
    this.receiverName = userName
    this.getUserAllMeetingFunction()
  }//

  public getAdminMeetings(userId): any { 
    this.receiverId = userId
    this.receiverName = this.adminName
    this.getUserAllMeetingFunction()
  }//

  public getAllUsers = () => {

    if (this.authToken != null) {
      this.appService.getUsers(this.authToken).subscribe((apiResponse) => {
        if (apiResponse.status == 200) {
          this.allUsersData = apiResponse.data;

          this.toastr.info("Updated", "All users listed");

        }
        else {
          this.toastr.error(apiResponse.message, "User Update");
        }
      },
        (error) => {
          this.toastr.error('Server error occured', "Error!");
          this.router.navigate(['/serverError']);

        }
      );

    }
    else {
      this.toastr.info('Missing Authorization key', "Please login again");
      this.router.navigate(['/user/login']);

    }//end else

  }//

  public sentMeetingRemindersonEmailFunction = () => {

    if (this.authToken != null && this.adminId != null) {
      this.appService.sentMeetingReminders(this.adminId, this.authToken).subscribe((apiResponse) => {
        if (apiResponse.status == 200) {
          this.toastr.info("Meeting Reminders sent", "Update");

        }
        else {
          this.toastr.error(apiResponse.message, "Error!");
        }
      },
        (error) => {
          this.toastr.error('Server error occured', "Error!");
          this.router.navigate(['/serverError']);

        }
      );

    }
    else {
      this.toastr.info('Missing Authorization key', "Please login again");
      this.router.navigate(['/user/login']);

    }
  }//

  public getUserAllMeetingFunction = () => {

    if (this.receiverId != null && this.authToken != null) {
      this.appService.getUserAllMeeting(this.receiverId, this.authToken).subscribe((apiResponse) => {
        if (apiResponse.status == 200) {

          this.meetings = apiResponse.data;
          for (let meetingEvent of this.meetings) {

            meetingEvent.title = meetingEvent.meetingTopic;
            meetingEvent.start = new Date(meetingEvent.meetingStartDate);
            meetingEvent.end = new Date(meetingEvent.meetingEndDate);
            meetingEvent.color = colors.green;
            meetingEvent.actions = this.actions
            meetingEvent.remindMe = true

          }
          this.events = this.meetings;
          this.refresh.next();
          this.toastr.info("Calendar Updated", `Meetings Found!`);

        }
        else {
          this.toastr.error(apiResponse.message, "Error!");
          this.events = [];
        }
      },
        (error) => {
          if (error.status == 400) {
            this.toastr.warning("Calendar Failed to Update", "Either user or Meeting not found");
            this.events = []
          }
          else {
            this.toastr.error("Some Error Occurred", "Error!");
            this.router.navigate(['/serverError']);

          }
        }
      );

    }
    else {
      this.toastr.info("Missing Authorization Key", "Please login again");
      this.router.navigate(['/user/login']);

    }

  }//


  public deleteMeetingFunction(meeting): any {
    this.appService.deleteMeeting(meeting.meetingId, this.authToken)
      .subscribe((apiResponse) => {

        if (apiResponse.status == 200) {
          this.toastr.success("Deleted the Meeting", "Successfull!");

          let dataForNotify = {
            message: `Hi, ${this.receiverName} has canceled the meeting - ${meeting.meetingTopic}. Please Check your Calendar/Email`,
            userId: meeting.participantId
          }

          this.notifyUpdatesToUser(dataForNotify);

        }
        else {
          this.toastr.error(apiResponse.message, "Error!");
        }
      },
        (error) => {

          if (error.status == 404) {
            this.toastr.warning("Delete Meeting Failed", "Meeting Not Found!");
          }
          else {
            this.toastr.error("Some Error Occurred", "Error!");
            this.router.navigate(['/serverError']);

          }

        });

  }//

  public logout: any = () => {

    this.appService.logout(this.receiverId, this.authToken).subscribe(
      (apiResponse) => {
        if (apiResponse.status === 200) {
          localStorage.clear();
          Cookie.delete('authToken'); Cookie.delete('receiverId'); Cookie.delete('receiverName');

          this.socketService.disconnectedSocket();
          this.socketService.exitSocket();

          this.router.navigate(['/login']);
        } else {
          this.toastr.error(apiResponse.message, "Error!")
          //this.router.navigate(['/serverError']);//in case of error redirects to error page.
        } // end condition
      },
      (err) => {
        if (err.status == 404) {
          this.toastr.warning("Logout Failed", "Already Logged Out or Invalid User");
        }
        else {
          this.toastr.error("Some Error Occurred", "Error!");
          this.router.navigate(['/serverError']);

        }
      });

  } //


  /* Socket - Event Based Functions */

  public verifyUserConfirmation: any = () => {
    this.socketService.verifyUser()
      .subscribe(() => {
        this.socketService.setUser(this.authToken);//Emitting set-user event with authToken as parameter.

      });
  }//

  public authErrorFunction: any = () => {

    this.socketService.listenAuthError()
      .subscribe((data) => {
        this.toastr.info("Missing Authorization Key", "Please login again");
        this.router.navigate(['/user/login']);

      });//
  }//

  public getOnlineUserList: any = () => {
    this.socketService.onlineUserList()
      .subscribe((data) => {

        this.onlineUserList = []
        for (let x in data) {
          //let temp = { 'userId': x, 'userName': data[x] };
          this.onlineUserList.push(x);
        }

        for (let user of this.allUsersData) {

          if (this.onlineUserList.includes(user.userId)) {
            user.status = "online"
          } else {
            user.status = "offline"
          }

        }

      });
  }//

  public notifyUpdatesToUser: any = (data) => {
    this.socketService.notifyUpdates(data);
  }//

}
