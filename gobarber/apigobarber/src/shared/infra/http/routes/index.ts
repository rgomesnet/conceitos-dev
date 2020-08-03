import { Router } from 'express';
import appointmentsRouter from '@models/appointments/infra/http/routes/appointments.routes';
import providersRouter from '@models/appointments/infra/http/routes/providers.routes';
import usersRouter from '@models/users/infra/http/routes/users.routes';
import sessionsRouter from '@models/users/infra/http/routes/sessions.routes';
import passwordRouter from '@models/users/infra/http/routes/password.routes';
import profileRouter from '@models/users/infra/http/routes/profile.routes'
const routes = Router();

routes.use('/appointments', appointmentsRouter);
routes.use('/providers', providersRouter);
routes.use('/users', usersRouter);
routes.use('/sessions', sessionsRouter);
routes.use('/password', passwordRouter);
routes.use('/profile', profileRouter);

export default routes;
