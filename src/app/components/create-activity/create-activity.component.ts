import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { ActivityService } from '../../services/activity.service';
import { AuthService } from '../../services/auth.service';
import { ActivityCategory, ActivityVisibility } from '../../models/activity.model';

@Component({
  standalone: true,
  selector: 'app-create-activity',
  templateUrl: './create-activity.component.html',
  styleUrls: ['./create-activity.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatChipsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatToolbarModule,
    MatIconModule,
    MatMenuModule
  ]
})
export class CreateActivityComponent implements OnInit {
  activityForm: FormGroup;
  loading = false;
  selectedInterests: string[] = [];
  availableInterests = [
    'Travel', 'Food', 'Music', 'Sports', 'Art', 'Books', 
    'Nature', 'Technology', 'Fitness', 'Photography', 
    'Cooking', 'Wine', 'Coffee', 'Movies', 'Theater'
  ];

  constructor(
    private fb: FormBuilder,
    private activityService: ActivityService,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.activityForm = this.createForm();
  }

  ngOnInit(): void {}

  private createForm(): FormGroup {
    return this.fb.group({
      title: ['', Validators.required],
      description: [''],
      category: ['', Validators.required],
      visibility: ['PUBLIC'],
      date: ['', Validators.required],
      time: ['', Validators.required],
      location: [''],
      maxParticipants: ['']
    });
  }

  toggleInterest(interest: string): void {
    const index = this.selectedInterests.indexOf(interest);
    if (index > -1) {
      this.selectedInterests.splice(index, 1);
    } else {
      this.selectedInterests.push(interest);
    }
  }

  onSubmit(): void {
    if (this.activityForm.invalid) return;

    this.loading = true;
    const formValue = this.activityForm.value;
    
    // Combine date and time
    const dateTime = new Date(formValue.date);
    const [hours, minutes] = formValue.time.split(':');
    dateTime.setHours(parseInt(hours), parseInt(minutes));

    const activityData = {
      title: formValue.title,
      description: formValue.description || undefined,
      category: formValue.category as ActivityCategory,
      visibility: formValue.visibility as ActivityVisibility,
      dateTime: dateTime.toISOString(),
      location: formValue.location || undefined,
      maxParticipants: formValue.maxParticipants ? parseInt(formValue.maxParticipants) : undefined,
      interests: this.selectedInterests.length > 0 ? this.selectedInterests : undefined
    };

    this.activityService.createActivity(activityData).subscribe({
      next: (activity) => {
        this.loading = false;
        this.snackBar.open('Activity created successfully!', 'Close', { duration: 3000 });
        this.router.navigate(['/activities']);
      },
      error: (error) => {
        this.loading = false;
        this.snackBar.open(
          error.error?.message || 'Error creating activity. Please try again.',
          'Close',
          { duration: 5000 }
        );
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}