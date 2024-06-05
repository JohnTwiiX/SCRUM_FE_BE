import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from '../interfaces/task';
import { Contact } from '../interfaces/contact';
import { Subtask } from '../interfaces/subtask';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = 'http://localhost:8000/api/';
  private usersUrl = 'http://localhost:8000/users/';
  loggedInStatus = false;

  constructor(private http: HttpClient, private router: Router) {}

  getTodos(): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}todos/`);
  }

  getTodo(id: number): Observable<Task> {
    return this.http.get<Task>(`${this.apiUrl}todos/${id}/`);
  }

  createTodo(todo: Task): Observable<Task> {
    return this.http.post<Task>(`${this.apiUrl}todos/`, todo);
  }
  updateTodo(id: number, task: any): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}todos/${id}/`, task);
  }

  deleteTodo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}todos/${id}/`);
  }

  getContacts(): Observable<Contact[]> {
    return this.http.get<Contact[]>(`${this.apiUrl}contacts/`);
  }

  getContact(id: number): Observable<Contact> {
    return this.http.get<Contact>(`${this.apiUrl}contacts/${id}/`);
  }

  createContact(contact: Contact): Observable<Contact> {
    return this.http.post<Contact>(`${this.apiUrl}contacts/`, contact);
  }

  updateContact(id: number, contact: Contact): Observable<Contact> {
    return this.http.put<Contact>(`${this.apiUrl}contacts/${id}/`, contact);
  }

  deleteContact(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}contacts/${id}/`);
  }

  getSubtasks(): Observable<Subtask[]> {
    return this.http.get<Subtask[]>(`${this.apiUrl}subtasks/`);
  }

  getSubtask(id: number): Observable<Subtask> {
    return this.http.get<Subtask>(`${this.apiUrl}subtasks/${id}/`);
  }

  createSubtask(subtask: Subtask): Observable<Subtask> {
    return this.http.post<Subtask>(`${this.apiUrl}subtasks/`, subtask);
  }

  updateSubtask(id: number, subtask: Subtask): Observable<Subtask> {
    return this.http.put<Subtask>(`${this.apiUrl}subtasks/${id}/`, subtask);
  }

  deleteSubtask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}subtasks/${id}/`);
  }

  login(credentials: { username: string; password: string }): Observable<any> {
    return this.http.post(`http://localhost:8000/users/login/`, credentials);
  }

  register(data: {
    username: string;
    email: string;
    password: string;
  }): Observable<any> {
    return this.http.post(`http://localhost:8000/users/register/`, data);
  }

  canActivate(): boolean {
    if (this.loggedInStatus) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
