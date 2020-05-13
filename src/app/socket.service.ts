import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import * as io from 'socket.io-client';


@Injectable({
  providedIn: 'root'
})
export class SocketService {
  public baseUrl = "http://localhost:3000";
  public socket;

  constructor(private _http: HttpClient) {
    this.socket = io(this.baseUrl);
  }


  public verifyUser = () => {
    return Observable.create((observer) => {
      this.socket.on('verifyUser', (data) => {
        observer.next(data);
      });
    });
  }//

  public onlineUserList = () => {
    return Observable.create((observer) => {
      this.socket.on('online-user-list', (userList) => {
        observer.next(userList);
      });
    });
  }//

  public disconnect = () => {
    return Observable.create((observer) => {
      this.socket.on('disconnect', () => {
        observer.next();
      });
    });
  }//

  public listenAuthError = () => {
    return Observable.create((observer) => {
      this.socket.on('auth-error', (data) => {
        observer.next(data);
      });
    }); 
  } //

  public getUpdatesFromAdmin = (userId) => {
    return Observable.create((observer) => {
      this.socket.on(userId, (data) => {
        observer.next(data);
      }); 
    }); 
  } //
  
  /* End of Listen Events*/


  public setUser = (authToken) => {
    this.socket.emit('set-user', authToken);
  }

  public notifyUpdates = (data) => {
    this.socket.emit('notify-updates', data);
  }//

  public exitSocket = () => {
    this.socket.disconnect();
  }//

  public disconnectedSocket = () => {
    this.socket.emit("disconnect", "");
  }//


}
