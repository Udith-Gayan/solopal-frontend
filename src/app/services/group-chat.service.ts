import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GroupChat, GroupMessage, CreateGroupChatRequest, SendGroupMessageRequest } from '../models/group-chat.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GroupChatService {
  constructor(private http: HttpClient) {}

  createGroupChat(request: CreateGroupChatRequest): Observable<GroupChat> {
    return this.http.post<GroupChat>(`${environment.apiUrl}/group-chat`, request);
  }

  getActivityGroupChat(activityId: string): Observable<GroupChat> {
    return this.http.get<GroupChat>(`${environment.apiUrl}/group-chat/activity/${activityId}`);
  }

  sendGroupMessage(request: SendGroupMessageRequest): Observable<GroupMessage> {
    return this.http.post<GroupMessage>(`${environment.apiUrl}/group-chat/message`, request);
  }

  addMemberToGroupChat(groupChatId: string, userId: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/group-chat/${groupChatId}/members/${userId}`, {});
  }

  removeMemberFromGroupChat(groupChatId: string, userId: string): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/group-chat/${groupChatId}/members/${userId}`);
  }
}