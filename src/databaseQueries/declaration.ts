export type UserDetails = {
    id: string;
    email: string;
    password: string;
}

export enum TaskStatus {
    ToDo = 'To Do',
    InProgress = 'In Progress',
    Done = 'Done',
}

export type TaskDetails = {
    id: string;
    title: string;
    description: string;
    status: TaskStatus;
    user_id: string;
}