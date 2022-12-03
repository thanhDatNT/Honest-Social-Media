export interface INotification {
  type: number;
  triggerUser: INotificationTriggerUser;
  date: Date;
}

export interface INotificationTriggerUser {
  id: number;
  avatar: string;
  firstName: string;
  lastName: string;
}
