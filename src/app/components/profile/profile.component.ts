import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

@Component({
  standalone: true,
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatChipsModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatToolbarModule,
    MatIconModule,
    MatCheckboxModule
  ]
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  loading = false;
  selectedInterests: string[] = [];
  availableInterests = [
    'Travel', 'Food', 'Music', 'Sports', 'Art', 'Books', 
    'Nature', 'Technology', 'Fitness', 'Photography', 
    'Cooking', 'Wine', 'Coffee', 'Movies', 'Theater',
    'Dancing', 'Hiking', 'Gaming', 'Reading', 'Writing'
  ];

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {
    this.profileForm = this.createForm();
  }

  ngOnInit(): void {
    this.loadProfile();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      age: [''],
      location: [''],
      bio: ['']
    });
  }

  private loadProfile(): void {
    this.userService.getProfile().subscribe({
      next: (user: User) => {
        this.profileForm.patchValue({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          age: user.age,
          location: user.location,
          bio: user.bio
        });
        
        if (user.interests) {
          this.selectedInterests = [...user.interests];
        }
      },
      error: (error) => {
        this.snackBar.open('Error loading profile', 'Close', { duration: 3000 });
      }
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
    if (this.profileForm.invalid) return;

    this.loading = true;
    const formValue = this.profileForm.value;
    
    const updateData = {
      ...formValue,
      interests: this.selectedInterests
    };

    // Remove email from update data as it's readonly
    delete updateData.email;

    this.userService.updateProfile(updateData).subscribe({
      next: (user) => {
        this.loading = false;
        this.snackBar.open('Profile updated successfully!', 'Close', { duration: 3000 });
        
        // Update the current user in auth service
        const currentUser = this.authService.getCurrentUser();
        if (currentUser) {
          const updatedUser = { ...currentUser, ...user };
          localStorage.setItem('user', JSON.stringify(updatedUser));
        }
      },
      error: (error) => {
        this.loading = false;
        this.snackBar.open(
          error.error?.message || 'Error updating profile. Please try again.',
          'Close',
          { duration: 5000 }
        );
      }
    });
  }
}