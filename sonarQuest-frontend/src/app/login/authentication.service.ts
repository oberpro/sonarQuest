import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import {Observable, Subscriber} from 'rxjs';
import {shareReplay} from 'rxjs/operators';
import {environment} from './../../environments/environment';
import {LocalStorageService} from './local-storage.service';
import {Token} from './Token';

import { Router } from '@angular/router';

@Injectable()
export class AuthenticationService {

  constructor(private http: HttpClient,
              private router: Router,
              private storageService: LocalStorageService) {
  }

  public login(username, password): Promise<any> {
      const body = JSON.stringify({username, password});
      const url = `${environment.endpoint}/login`;
      return new Promise((resolve,reject)=>{
        this.http.post(url, body, {
          headers: new HttpHeaders().set('Content-Type', 'application/json'),
          responseType: 'json',
          observe: 'response'
        }).toPromise().then(_result=>{
          const token = _result.body as Token;
          this.storageService.saveJWTToken(token);
          console.log('login success',_result);
          resolve({});
        }).catch(_error=>{
          reject(_error);
        });
      });
  }

  public logout(): void {
    this.storageService.removeJWTToken();
    this.router.navigate(['/login']);
  }

  public isLoggedIn(): boolean {
    const token = this.storageService.getJWTToken();
    if (!token) {
      return false;
    }
    return token.hasExpired();
  }

}
