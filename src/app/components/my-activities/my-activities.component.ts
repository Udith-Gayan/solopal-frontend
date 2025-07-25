import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { ActivityService } from '../../services/activity.service';
import { AuthService } from '../../services/auth.service';
import { UserActivities } from '../../models/activity.model';
import { User } from '../../models/user.model';
import { ActivityCardComponent } from '../activity-card/activity-card.component';

@Component({
  standalone: true,
  selector: 'app-my-activities',
  templateUrl: './my-activities.component.html',
  styleUrls: ['./my-activities.component.scss'],
  imports: [
    CommonModule,
    MatCardModule,
    MatTabsModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatToolbarModule,
    MatIconModule,
    ActivityCardComponent
  ]
})
export class MyActivitiesComponent implements OnInit {
  userActivities: UserActivities = { created: [], joined: [] };
  currentUser: User | null = null;
  loading = true;

  constructor(
    private activityService: ActivityService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.loadUserActivities();
      }
    });
  }

  private loadUserActivities(): void {
    this.loading = true;
    this.activityService.getUserActivities().subscribe({
      next: (activities) => {
        this.userActivities = activities;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading user activities:', error);
        this.snackBar.open('Error loading activities', 'Close', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  onJoinActivity(activityId: string): void {
    this.activityService.joinActivity(activityId).subscribe({
      next: (response) => {
        this.snackBar.open(response.message, 'Close', { duration: 3000 });
        this.loadUserActivities();
      },
      error: (error) => {
        this.snackBar.open(error.error?.message || 'Error joining activity', 'Close', { duration: 3000 });
      }
    });
  }

  onLeaveActivity(activityId: string): void {
    this.activityService.leaveActivity(activityId).subscribe({
      next: (response) => {
        this.snackBar.open(response.message, 'Close', { duration: 3000 });
        this.loadUserActivities();
      },
      error: (error) => {
        this.snackBar.open(error.error?.message || 'Error leaving activity', 'Close', { duration: 3000 });
      }
    });
  }

  onOpenFeedback(activityId: string): void {
    // TODO: Open feedback dialog
    console.log('Open feedback for activity:', activityId);
  }
}