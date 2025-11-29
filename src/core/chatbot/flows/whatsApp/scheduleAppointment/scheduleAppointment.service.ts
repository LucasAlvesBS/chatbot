import { GetLocaleI18nForWhatsAppService } from '@core/i18n/contexts';
import { Injectable } from '@nestjs/common';
import { CACHE, LOCALES } from '@shared/constants';
import { SendInteractiveListsMessageService } from '@shared/providers/whatsApp';
import { SetStateInSessionService } from '@shared/redis/session';

@Injectable()
export class ScheduleAppointmentViaWhatsAppService {
  constructor(
    private readonly sendInteractiveListsMessageService: SendInteractiveListsMessageService,
    private readonly setStateInSession: SetStateInSessionService,
    private readonly getLocaleI18nForWhatsAppService: GetLocaleI18nForWhatsAppService,
  ) {}

  async execute(phoneNumber: string): Promise<void> {
    await this.setStateInSession.execute(phoneNumber, CACHE.SCHEDULING_STARTED);

    const { welcome } = this.getLocaleI18nForWhatsAppService.execute(
      LOCALES.PT_BR,
    );
  }
}
