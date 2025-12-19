import {
  CancelEventViaWhatsAppService,
  ConfirmCancellationOfEventViaWhatsAppService,
  GetDocumentNumberViaWhatsAppService,
  GetUserNameViaWhatsAppService,
  ScheduleEventViaWhatsAppService,
  SelectDayViaWhatsAppService,
  SelectHourViaWhatsAppService,
  SelectMonthViaWhatsAppService,
  SendWelcomeMenuViaWhatsAppService,
} from '@core/chatbot/flows/whatsApp';
import { I18nTranslations } from '@core/i18n/generated';
import { Injectable } from '@nestjs/common';
import { STATES } from '@shared/constants';
import { Languages } from '@shared/enums';
import { IUnifiedMessage } from '@shared/interfaces';
import { GetStateInSessionService } from '@shared/redis/session';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class WhatsAppChatbotService {
  constructor(
    private readonly i18nService: I18nService<I18nTranslations>,
    private readonly sendWelcomeMenuViaWhatsAppService: SendWelcomeMenuViaWhatsAppService,
    private readonly getDocumentNumberViaWhatsAppService: GetDocumentNumberViaWhatsAppService,
    private readonly getUserNameViaWhatsAppService: GetUserNameViaWhatsAppService,
    private readonly selectDayViaWhatsAppService: SelectDayViaWhatsAppService,
    private readonly selectHourViaWhatsAppService: SelectHourViaWhatsAppService,
    private readonly selectMonthViaWhatsAppService: SelectMonthViaWhatsAppService,
    private readonly scheduleEventViaWhatsAppService: ScheduleEventViaWhatsAppService,
    private readonly confirmCancellationOfEventViaWhatsAppService: ConfirmCancellationOfEventViaWhatsAppService,
    private readonly cancelEventViaWhatsAppService: CancelEventViaWhatsAppService,
    private readonly getStateInSession: GetStateInSessionService,
  ) {}

  async execute(unifiedMessage: IUnifiedMessage, lang = Languages.PT) {
    const { senderPhoneNumber, replyId, message } = unifiedMessage;

    const session = await this.getStateInSession.execute(senderPhoneNumber);

    if (!session?.state) {
      return this.sendWelcomeMenuViaWhatsAppService.execute(senderPhoneNumber);
    }

    const { state, userName, documentNumber, eventReferenceId } = session;

    switch (state) {
      case STATES.MENU_SENT:
        return this.handleMenuSelection(replyId, senderPhoneNumber, lang);

      case STATES.REQUESTED_DOCUMENT_NUMBER_FOR_SCHEDULING:
        return this.getUserNameViaWhatsAppService.execute(
          senderPhoneNumber,
          message,
          lang,
        );

      case STATES.REQUESTED_USER_NAME:
        return this.selectMonthViaWhatsAppService.execute(
          senderPhoneNumber,
          message,
          lang,
        );

      case STATES.SELECTED_MONTH:
        return this.selectDayViaWhatsAppService.execute(
          senderPhoneNumber,
          replyId,
          lang,
        );

      case STATES.SELECTED_DAY:
        return this.selectHourViaWhatsAppService.execute(
          senderPhoneNumber,
          replyId,
          lang,
        );

      case STATES.SELECTED_HOUR:
        return this.scheduleEventViaWhatsAppService.execute(
          senderPhoneNumber,
          documentNumber,
          userName,
          replyId,
          lang,
        );

      case STATES.REQUESTED_DOCUMENT_NUMBER_FOR_CANCELLATION:
        return this.confirmCancellationOfEventViaWhatsAppService.execute(
          senderPhoneNumber,
          message,
          lang,
        );

      case STATES.CONFIRMED_EVENT_CANCELLATION:
        return this.cancelEventViaWhatsAppService.execute(
          senderPhoneNumber,
          eventReferenceId,
          lang,
        );
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
        return this.getDocumentNumberViaWhatsAppService.execute(
          phoneNumber,
          STATES.REQUESTED_DOCUMENT_NUMBER_FOR_SCHEDULING,
          lang,
        );

      case cancellation:
        return this.getDocumentNumberViaWhatsAppService.execute(
          phoneNumber,
          STATES.REQUESTED_DOCUMENT_NUMBER_FOR_CANCELLATION,
          lang,
        );

      case humanService:
        console.log('send_to_human');
        return;
    }
  }
}
