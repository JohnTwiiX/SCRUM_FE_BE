import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Task } from '../../interfaces/task';
import { Contact } from '../../interfaces/contact';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-kanban-board-component',
  standalone: true,
  imports: [CommonModule, HttpClientModule, ReactiveFormsModule],
  templateUrl: './kanban-board-component.component.html',
  styleUrls: ['./kanban-board-component.component.scss'],
})
export class KanbanBoardComponent implements OnInit {
  todos: Task[] = [];
  inProgress: Task[] = [];
  done: Task[] = [];
  selectedTask: Task | null = null;
  taskForm: FormGroup;
  isPopupOpen = false;
  contacts: Contact[] = [];
  isLoading = true;

  constructor(private apiService: ApiService, private fb: FormBuilder) {
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      due_date: ['', Validators.required],
      category: ['', Validators.required],
      prio: [1, [Validators.required, Validators.min(1), Validators.max(5)]],
      status: ['todo', Validators.required],
      assigned_to_ids: [[]],
      subtasks_data: [[]],
      newSubtask: [''],
    });
  }

  ngOnInit(): void {
    forkJoin({
      todos: this.apiService.getTodos(),
      contacts: this.apiService.getContacts(),
    }).subscribe(({ todos, contacts }) => {
      this.contacts = contacts;
      this.categorizeTasks(todos);
      this.isLoading = false;
    });

    this.apiService.canActivate();
  }

  categorizeTasks(tasks: Task[]): void {
    this.todos = tasks.filter((task) => task.status === 'todo');
    this.inProgress = tasks.filter((task) => task.status === 'in_progress');
    this.done = tasks.filter((task) => task.status === 'done');
  }

  openPopup(task: Task): void {
    this.selectedTask = task;
    const assigned_to_ids = task.assigned_to.map((contact) => contact.id);
    this.isPopupOpen = true;
    this.taskForm.patchValue({
      ...task,
      assigned_to_ids: assigned_to_ids || [],
      subtasks_data: task.subtasks || [],
    });
  }

  closePopup(): void {
    this.isPopupOpen = false;
    this.selectedTask = null;
  }

  saveChanges(): void {
    if (this.taskForm.valid && this.selectedTask) {
      const updatedTask: Task = {
        ...this.selectedTask,
        ...this.taskForm.value,
        assigned_to_ids: this.taskForm.value.assigned_to_ids,
        subtasks_data: this.taskForm.value.subtasks_data,
      };

      this.apiService.updateTodo(updatedTask.id, updatedTask).subscribe({
        next: () => {
          this.closePopup();
          this.ngOnInit(); // Reload tasks
        },
        error: (error) => {
          console.error('There was an error!', error);
        },
      });
    }
  }

  deleteTask(taskId: number): void {
    this.apiService.deleteTodo(taskId).subscribe(() => {
      this.closePopup();
      this.ngOnInit(); // Reload tasks
    });
  }

  getContactNames(contacts: Contact[]): string {
    if (!Array.isArray(contacts)) {
      return 'Unknown';
    }
    return contacts
      .map((contact) => `${contact.first_name} ${contact.last_name}`)
      .join(', ');
  }

  getContactName(contactId: number): string {
    const contact = this.contacts.find((c) => c.id === contactId);
    return contact ? `${contact.first_name} ${contact.last_name}` : 'Unknown';
  }
  addContact(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const contactId = parseInt(selectElement.value, 10);
    if (!this.taskForm.value.assigned_to_ids.includes(contactId)) {
      this.taskForm.patchValue({
        assigned_to_ids: [...this.taskForm.value.assigned_to_ids, contactId],
      });
    }
  }

  removeContact(index: number): void {
    const assignedTo = this.taskForm.value.assigned_to_ids as number[];
    this.taskForm.patchValue({
      assigned_to_ids: assignedTo.filter((_, i) => i !== index),
    });
  }

  addSubtask(): void {
    const newSubtaskDescription = this.taskForm.value.newSubtask.trim();
    if (newSubtaskDescription) {
      const newSubtask = {
        description: newSubtaskDescription,
        state: false,
        parent_task: this.selectedTask!.id,
      };
      this.taskForm.patchValue({
        subtasks_data: [...this.taskForm.value.subtasks_data, newSubtask],
        newSubtask: '',
      });
    }
  }

  removeSubtask(subtask: any): void {
    const subtasks = this.taskForm.value.subtasks_data as any[];
    this.taskForm.patchValue({
      subtasks_data: subtasks.filter((st) => st !== subtask),
    });
  }
}
