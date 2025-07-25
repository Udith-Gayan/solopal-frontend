import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { Activity } from '../../models/activity.model';
import { User } from '../../models/user.model';

@Component({
  standalone: true,
  selector: 'app-activity-card',
  templateUrl: './activity-card.component.html',
  styleUrls: ['./activity-card.component.scss'],
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatChipsModule,
    MatIconModule
  ]
})
export class ActivityCardComponent {
  @Input() activity!: Activity;
  @Input() currentUser: User | null = null;
  @Output() joinActivity = new EventEmitter<string>();
  @Output() leaveActivity = new EventEmitter<string>();
  @Output() openGroupChat = new EventEmitter<string>();
  @Output() openFeedback = new EventEmitter<string>();

  getCategoryDisplay(category: string): string {
    const categoryMap: { [key: string]: string } = {
      'LUNCH': 'Lunch',
      'TRIP': 'Trip',
      'COFFEE': 'Coffee',
      'PARTY': 'Party',
      'WALK': 'Walk',
      'TRAVEL': 'Travel',
      'DINING': 'Dining',
      'SPORTS': 'Sports',
      'OUTDOOR': 'Outdoor',
      'FITNESS': 'Fitness',
      'EVENT': 'Event',
      'OTHER': 'Other'
    };
    return categoryMap[category] || category;
  }

  getVisibilityDisplay(visibility: string): string {
    const visibilityMap: { [key: string]: string } = {
      'PUBLIC': 'Public',
      'FRIENDS_ONLY': 'Friends Only',
      'PRIVATE': 'Private'
    };
    return visibilityMap[visibility] || visibility;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  isUserCreator(): boolean {
    return this.currentUser?.id === this.activity.createdByUserId;
  }

  isUserParticipant(): boolean {
    if (!this.currentUser) return false;
    return this.activity.participants.some(p => p.userId === this.currentUser!.id);
  }

  hasAvailableSpots(): boolean {
    if (!this.activity.maxParticipants) return true;
    return this.activity.currentParticipants < this.activity.maxParticipants;
  }

  getAvailableSpots(): number | string {
    if (!this.activity.maxParticipants) return '∞';
    return this.activity.maxParticipants - this.activity.currentParticipants;
  }

  canLeaveFeedback(): boolean {
    if (!this.currentUser) return false;
    const activityDate = new Date(this.activity.dateTime);
    const now = new Date();
    return activityDate < now && (this.isUserParticipant() || this.isUserCreator());
  }

  getStarArray(rating: number): number[] {
    return Array(rating).fill(0);
  }

  onJoinClick(): void {
    this.joinActivity.emit(this.activity.id);
  }

  onLeaveClick(): void {
    this.leaveActivity.emit(this.activity.id);
  }

  onMessageClick(): void {
    // TODO: Implement messaging functionality
    console.log('Message host:', this.activity.creator);
  }

  onGroupChatClick(): void {
    this.openGroupChat.emit(this.activity.id);
  }

  onFeedbackClick(): void {
    this.openFeedback.emit(this.activity.id);
  }
}