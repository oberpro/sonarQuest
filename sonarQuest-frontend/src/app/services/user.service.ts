import { Injectable } from '@angular/core';
import { User } from '../Interfaces/User';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, Subscriber } from 'rxjs';
import { AuthenticationService } from '../login/authentication.service';
import { tap } from 'rxjs/operators';
import * as moment from 'moment';

@Injectable()
export class UserService {

  private user: User;

  constructor(private httpClient: HttpClient,
    private authenticationService: AuthenticationService) {
  }

  getUser():Promise<User>{
    return new Promise((resolve,reject)=>{
      if(this.authenticationService.isLoggedIn()){
        if(this.user){
          resolve(this.user);
        }else{
          const url = `${environment.endpoint}/user`;
          this.httpClient.get<User>(url).toPromise().then(user=>{
            resolve(user);
          }).catch(_error=>{
            this.authenticationService.logout();
            reject(_error);
          });
        }
      }else{
        reject("Not logged in");
        this.authenticationService.logout();
      }
    });
  }

  public getUsers(): Observable<User[]> {
    const url = `${environment.endpoint}/user/all`;
    return this.httpClient.get<User[]>(url).pipe(tap((users: User[]) => {
      users.forEach(user =>
        user.lastLogin = user.lastLogin ? moment(new Date(user.lastLogin)).format('DD.MM.YYYY HH:mm:ss') : null
      )
    }));
  }

  public getImage(): Observable<Blob> {
    const url = `${environment.endpoint}/user/avatar`;
    return this.httpClient.get(url, { responseType: 'blob' });
  }

  public getImageForUser(user: User): Observable<Blob> {
    const url = `${environment.endpoint}/user/${user.id}/avatar`;
    return this.httpClient.get(url, { responseType: 'blob' });
  }

  public updateUser(user: User): Promise<User> {
    const url = `${environment.endpoint}/user`;
    user.lastLogin = null;

    console.log(user);
    return this.httpClient.post<User>(url, user).toPromise();
  }

  public deleteUser(user: User): Promise<any> {
    const url = `${environment.endpoint}/user/${user.id}`;
    return this.httpClient.delete(url).toPromise();
  }

}
