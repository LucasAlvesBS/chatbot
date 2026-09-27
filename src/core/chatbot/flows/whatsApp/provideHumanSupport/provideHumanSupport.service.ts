import { Inject, Injectable } from '@nestjs/common';
import {
  DOCTOR_REGISTRATION_NUMBER,
  NOT_FOUND,
  PROVIDERS,
  WHATSAPP_MESSAGES,
} from '@shared/constants';
import { IDatabaseProviders } from '@shared/modules/database/interfaces';
import { SendTextMessageService } from '@shared/providers/whatsApp';
import { ClearStateInSessionService } from '@shared/redis/session';
import { AppLogger } from '@shared/utils';

@Injectable()
export class ProvideHumanSupportViaWhatsAppService {
  constructor(
    @Inject(PROVIDERS.DATABASE_PROVIDER)
    private readonly db: IDatabaseProviders,
    private readonly sendTextMessageService: SendTextMessageService,
    private readonly clearStateInSessionService: ClearStateInSessionService,
  ) {}

  async execute(phoneNumber: string): Promise<void> {
    const message = WHATSAPP_MESSAGES.flow.humanSupport(phoneNumber);

    const doctor =
      await this.db.repositories.doctorRepository.getByRegistrationNumber(
        DOCTOR_REGISTRATION_NUMBER,
      );

    if (!doctor) {
      AppLogger.error(NOT_FOUND('Doctor'));

      return this.sendTextMessageService.execute({
        to: phoneNumber,
        message: WHATSAPP_MESSAGES.errors.default,
      });
    }

    await this.sendTextMessageService.execute({
      to: doctor.user.phone,
      message,
    });

    return this.clearStateInSessionService.execute(phoneNumber);
  }
}
