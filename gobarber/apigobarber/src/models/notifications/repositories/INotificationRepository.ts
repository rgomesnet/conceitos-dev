import ICreateNotificationDTO from "../dtos/ICreateNotificationDTO";
import Notification from '../infra/typeorm/schemas/Notification';

interface INotificationRepository {
    create(data: ICreateNotificationDTO): Promise<Notification>;
}

export default INotificationRepository;