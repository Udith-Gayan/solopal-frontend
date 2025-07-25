import { Routes } from '@angular/router';
import { LandingComponent } from './components/landing/landing.component';
import { ActivitiesComponent } from './components/activities/activities.component';
import { CreateActivityComponent } from './components/create-activity/create-activity.component';
import { ProfileComponent } from './components/profile/profile.component';
import { MessagesComponent } from './components/messages/messages.component';
import { FriendsComponent } from './components/friends/friends.component';
import { MyActivitiesComponent } from './components/my-activities/my-activities.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'activities', component: ActivitiesComponent },
  { path: 'create-activity', component: CreateActivityComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'messages', component: MessagesComponent, canActivate: [AuthGuard] },
  { path: 'friends', component: FriendsComponent, canActivate: [AuthGuard] },
  { path: 'my-activities', component: MyActivitiesComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '' }
];
