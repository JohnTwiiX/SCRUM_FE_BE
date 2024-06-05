export interface Subtask {
  id?: number;
  title: string;
  parent_task?: number;
  state: boolean;
}
