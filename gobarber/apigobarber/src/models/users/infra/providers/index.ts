import { container } from 'tsyringe';

import IHashProvider from '@models/users/infra/providers/HashProvider/models/IHashProvider';
import BCryptHashProvider from '@models/users/infra/providers/HashProvider/implementations/BCryptHashProvider';

container.registerSingleton<IHashProvider>(
  'HashProvider',
  BCryptHashProvider
);
