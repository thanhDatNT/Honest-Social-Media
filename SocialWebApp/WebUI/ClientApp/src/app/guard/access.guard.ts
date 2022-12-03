import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AccessGuard implements CanActivate {
  constructor(private router: Router, private jwtHelper: JwtHelperService, private authService: AuthService) {}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> | boolean {
    const token = localStorage.getItem('jwt');

    if (token && !this.jwtHelper.isTokenExpired(token)) {
      return true;
    } else if (token === null) {
      this.router.navigate(['auth/login']);
      return false;
    }

    return new Promise((resolve, reject) => {
      this.authService
        .tryRefreshingTokens(token as string)
        .then(res => resolve(true))
        .catch(res => {
          localStorage.removeItem('jwt');
          localStorage.removeItem('refreshToken');
          this.router.navigate(['auth/login']);
          reject(false);
        });
    });
  }
}
