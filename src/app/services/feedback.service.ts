import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserFeedback, CreateFeedbackRequest, FeedbackStats } from '../models/feedback.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {
  constructor(private http: HttpClient) {}

  createFeedback(feedback: CreateFeedbackRequest): Observable<UserFeedback> {
    return this.http.post<UserFeedback>(`${environment.apiUrl}/feedback`, feedback);
  }

  getActivityFeedback(activityId: string): Observable<UserFeedback[]> {
    return this.http.get<UserFeedback[]>(`${environment.apiUrl}/feedback/activity/${activityId}`);
  }

  getUserFeedbackStats(userId: string): Observable<FeedbackStats> {
    return this.http.get<FeedbackStats>(`${environment.apiUrl}/feedback/user/${userId}/stats`);
  }
}