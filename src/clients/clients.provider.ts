import { Provider } from '@nestjs/common';
import { Clients } from './clients.service';

export const ClientsProviders: Provider[] = [Clients];