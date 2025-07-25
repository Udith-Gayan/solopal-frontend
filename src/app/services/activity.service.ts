import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Activity, CreateActivityRequest, ActivityCategory, ActivityVisibility, UserActivities } from '../models/activity.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {
  constructor(private http: HttpClient) {}

  getActivities(category?: ActivityCategory, location?: string, visibility?: ActivityVisibility): Observable<Activity[]> {
    let params = new HttpParams();
    
    if (category) {
      params = params.set('category', category);
    }
    
    if (location) {
      params = params.set('location', location);
    }

    if (visibility) {
      params = params.set('visibility', visibility);
    }

    return this.http.get<Activity[]>(`${environment.apiUrl}/activities`, { params });
  }

  getActivity(id: string): Observable<Activity> {
    return this.http.get<Activity>(`${environment.apiUrl}/activities/${id}`);
  }

  getUserActivities(): Observable<UserActivities> {
    return this.http.get<UserActivities>(`${environment.apiUrl}/activities/my-activities`);
  }

  createActivity(activity: CreateActivityRequest): Observable<Activity> {
    return this.http.post<Activity>(`${environment.apiUrl}/activities`, activity);
  }

  updateActivity(id: string, activity: Partial<CreateActivityRequest>): Observable<Activity> {
    return this.http.patch<Activity>(`${environment.apiUrl}/activities/${id}`, activity);
  }

  deleteActivity(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/activities/${id}`);
  }

  joinActivity(id: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${environment.apiUrl}/activities/${id}/join`, {});
  }

  leaveActivity(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${environment.apiUrl}/activities/${id}/leave`);
  }
}