import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  standalone: true,
  selector: 'app-auth-dialog',
  templateUrl: './auth-dialog.component.html',
  styleUrls: ['./auth-dialog.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatIconModule
  ]
})
export class AuthDialogComponent implements OnInit {
  authForm: FormGroup;
  mode: 'login' | 'register';
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router,
    private dialogRef: MatDialogRef<AuthDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { mode: 'login' | 'register' }
  ) {
    this.mode = data.mode;
    this.authForm = this.createForm();
  }

  ngOnInit(): void {}

  private createForm(): FormGroup {
    const baseForm = {
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    };

    if (this.mode === 'register') {
      return this.fb.group({
        ...baseForm,
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        location: [''],
        age: [''],
        bio: ['']
      });
    }

    return this.fb.group(baseForm);
  }

  switchMode(): void {
    this.mode = this.mode === 'login' ? 'register' : 'login';
    this.authForm = this.createForm();
  }

  onSubmit(): void {
    if (this.authForm.invalid) return;

    this.loading = true;
    const formValue = this.authForm.value;

    const authObservable = this.mode === 'login' 
      ? this.authService.login(formValue)
      : this.authService.register(formValue);

    authObservable.subscribe({
      next: (response) => {
        this.loading = false;
        this.snackBar.open(
          this.mode === 'login' ? 'Welcome back!' : 'Account created successfully!',
          'Close',
          { duration: 3000 }
        );
        this.dialogRef.close();
        this.router.navigate(['/activities']);
      },
      error: (error) => {
        this.loading = false;
        this.snackBar.open(
          error.error?.message || 'An error occurred. Please try again.',
          'Close',
          { duration: 5000 }
        );
      }
    });
  }

  loginWithFacebook(): void {
    this.dialogRef.close();
    window.location.href = 'http://localhost:3000/auth/facebook';
  }

  loginWithInstagram(): void {
    this.dialogRef.close();
    window.location.href = 'http://localhost:3000/auth/instagram';
  }
}