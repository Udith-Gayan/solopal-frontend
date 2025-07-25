import { Component, OnInit, Inject, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { GroupChatService } from '../../services/group-chat.service';
import { AuthService } from '../../services/auth.service';
import { GroupChat, GroupMessage } from '../../models/group-chat.model';
import { User } from '../../models/user.model';

@Component({
  standalone: true,
  selector: 'app-group-chat',
  templateUrl: './group-chat.component.html',
  styleUrls: ['./group-chat.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatMenuModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ]
})
export class GroupChatComponent implements OnInit, AfterViewChecked {
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;

  groupChat: GroupChat | null = null;
  currentUser: User | null = null;
  messageForm: FormGroup;
  sendingMessage = false;
  showMembers = false;
  isCurrentUserAdmin = false;
  private shouldScrollToBottom = false;

  constructor(
    private fb: FormBuilder,
    private groupChatService: GroupChatService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<GroupChatComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { activityId: string }
  ) {
    this.messageForm = this.fb.group({
      content: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    this.loadGroupChat();
  }

  ngAfterViewChecked(): void {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }
  }

  private loadGroupChat(): void {
    this.groupChatService.getActivityGroupChat(this.data.activityId).subscribe({
      next: (groupChat) => {
        this.groupChat = groupChat;
        this.checkIfCurrentUserIsAdmin();
        this.shouldScrollToBottom = true;
      },
      error: (error) => {
        if (error.status === 404) {
          // Group chat doesn't exist, create it
          this.createGroupChat();
        } else {
          this.snackBar.open('Error loading group chat', 'Close', { duration: 3000 });
        }
      }
    });
  }

  private createGroupChat(): void {
    this.groupChatService.createGroupChat({ activityId: this.data.activityId }).subscribe({
      next: (groupChat) => {
        this.groupChat = groupChat;
        this.checkIfCurrentUserIsAdmin();
        this.shouldScrollToBottom = true;
      },
      error: (error) => {
        this.snackBar.open('Error creating group chat', 'Close', { duration: 3000 });
      }
    });
  }

  private checkIfCurrentUserIsAdmin(): void {
    if (this.groupChat && this.currentUser) {
      const currentUserMember = this.groupChat.members.find(m => m.userId === this.currentUser!.id);
      this.isCurrentUserAdmin = currentUserMember?.isAdmin || false;
    }
  }

  sendMessage(): void {
    if (this.messageForm.invalid || !this.groupChat || this.sendingMessage) return;

    this.sendingMessage = true;
    const messageData = {
      content: this.messageForm.value.content,
      groupChatId: this.groupChat.id
    };

    this.groupChatService.sendGroupMessage(messageData).subscribe({
      next: (message) => {
        if (this.groupChat) {
          this.groupChat.messages.push(message);
        }
        this.messageForm.reset();
        this.sendingMessage = false;
        this.shouldScrollToBottom = true;
      },
      error: (error) => {
        this.sendingMessage = false;
        this.snackBar.open('Error sending message', 'Close', { duration: 3000 });
      }
    });
  }

  removeMember(userId: string): void {
    if (!this.groupChat) return;

    this.groupChatService.removeMemberFromGroupChat(this.groupChat.id, userId).subscribe({
      next: () => {
        if (this.groupChat) {
          this.groupChat.members = this.groupChat.members.filter(m => m.userId !== userId);
        }
        this.snackBar.open('Member removed successfully', 'Close', { duration: 3000 });
      },
      error: (error) => {
        this.snackBar.open('Error removing member', 'Close', { duration: 3000 });
      }
    });
  }

  private scrollToBottom(): void {
    if (this.messagesContainer) {
      const element = this.messagesContainer.nativeElement;
      element.scrollTop = element.scrollHeight;
    }
  }

  formatMessageTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}