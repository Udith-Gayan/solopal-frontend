import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router } from '@angular/router';
import { FriendshipService } from '../../services/friendship.service';
import { AuthService } from '../../services/auth.service';
import { Friend, FriendRequests, FriendshipStatus } from '../../models/friendship.model';
import { User } from '../../models/user.model';

@Component({
  standalone: true,
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.scss'],
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatTabsModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatToolbarModule
  ]
})
export class FriendsComponent implements OnInit {
  friends: Friend[] = [];
  friendRequests: FriendRequests = { sent: [], received: [] };
  currentUser: User | null = null;
  loading = true;
  FriendshipStatus = FriendshipStatus; // Expose enum to template

  constructor(
    private friendshipService: FriendshipService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.loadFriends();
        this.loadFriendRequests();
      }
    });
  }

  private loadFriends(): void {
    this.friendshipService.getFriends().subscribe({
      next: (friends) => {
        this.friends = friends;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading friends:', error);
        this.snackBar.open('Error loading friends', 'Close', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  private loadFriendRequests(): void {
    this.friendshipService.getFriendRequests().subscribe({
      next: (requests) => {
        this.friendRequests = requests;
      },
      error: (error) => {
        console.error('Error loading friend requests:', error);
        this.snackBar.open('Error loading friend requests', 'Close', { duration: 3000 });
      }
    });
  }

  respondToFriendRequest(friendshipId: string, status: FriendshipStatus): void {
    this.friendshipService.respondToFriendRequest(friendshipId, { status }).subscribe({
      next: (response) => {
        const statusText = status === 'ACCEPTED' ? 'accepted' : 'declined';
        this.snackBar.open(`Friend request ${statusText}`, 'Close', { duration: 3000 });
        
        // Reload data
        this.loadFriends();
        this.loadFriendRequests();
      },
      error: (error) => {
        this.snackBar.open('Error responding to friend request', 'Close', { duration: 3000 });
      }
    });
  }

  removeFriend(friendshipId: string): void {
    if (confirm('Are you sure you want to remove this friend?')) {
      this.friendshipService.removeFriend(friendshipId).subscribe({
        next: () => {
          this.snackBar.open('Friend removed', 'Close', { duration: 3000 });
          this.loadFriends();
        },
        error: (error) => {
          this.snackBar.open('Error removing friend', 'Close', { duration: 3000 });
        }
      });
    }
  }

  messageUser(userId: string): void {
    // TODO: Navigate to messages with this user
    this.router.navigate(['/messages'], { queryParams: { userId } });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}