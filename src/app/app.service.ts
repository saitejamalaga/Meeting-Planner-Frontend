import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cookie } from 'ng2-cookies/ng2-cookies';


import { HttpClient } from '@angular/common/http';
import { HttpErrorResponse, HttpParams } from "@angular/common/http";

@Injectable()
export class AppService {

  private baseUrl = 'http://localhost:3000/api/v1';

  constructor(public http: HttpClient) {
  }

  public getUserInfoFromLocalStorage = () => {

    return JSON.parse(localStorage.getItem('userInfo'));

  }

  public setUserInfoInLocalStorage = (data) => {

    localStorage.setItem('userInfo', JSON.stringify(data))


  }

  public signUpFunction(data): Observable<any> {

    const params = new HttpParams()
      .set('firstName', data.firstName)
      .set('lastName', data.lastName)
      .set('userName', data.userName)
      .set('countryCode', data.country)
      .set('mobileNumber', data.mobile)
      .set('email', data.email)
      .set('password', data.password)
      .set('createdOn', data.createdOn);

    return this.http.post(`${this.baseUrl}/users/signup`, params);

  } // 

  public signInFunction(data): Observable<any> {

    const params = new HttpParams()
      .set('email', data.email)
      .set('password', data.password);

    return this.http.post(`${this.baseUrl}/users/login`, params);
  } // 

  public resetPassword(data): Observable<any> {

    const params = new HttpParams()
      .set('email', data.email)

    return this.http.post(`${this.baseUrl}/users/resetPassword`, params);
  }//

  public updatePassword(data): Observable<any> {

    const params = new HttpParams()
      .set('validationToken', data.validationToken)
      .set('password', data.password)

    return this.http.put(`${this.baseUrl}/users/updatePassword`, params);
  }//

  public verifyEmail(userId): Observable<any> {

    const params = new HttpParams()
      .set('userId', userId)

    return this.http.put(`${this.baseUrl}/users/verifyEmail`, params);
  }//

  public getUsers(authToken): Observable<any> {

    return this.http.get(`${this.baseUrl}/users/view/all?authToken=${authToken}`);
  }//

  public logout(userId, authToken): Observable<any> {

    const params = new HttpParams()
      .set('authToken', authToken)

    return this.http.post(`${this.baseUrl}/users/${userId}/logout`, params);
  } //

  /*------------------------------------------------------*/
  /*Meeting Functions */

  public addMeeting(data): Observable<any> {

    const params = new HttpParams()
      .set('meetingTopic', data.meetingTopic)
      .set('hostId', data.hostId)
      .set('hostName', data.hostName)
      .set('participantId', data.participantId)
      .set('participantName', data.participantName)
      .set('participantEmail', data.participantEmail)
      .set('meetingStartDate', data.meetingStartDate)
      .set('meetingEndDate', data.meetingEndDate)
      .set('meetingDescription', data.meetingDescription)
      .set('meetingPlace', data.meetingPlace)
      .set('authToken', data.authToken)

    return this.http.post(`${this.baseUrl}/meetings/addMeeting`, params);
  }//

  public getMeetingDetails(meetingId, authToken): Observable<any> {
    return this.http.get(`${this.baseUrl}/meetings/${meetingId}/details?authToken=${authToken}`);
  }//

  public updateMeeting(data): Observable<any> {

    const params = new HttpParams()
      .set('meetingTopic', data.meetingTopic)
      .set('meetingStartDate', data.meetingStartDate)
      .set('meetingEndDate', data.meetingEndDate)
      .set('meetingDescription', data.meetingDescription)
      .set('meetingPlace', data.meetingPlace)
      .set('authToken', data.authToken)

    return this.http.put(`${this.baseUrl}/meetings/${data.meetingId}/updateMeeting`, params);
  }//

  public getUserAllMeeting(userId, authToken): Observable<any> {
    return this.http.get(`${this.baseUrl}/meetings/view/all/meetings/${userId}?authToken=${authToken}`);
  }//

  public deleteMeeting(meetingId, authToken): Observable<any> {

    const params = new HttpParams()
      .set('authToken', authToken)

    return this.http.post(`${this.baseUrl}/meetings/${meetingId}/delete`, params);
  }//

  public sentMeetingReminders(userId, authToken): Observable<any> {

    const params = new HttpParams()
      .set('userId', userId)
      .set('authToken', authToken)

    return this.http.post(`${this.baseUrl}/meetings/admin-meetings/sentReminders`, params);
  }//

  private handleError(err: HttpErrorResponse) {

    let errorMessage = '';

    if (err.error instanceof Error) {

      errorMessage = `An error occurred: ${err.error.message}`;

    } else {

      errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;

    } // end condition *if

    console.error(errorMessage);

    return Observable.throw(errorMessage);

  }  // END handleError

}
