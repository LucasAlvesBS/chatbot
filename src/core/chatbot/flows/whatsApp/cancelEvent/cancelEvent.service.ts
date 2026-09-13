import env from '@config/env';
import { Inject, Injectable } from '@nestjs/common';
import { PROVIDERS, WHATSAPP_MESSAGES } from '@shared/constants';
import { IDatabaseProviders } from '@shared/modules/database/interfaces';
import { DeleteEventInCalendarService } from '@shared/providers/calendars';
import { SendTextMessageService } from '@shared/providers/whatsApp';
import { ClearStateInSessionService } from '@shared/redis/session';

@Injectable()
export class CancelEventViaWhatsAppService {
  constructor(
    @Inject(PROVIDERS.DATABASE_PROVIDER)
    private readonly db: IDatabaseProviders,
    private readonly sendTextMessageService: SendTextMessageService,
    private readonly deleteEventInCalendarService: DeleteEventInCalendarService,
    private readonly clearStateInSessionService: ClearStateInSessionService,
  ) {}

  async execute(phoneNumber: string, eventReferenceId: string): Promise<void> {
    await this.deleteEventInCalendarService.execute(
      env().google.calendarId as string,
      eventReferenceId,
    );

    await this.db.repositories.eventRepository.softDelete(eventReferenceId);

    const message = WHATSAPP_MESSAGES.flow.cancellation.success;

    await this.sendTextMessageService.execute({
      to: phoneNumber,
      message,
    });

    return this.clearStateInSessionService.execute(phoneNumber);
  }
}
