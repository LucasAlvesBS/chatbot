import env from '@config/env';
import { I18nTranslations } from '@core/i18n/generated';
import { Inject, Injectable } from '@nestjs/common';
import { PROVIDERS } from '@shared/constants';
import { Languages } from '@shared/enums';
import { IDatabaseProviders } from '@shared/modules/database/interfaces';
import { DeleteEventInCalendarService } from '@shared/providers/calendars';
import { SendTextMessageService } from '@shared/providers/whatsApp';
import { ClearStateInSessionService } from '@shared/redis/session';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class CancelEventViaWhatsAppService {
  constructor(
    @Inject(PROVIDERS.DATABASE_PROVIDER)
    private readonly db: IDatabaseProviders,
    private readonly i18nService: I18nService<I18nTranslations>,
    private readonly sendTextMessageService: SendTextMessageService,
    private readonly deleteEventInCalendarService: DeleteEventInCalendarService,
    private readonly clearStateInSessionService: ClearStateInSessionService,
  ) {}

  async execute(
    phoneNumber: string,
    eventReferenceId: string,
    lang: Languages,
  ): Promise<void> {
    await this.deleteEventInCalendarService.execute(
      env().google.calendarId,
      eventReferenceId,
    );

    await this.db.repositories.eventRepository.softDelete(eventReferenceId);

    const message = this.i18nService.t('messages.flow.cancellation.success', {
      lang,
    });

    await this.sendTextMessageService.execute({
      to: phoneNumber,
      message,
    });

    return this.clearStateInSessionService.execute(phoneNumber);
  }
}
