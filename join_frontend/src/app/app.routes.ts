import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { KanbanBoardComponent } from './components/kanban-board-component/kanban-board-component.component';
import { AddTaskComponent } from './components/add-task/add-task.component';
import { CreateContactComponent } from './components/create-contact/create-contact.component';
import { ApiService } from './services/api.service';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'board', component: KanbanBoardComponent, canActivate: [ApiService] },
  { path: 'addTask', component: AddTaskComponent, canActivate: [ApiService] },
  {
    path: 'createContacts',
    component: CreateContactComponent,
    canActivate: [ApiService],
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
];
