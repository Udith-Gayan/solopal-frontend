import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { AuthDialogComponent } from '../auth-dialog/auth-dialog.component';

@Component({
  standalone: true,
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatToolbarModule,
    MatIconModule
  ]
})
export class LandingComponent {
  sampleActivities = [
    {
      title: "Weekend Trip to Napa Valley",
      category: "Trip",
      description: "Wine tasting adventure with fellow wine enthusiasts",
      date: "Mar 15-17, 2025",
      location: "Napa Valley, CA",
      spotsLeft: 3,
      interests: ["Wine", "Travel", "Nature"]
    },
    {
      title: "Coffee & Book Discussion",
      category: "Coffee",
      description: "Discuss this month's book club pick over coffee",
      date: "Mar 5, 2025",
      location: "Central Perk Cafe",
      spotsLeft: 4,
      interests: ["Books", "Coffee", "Literature"]
    },
    {
      title: "Lunch at New Italian Place",
      category: "Lunch",
      description: "Try the new authentic Italian restaurant downtown",
      date: "Mar 8, 2025",
      location: "Downtown LA",
      spotsLeft: 2,
      interests: ["Food", "Italian", "Dining"]
    },
    {
      title: "House Party: Game Night",
      category: "Party",
      description: "Board games, good food, and great company",
      date: "Mar 12, 2025",
      location: "West Hollywood",
      spotsLeft: 6,
      interests: ["Games", "Social", "Fun"]
    }
  ];

  testimonials = [
    {
      name: "Jessica Chen",
      text: "Made amazing friends through SoloPal! We've been on three trips together now."
    },
    {
      name: "Mark Thompson",
      text: "Finally found people who share my love for cooking. We have monthly dinner parties!"
    },
    {
      name: "Lisa Rodriguez",
      text: "As someone new to the city, this platform helped me build a whole social network."
    }
  ];

  constructor(private dialog: MatDialog) {}

  openAuthDialog(mode: 'login' | 'register'): void {
    this.dialog.open(AuthDialogComponent, {
      width: '400px',
      data: { mode }
    });
  }

  loginWithFacebook(): void {
    window.location.href = 'http://localhost:3000/auth/facebook';
  }

  loginWithInstagram(): void {
    window.location.href = 'http://localhost:3000/auth/instagram';
  }
}