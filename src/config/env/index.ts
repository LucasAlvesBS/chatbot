import 'dotenv/config';

import { applicationEnvs } from './application.env';
import { bullMQEnvs } from './bullMQ.env';
import { googleEnvs } from './google.env';
import { whatsAppEnvs } from './whatsApp.env';

const application = applicationEnvs();
const bullMQ = bullMQEnvs();
const google = googleEnvs();
const whatsApp = whatsAppEnvs();

export default () =>
  ({
    application,
    bullMQ,
    google,
    whatsApp,
  }) as const;
