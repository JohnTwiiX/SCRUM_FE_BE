import { Subtask } from '../interfaces/subtask';
import { Contact } from './contact';

export interface Task {
  id: number;
  title: string;
  description: string;
  due_date: string;
  category: string;
  prio: number;
  status: string;
  assigned_to_ids: number[];
  subtasks_data: Subtask[];
  assigned_to: Contact[]; // Update to reflect the actual structure
  subtasks: Subtask[];
}
