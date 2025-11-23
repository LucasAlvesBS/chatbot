import 'dotenv/config';

import { applicationEnvs } from './application.env';
import { bullMQEnvs } from './bullMQ.env';
import { whatsAppEnvs } from './whatsApp.env';

const application = applicationEnvs();
const bullMQ = bullMQEnvs();
const whatsApp = whatsAppEnvs();

export default () =>
  ({
    application,
    bullMQ,
    whatsApp,
  }) as const;
