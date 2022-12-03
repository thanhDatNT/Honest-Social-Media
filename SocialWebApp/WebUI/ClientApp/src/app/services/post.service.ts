import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IPost, IPostResponse, LikeStatus } from '../interface/post';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  constructor(private http: HttpClient) {}

  getNewsfeedPost(userId: number, offset: number = 0, limit: number = 10): Observable<IPostResponse> {
    return this.http.get<IPostResponse>(`${environment.baseApi}/post/newsfeed/${userId}`, {
      params: {
        limit,
        offset
      }
    });
  }

  getPersonalPost(userId: number, offset: number = 0, limit: number = 10): Observable<IPostResponse> {
    return this.http.get<IPostResponse>(`${environment.baseApi}/post/${userId}`, {
      params: {
        limit,
        offset
      }
    });
  }

  likePost(postId: number, userId: number, status: LikeStatus): Observable<IPost> {
    return this.http.post<IPost>(
      `${environment.baseApi}/post/like`,
      {},
      {
        params: { postId, userId, status }
      }
    );
  }

  createPost(files: FormData): Observable<boolean> {
    return this.http.post<boolean>(`${environment.baseApi}/Post/create`, files);
  }

  deletePost(postId: number, userId: number): Observable<IPostResponse> {
    return this.http.delete<IPostResponse>(`${environment.baseApi}/Post/delete/${userId}`, {
      params: {
        postId
      }
    });
  }

  commentPost(postId: number, userId: number, content: string): Observable<IPost> {
    content = JSON.stringify(content);
    return this.http.put<IPost>(`${environment.baseApi}/Post/comment/${userId}`, content, {
      params: {
        postId
      },
      headers: new HttpHeaders({ 'content-type': 'application/json-patch+json', accept: 'text/plain' })
    });
  }
}
