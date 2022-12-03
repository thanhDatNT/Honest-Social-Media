import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ISearchFriendResponse, ISearchUserResponse, IUser } from '../interface/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseUserApiUrl: string = environment.baseApi + '/user';
  constructor(private http: HttpClient) {}

  getUserInfo(loginUserId: number, userId: number): Observable<IUser> {
    return this.http.get<IUser>(this.baseUserApiUrl, {
      params: {
        loginUserId,
        userId
      }
    });
  }

  uploadPhoto(file: FormData, userid: number, type: string) {
    const params = new HttpParams().append('userid', userid);
    return this.http.post(this.baseUserApiUrl + `/upload-${type}`, file, {
      params,
      responseType: 'text'
    });
  }

  searchUser(userId: number, searchString: string, offset: number, limit: number) {
    return this.http.get<ISearchUserResponse>(this.baseUserApiUrl + '/search', {
      params: {
        userId,
        searchString,
        offset,
        limit
      }
    });
  }

  searchFriends(userId: number, searchString: string, offset: number = 0, limit: number = 100) {
    return this.http.get<ISearchFriendResponse>(`${environment.baseApi}/user/search-friend`, {
      params: {
        userId,
        searchString,
        offset,
        limit
      }
    });
  }

  addFriendRequest(sourceUserId: number, receiveUserId: number) {
    const body = JSON.stringify({ sourceUserId, receiveUserId });
    const headers = { 'content-type': 'application/json' };
    return this.http.post<boolean>(`${environment.baseApi}/user/add-friend`, body, {
      headers
    });
  }

  unfriendRequest(userId: number, friendId: number) {
    const body = JSON.stringify({ userId, friendId });
    const headers = { 'content-type': 'application/json' };
    return this.http.post<boolean>(`${environment.baseApi}/user/unfriend`, body, {
      headers
    });
  }

  handleFriendRequest(userId: number, triggerUserId: number, action: boolean) {
    const body = JSON.stringify({ userId, triggerUserId, action });
    const headers = { 'content-type': 'application/json' };
    return this.http.put<boolean>(`${environment.baseApi}/user/response-add-friend-request`, body, { headers });
  }
}
