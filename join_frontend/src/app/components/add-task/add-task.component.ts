import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { Task } from '../../interfaces/task';
import { Contact } from '../../interfaces/contact';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss'],
})
export class AddTaskComponent implements OnInit {
  taskForm: FormGroup;
  contacts: Contact[] = [];

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router
  ) {
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      due_date: ['', Validators.required],
      category: ['', Validators.required],
      prio: [1, [Validators.required, Validators.min(1), Validators.max(5)]],
      status: ['todo', Validators.required],
      assigned_to_ids: [[]],
      subtasks_data: [[]],
    });
  }

  ngOnInit(): void {
    this.apiService.getContacts().subscribe((contacts) => {
      this.contacts = contacts;
    });
  }

  getContactName(contactId: number): string {
    const contact = this.contacts.find((contact) => contact.id === contactId);
    return contact ? `${contact.first_name} ${contact.last_name}` : '';
  }

  addContact(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const contactId = Number(selectElement.value);
    if (!this.taskForm.value.assigned_to_ids.includes(contactId)) {
      this.taskForm.value.assigned_to_ids.push(contactId);
    }
  }

  removeContact(index: number): void {
    this.taskForm.value.assigned_to_ids.splice(index, 1);
  }

  addSubtask(description: string): void {
    if (description) {
      this.taskForm.value.subtasks_data.push({ description, state: false });
    }
  }

  removeSubtask(index: number): void {
    this.taskForm.value.subtasks_data.splice(index, 1);
  }

  onSubmit(): void {
    if (this.taskForm.valid) {
      const newTask: Task = {
        ...this.taskForm.value,
        assigned_to_ids: this.taskForm.value.assigned_to_ids,
        subtasks_data: this.taskForm.value.subtasks_data,
      };
      this.apiService.createTodo(newTask).subscribe(() => {
        this.router.navigate(['/board']);
      });
    }
  }
}
