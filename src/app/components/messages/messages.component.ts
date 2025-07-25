import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MessageService } from '../../services/message.service';
import { AuthService } from '../../services/auth.service';
import { Message, Conversation } from '../../models/message.model';
import { User } from '../../models/user.model';

@Component({
  standalone: true,
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatToolbarModule
  ]
})
export class MessagesComponent implements OnInit, AfterViewChecked {
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;

  conversations: Conversation[] = [];
  selectedConversation: Conversation | null = null;
  currentMessages: Message[] = [];
  currentUser: User | null = null;
  messageForm: FormGroup;
  sendingMessage = false;
  private shouldScrollToBottom = false;

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {
    this.messageForm = this.fb.group({
      content: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.loadConversations();
      }
    });
  }

  ngAfterViewChecked(): void {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }
  }

  private loadConversations(): void {
    this.messageService.getConversations().subscribe({
      next: (conversations) => {
        this.conversations = conversations;
      },
      error: (error) => {
        console.error('Error loading conversations:', error);
        this.snackBar.open('Error loading conversations', 'Close', { duration: 3000 });
      }
    });
  }

  selectConversation(conversation: Conversation): void {
    this.selectedConversation = conversation;
    this.loadConversationMessages(conversation.partner.id);
  }

  private loadConversationMessages(partnerId: string): void {
    this.messageService.getConversation(partnerId).subscribe({
      next: (messages) => {
        this.currentMessages = messages;
        this.shouldScrollToBottom = true;
      },
      error: (error) => {
        console.error('Error loading messages:', error);
        this.snackBar.open('Error loading messages', 'Close', { duration: 3000 });
      }
    });
  }

  sendMessage(): void {
    if (this.messageForm.invalid || !this.selectedConversation || this.sendingMessage) return;

    this.sendingMessage = true;
    const messageData = {
      content: this.messageForm.value.content,
      receiverId: this.selectedConversation.partner.id
    };

    this.messageService.sendMessage(messageData).subscribe({
      next: (message) => {
        this.currentMessages.push(message);
        this.messageForm.reset();
        this.sendingMessage = false;
        this.shouldScrollToBottom = true;
        
        // Update the conversation in the list
        this.updateConversationLastMessage(message);
      },
      error: (error) => {
        this.sendingMessage = false;
        this.snackBar.open('Error sending message', 'Close', { duration: 3000 });
      }
    });
  }

  private updateConversationLastMessage(message: Message): void {
    if (this.selectedConversation) {
      this.selectedConversation.lastMessage = message;
      
      // Move conversation to top of list
      const index = this.conversations.findIndex(c => c.partner.id === this.selectedConversation!.partner.id);
      if (index > 0) {
        const conversation = this.conversations.splice(index, 1)[0];
        this.conversations.unshift(conversation);
      }
    }
  }

  private scrollToBottom(): void {
    if (this.messagesContainer) {
      const element = this.messagesContainer.nativeElement;
      element.scrollTop = element.scrollHeight;
    }
  }

  formatMessageTime(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } else if (diffInHours < 24 * 7) {
      return date.toLocaleDateString('en-US', {
        weekday: 'short'
      });
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
    }
  }
}