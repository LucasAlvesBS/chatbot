import 'dotenv/config';

import { applicationEnvs } from './application.env';
import { bullMQEnvs } from './bullMQ.env';
import { businessEnvs } from './business.env';
import { googleEnvs } from './google.env';
import { whatsAppEnvs } from './whatsApp.env';

const application = applicationEnvs();
const bullMQ = bullMQEnvs();
const business = businessEnvs();
const google = googleEnvs();
const whatsApp = whatsAppEnvs();

export default () =>
  ({
    application,
    bullMQ,
    business,
    google,
    whatsApp,
  }) as const;
