import {
  SelectAppointmentDayViaWhatsAppService,
  SelectAppointmentHourViaWhatsAppService,
  SelectAppointmentMonthViaWhatsAppService,
  SendWelcomeMenuViaWhatsAppService,
} from '@core/chatbot/flows/whatsApp';
import { I18nTranslations } from '@core/i18n/generated';
import { Injectable } from '@nestjs/common';
import { CACHE } from '@shared/constants';
import { Languages } from '@shared/enums';
import { IUnifiedMessage } from '@shared/interfaces';
import { GetStateInSessionService } from '@shared/redis/session';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class WhatsAppChatbotService {
  constructor(
    private readonly i18nService: I18nService<I18nTranslations>,
    private readonly sendWelcomeMenuViaWhatsAppService: SendWelcomeMenuViaWhatsAppService,
    private readonly selectAppointmentDayViaWhatsAppService: SelectAppointmentDayViaWhatsAppService,
    private readonly selectAppointmentHourViaWhatsAppService: SelectAppointmentHourViaWhatsAppService,
    private readonly selectAppointmentMonthViaWhatsAppService: SelectAppointmentMonthViaWhatsAppService,
    private readonly getStateInSession: GetStateInSessionService,
  ) {}

  async execute(unifiedMessage: IUnifiedMessage, lang = Languages.PT) {
    const { senderPhoneNumber, replyId } = unifiedMessage;

    const state = await this.getStateInSession.execute(senderPhoneNumber);

    if (!state) {
      return this.sendWelcomeMenuViaWhatsAppService.execute(senderPhoneNumber);
    }

    switch (state) {
      case CACHE.MENU_SENT:
        return this.handleMenuSelection(replyId, senderPhoneNumber, lang);

      case CACHE.SELECTED_MONTH:
        return this.selectAppointmentDayViaWhatsAppService.execute(
          senderPhoneNumber,
          replyId,
          lang,
        );

      case CACHE.SELECTED_DAY:
        return this.selectAppointmentHourViaWhatsAppService.execute(
          senderPhoneNumber,
          replyId,
          lang,
        );

      case CACHE.SELECTED_HOUR:
        return;
    }
  }

  private handleMenuSelection(
    replyId: string,
    phoneNumber: string,
    lang: Languages,
  ) {
    const homeMenu = this.i18nService.t('buttons.homeMenu', { lang });

    const scheduling = homeMenu[0].id;
    const cancellation = homeMenu[1].id;
    const humanService = homeMenu[2].id;

    switch (replyId) {
      case scheduling:
        return this.selectAppointmentMonthViaWhatsAppService.execute(
          phoneNumber,
          lang,
        );

      case cancellation:
        console.log('flow_cancellation_started');
        return;

      case humanService:
        console.log('send_to_human');
        return;
    }
  }
}
