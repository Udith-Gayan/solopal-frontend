import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Router } from '@angular/router';
import { ActivityService } from '../../services/activity.service';
import { AuthService } from '../../services/auth.service';
import { Activity, ActivityCategory, ActivityVisibility } from '../../models/activity.model';
import { User } from '../../models/user.model';
import { AuthDialogComponent } from '../auth-dialog/auth-dialog.component';
import { ActivityCardComponent } from '../activity-card/activity-card.component';

@Component({
  standalone: true,
  selector: 'app-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatSnackBarModule,
    MatButtonModule,
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    MatCardModule,
    MatCheckboxModule,
    ActivityCardComponent
  ]
})
export class ActivitiesComponent implements OnInit {
  activities: Activity[] = [];
  filteredActivities: Activity[] = [];
  loading = true;
  
  // Filters
  selectedCategory: ActivityCategory | '' = '';
  selectedVisibility: ActivityVisibility | '' = '';
  locationFilter = '';
  selectedInterests: string[] = [];
  sortBy = 'dateTime';
  
  // Available filter options
  availableInterests = ['Travel', 'Food', 'Music', 'Sports', 'Art', 'Books', 'Nature', 'Technology', 'Fitness', 'Photography'];
  
  // User state
  currentUser: User | null = null;
  isAuthenticated = false;
  isAdmin = false;

  constructor(
    private activityService: ActivityService,
    private authService: AuthService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.isAuthenticated = !!user;
      this.isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';
    });
    
    this.loadActivities();
  }

  loadActivities(): void {
    this.loading = true;
    this.activityService.getActivities().subscribe({
      next: (activities) => {
        this.activities = activities;
        this.applyFilters();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading activities:', error);
        this.snackBar.open('Error loading activities', 'Close', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  onSortChange(): void {
    this.applyFilters();
  }

  toggleInterest(interest: string): void {
    const index = this.selectedInterests.indexOf(interest);
    if (index > -1) {
      this.selectedInterests.splice(index, 1);
    } else {
      this.selectedInterests.push(interest);
    }
    this.applyFilters();
  }

  clearFilters(): void {
    this.selectedCategory = '';
    this.selectedVisibility = '';
    this.locationFilter = '';
    this.selectedInterests = [];
    this.sortBy = 'dateTime';
    this.applyFilters();
  }

  private applyFilters(): void {
    let filtered = [...this.activities];

    // Category filter
    if (this.selectedCategory) {
      filtered = filtered.filter(activity => activity.category === this.selectedCategory);
    }

    // Visibility filter
    if (this.selectedVisibility) {
      filtered = filtered.filter(activity => activity.visibility === this.selectedVisibility);
    }

    // Location filter
    if (this.locationFilter) {
      filtered = filtered.filter(activity => 
        activity.location?.toLowerCase().includes(this.locationFilter.toLowerCase())
      );
    }

    // Interests filter
    if (this.selectedInterests.length > 0) {
      filtered = filtered.filter(activity => 
        activity.interests?.some(interest => 
          this.selectedInterests.includes(interest)
        )
      );
    }

    // Sort
    switch (this.sortBy) {
      case 'dateTime':
        filtered.sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());
        break;
      case 'created':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'spots':
        const getAvailableSpots = (activity: Activity) => 
          (activity.maxParticipants || 0) - activity.currentParticipants;
        filtered.sort((a, b) => getAvailableSpots(b) - getAvailableSpots(a));
        break;
    }

    this.filteredActivities = filtered;
  }

  onJoinActivity(activityId: string): void {
    if (!this.isAuthenticated) {
      this.openAuthDialog('login');
      return;
    }

    this.activityService.joinActivity(activityId).subscribe({
      next: (response) => {
        this.snackBar.open(response.message, 'Close', { duration: 3000 });
        this.loadActivities(); // Reload to update participant count
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
        this.loadActivities(); // Reload to update participant count
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

  openAuthDialog(mode: 'login' | 'register'): void {
    this.dialog.open(AuthDialogComponent, {
      width: '400px',
      data: { mode }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}