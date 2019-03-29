import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, CanActivateChild} from '@angular/router';
import {AuthenticationService} from './authentication.service';
import {PermissionService} from '../services/permission.service';

@Injectable()
export class AuthenticationGuard implements CanActivate,CanActivateChild {
  
  constructor(private router: Router,
    private authService: AuthenticationService,
              private permissionService: PermissionService) {
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Promise<boolean> {
    return this.authenticate(next.url.toString());
  }
  
  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Promise<boolean> {
    return this.authenticate(childRoute.url.toString());
  }

  authenticate(nextUrl: string): boolean | Promise<boolean> {
    const isLoggedIn = this.authService.isLoggedIn();
    if (!isLoggedIn) {
      this.router.navigate(['/login']);
      return false;
    }
    return this.permissionService.isUrlPermitted(nextUrl);
  }
}
