import Notification from '../schemas/Notification';
import INotificationRepository from "@models/notifications/repositories/INotificationRepository";
import ICreateNotificationDTO from "@models/notifications/dtos/ICreateNotificationDTO";
import { Repository, getMongoRepository, MongoRepository } from "typeorm";

class NotificationRepository implements INotificationRepository {
    private ormRepository: MongoRepository<Notification>;

    constructor() {
        this.ormRepository = getMongoRepository(Notification, 'mongo');
    }

    public async create({
        content,
        recipient_id }: ICreateNotificationDTO): Promise<Notification> {

        const notification = this.ormRepository.create({
            content,
            recipient_id,
        });

        await this.ormRepository.save(notification);

        return notification;
    }
}

export default NotificationRepository;