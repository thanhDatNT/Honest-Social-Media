import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IAuthenticationResponse } from '../interface/login-user';
import { IRegisterUser } from '../interface/registerd-user';
import { IUser } from '../interface/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) {}

  register(newUser: IRegisterUser): Observable<IUser> {
    return this.http.post<IUser>(`${environment.baseApi}/auth/register`, { ...newUser });
  }

  login(username: string, password: string): Observable<IAuthenticationResponse> {
    const body = JSON.stringify({ username, password });
    const headers = { 'content-type': 'application/json' };
    return this.http.post<IAuthenticationResponse>(`${environment.baseApi}/auth/login`, body, {
      headers
    });
  }

  async tryRefreshingTokens(token: string): Promise<boolean> {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!token || !refreshToken) {
      return false;
    }

    const credentials = JSON.stringify({
      accessToken: token,
      refreshToken: refreshToken
    });
    const refreshRes = await new Promise<IAuthenticationResponse>((resolve, reject) => {
      this.http
        .post<IAuthenticationResponse>(`${environment.baseApi}/auth/refresh`, credentials, {
          headers: new HttpHeaders({
            'Content-Type': 'application/json'
          })
        })
        .subscribe({
          next: (res: IAuthenticationResponse) => resolve(res),
          error: error => {
            reject(error);
            return false;
          }
        });
    });
    localStorage.setItem('jwt', refreshRes.accessToken);
    localStorage.setItem('refreshToken', refreshRes.refreshToken);
    return true;
  }
}
