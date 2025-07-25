import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserFriendship, Friend, FriendRequests, SendFriendRequestRequest, RespondToFriendRequestRequest } from '../models/friendship.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FriendshipService {
  constructor(private http: HttpClient) {}

  sendFriendRequest(request: SendFriendRequestRequest): Observable<UserFriendship> {
    return this.http.post<UserFriendship>(`${environment.apiUrl}/friendships/send-request`, request);
  }

  respondToFriendRequest(friendshipId: string, response: RespondToFriendRequestRequest): Observable<UserFriendship> {
    return this.http.patch<UserFriendship>(`${environment.apiUrl}/friendships/${friendshipId}/respond`, response);
  }

  getFriendRequests(): Observable<FriendRequests> {
    return this.http.get<FriendRequests>(`${environment.apiUrl}/friendships/requests`);
  }

  getFriends(): Observable<Friend[]> {
    return this.http.get<Friend[]>(`${environment.apiUrl}/friendships/friends`);
  }

  removeFriend(friendshipId: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/friendships/${friendshipId}`);
  }
}