import { Request, Response } from 'express';
import { container } from 'tsyringe';
import CreateAppointmentService from "@models/appointments/services/CreateAppointmentService";
import { parseISO } from "date-fns";

export default class AppointmentController {

  public async create(request: Request, response: Response): Promise<Response> {
    const { provider_id, date } = request.body;
    const user_id = request.user.id;

    const service = container.resolve(CreateAppointmentService);

    const parsedDate = parseISO(date);
    const appointment = await service.execute({
      date: parsedDate,
      user_id,
      provider_id,
    });

    return response.json(appointment);
  }
}