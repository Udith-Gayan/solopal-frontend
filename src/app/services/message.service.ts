import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Message, Conversation, CreateMessageRequest } from '../models/message.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  constructor(private http: HttpClient) {}

  sendMessage(message: CreateMessageRequest): Observable<Message> {
    return this.http.post<Message>(`${environment.apiUrl}/messages`, message);
  }

  getConversations(): Observable<Conversation[]> {
    return this.http.get<Conversation[]>(`${environment.apiUrl}/messages/conversations`);
  }

  getConversation(userId: string): Observable<Message[]> {
    return this.http.get<Message[]>(`${environment.apiUrl}/messages/conversation/${userId}`);
  }

  getActivityMessages(activityId: string): Observable<Message[]> {
    return this.http.get<Message[]>(`${environment.apiUrl}/messages/activity/${activityId}`);
  }
}