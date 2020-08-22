import { Request, Response } from 'express';
import { container } from 'tsyringe';
import CreateAppointmentService from "@models/appointments/services/CreateAppointmentService";

export default class AppointmentController {

  public async create(request: Request, response: Response): Promise<Response> {
    const { provider_id, date } = request.body;
    const user_id = request.user.id;

    const service = container.resolve(CreateAppointmentService);

    const appointment = await service.execute({
      date,
      user_id,
      provider_id,
    });

    return response.json(appointment);
  }
}