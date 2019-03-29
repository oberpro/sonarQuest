import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Permission } from '../Interfaces/Permission';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthenticationService } from '../login/authentication.service';
import { Route } from '@angular/compiler/src/core';

@Injectable()
export class PermissionService {

  private permittedUrls: string[];

  constructor(private http: HttpClient, private authenticationService: AuthenticationService) {
  }

  private fetchPermissions(): Observable<Permission[]> {
    return this.http.get<Permission[]>(`${environment.endpoint}/permission`);
  }

  private loadPermittedUrls(): Promise<string[]> {
    return this.fetchPermissions().pipe(map(permissions => permissions.map(permission => permission.permission))).toPromise();
  }
  
  public isUrlPermitted(url: string): boolean | Promise<boolean> {
    console.log('check permission for',url);
    if (this.authenticationService.isLoggedIn()) {
      if(this.permittedUrls){
        if(url === "app"){
          return true;
        }
        return this.permittedUrls.includes(url);
      }else{
        return new Promise((resolve,reject)=>{
          this.loadPermittedUrls().then(p=>{
            this.permittedUrls = p;
            if(url === "app"){
              resolve(true);
            }else{
              resolve(this.permittedUrls.includes(url));
            }
          }).catch(err=>{
              this.authenticationService.logout();
              reject(false);
          });
        });
      }
    }else{
      return false;
    }
  }

  public getPermissions():Promise<string[]>{
    return new Promise((resolve,reject)=>{
      if(this.authenticationService.isLoggedIn()){
        if(this.permittedUrls){
          resolve(this.permittedUrls);
        }else{
          this.loadPermittedUrls().then(p=>{
            this.permittedUrls = p;
            resolve(this.permittedUrls);
          }).catch(err=>{
              this.authenticationService.logout();
              reject(false);
          });
        }
      }else{
        reject("Not logged in!");
      }
    });
  }

}
