import {
  CancelEventViaWhatsAppService,
  ConfirmCancellationOfEventViaWhatsAppService,
  GetDocumentNumberViaWhatsAppService,
  GetUserNameViaWhatsAppService,
  ProvideHumanSupportViaWhatsAppService,
  ScheduleEventViaWhatsAppService,
  SelectDayViaWhatsAppService,
  SelectHourViaWhatsAppService,
  SelectMonthViaWhatsAppService,
  SendWelcomeMenuViaWhatsAppService,
} from '@core/chatbot/flows/whatsApp';
import { Injectable } from '@nestjs/common';
import { STATES, WHATSAPP_BUTTONS } from '@shared/constants';
import { Languages } from '@shared/enums';
import { IUnifiedMessage } from '@shared/interfaces';
import { GetStateInSessionService } from '@shared/redis/session';

@Injectable()
export class WhatsAppChatbotService {
  constructor(
    private readonly sendWelcomeMenuViaWhatsAppService: SendWelcomeMenuViaWhatsAppService,
    private readonly getDocumentNumberViaWhatsAppService: GetDocumentNumberViaWhatsAppService,
    private readonly getUserNameViaWhatsAppService: GetUserNameViaWhatsAppService,
    private readonly selectDayViaWhatsAppService: SelectDayViaWhatsAppService,
    private readonly selectHourViaWhatsAppService: SelectHourViaWhatsAppService,
    private readonly selectMonthViaWhatsAppService: SelectMonthViaWhatsAppService,
    private readonly scheduleEventViaWhatsAppService: ScheduleEventViaWhatsAppService,
    private readonly confirmCancellationOfEventViaWhatsAppService: ConfirmCancellationOfEventViaWhatsAppService,
    private readonly cancelEventViaWhatsAppService: CancelEventViaWhatsAppService,
    private readonly provideHumanSupportViaWhatsAppService: ProvideHumanSupportViaWhatsAppService,
    private readonly getStateInSession: GetStateInSessionService,
  ) {}

  async execute(
    unifiedMessage: IUnifiedMessage,
    lang = Languages.PT,
  ): Promise<void> {
    const { senderPhoneNumber, replyId, message } = unifiedMessage;

    const session = await this.getStateInSession.execute(senderPhoneNumber);

    if (!session?.state) {
      return this.sendWelcomeMenuViaWhatsAppService.execute(senderPhoneNumber);
    }

    const { state, userName, documentNumber, eventReferenceId } = session;

    switch (state) {
      case STATES.MENU_SENT:
        return this.handleMenuSelection(replyId as string, senderPhoneNumber);

      case STATES.REQUESTED_DOCUMENT_NUMBER_FOR_SCHEDULING:
        return this.getUserNameViaWhatsAppService.execute(
          senderPhoneNumber,
          message as string,
        );

      case STATES.REQUESTED_USER_NAME:
        return this.selectMonthViaWhatsAppService.execute(
          senderPhoneNumber,
          (message ?? userName) as string,
        );

      case STATES.SELECTED_MONTH:
        return this.selectDayViaWhatsAppService.execute(
          senderPhoneNumber,
          replyId as string,
          userName as string,
        );

      case STATES.SELECTED_DAY:
        return this.selectHourViaWhatsAppService.execute(
          senderPhoneNumber,
          replyId as string,
          userName as string,
        );

      case STATES.SELECTED_HOUR:
        return this.scheduleEventViaWhatsAppService.execute(
          senderPhoneNumber,
          documentNumber as string,
          userName as string,
          replyId as string,
          lang,
        );

      case STATES.REQUESTED_DOCUMENT_NUMBER_FOR_CANCELLATION:
        return this.confirmCancellationOfEventViaWhatsAppService.execute(
          senderPhoneNumber,
          message as string,
        );

      case STATES.CONFIRMED_EVENT_CANCELLATION:
        return this.cancelEventViaWhatsAppService.execute(
          senderPhoneNumber,
          eventReferenceId as string,
        );
    }
  }

  private handleMenuSelection(replyId: string, phoneNumber: string) {
    const homeMenu = WHATSAPP_BUTTONS.homeMenu;

    const scheduling = homeMenu[0].id;
    const cancellation = homeMenu[1].id;
    const humanService = homeMenu[2].id;

    switch (replyId) {
      case scheduling:
        return this.getDocumentNumberViaWhatsAppService.execute(
          phoneNumber,
          STATES.REQUESTED_DOCUMENT_NUMBER_FOR_SCHEDULING,
        );

      case cancellation:
        return this.getDocumentNumberViaWhatsAppService.execute(
          phoneNumber,
          STATES.REQUESTED_DOCUMENT_NUMBER_FOR_CANCELLATION,
        );

      case humanService:
        return this.provideHumanSupportViaWhatsAppService.execute(phoneNumber);
    }
  }
}
