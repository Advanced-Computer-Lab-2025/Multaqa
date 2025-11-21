export interface INotification {
    userId: string;
    type: string;
    title: string;
    message: string;
    read: boolean;
    createdAt: Date;
}