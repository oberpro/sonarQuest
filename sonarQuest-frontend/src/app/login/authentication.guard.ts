import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {AuthenticationService} from './authentication.service';
import {PermissionService} from '../services/permission.service';
import {RoutingUrls} from "../app-routing/routing-urls";

@Injectable()
export class AuthenticationGuard implements CanActivate {

  constructor(private router: Router,
              private authService: AuthenticationService,
              private permissionService: PermissionService) {
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Promise<boolean> {
    return this.authenticate(next.url.toString());
  }

  authenticate(nextUrl: string): boolean | Promise<boolean> {
    const isLoggedIn = this.authService.isLoggedIn();
    if (!isLoggedIn) {
      this.router.navigate([RoutingUrls.login], {skipLocationChange: true});
      return false;
    }

    return this.permissionService.isUrlPermitted(nextUrl);
  }
}
