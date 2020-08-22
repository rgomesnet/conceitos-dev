import INotificationRepository from "../INotificationRepository";
import ICreateNotificationDTO from "@models/notifications/dtos/ICreateNotificationDTO";
import Notification from '../../infra/typeorm/schemas/Notification';
import { ObjectID } from 'mongodb';

export default class FakeNotificationRepository implements INotificationRepository {
    private notifications: Notification[] = [];

    public async create({ content, recipient_id }: ICreateNotificationDTO): Promise<Notification> {

        const notification = new Notification();

        Object.assign(notification, { id: new ObjectID(), content, recipient_id });

        this.notifications.push(notification);

        return notification;
    }
}