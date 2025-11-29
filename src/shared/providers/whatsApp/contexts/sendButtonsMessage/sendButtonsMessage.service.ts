import { HttpService } from '@nestjs/axios';
import { BadGatewayException, Injectable, Logger } from '@nestjs/common';
import { CODE_MESSAGE, MESSAGES } from '@shared/constants';
import {
  Channels,
  MessageButtonTypes,
  MessageInteractiveTypes,
  MessageTypes,
} from '@shared/enums';
import {
  IButtonMessage,
  IWhatsAppButton,
  IWhatsAppButtonsMessagePayload,
} from '@shared/interfaces';
import { snakeKeys } from 'js-convert-case';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class SendButtonsMessageService {
  constructor(private readonly httpService: HttpService) {}

  private readonly logger = new Logger(SendButtonsMessageService.name);

  async execute({ to, message, buttons }: IButtonMessage) {
    try {
      const whatsAppButtons: IWhatsAppButton[] = buttons.map((button) => ({
        type: MessageButtonTypes.REPLY,
        reply: {
          id: button.id,
          title: button.title,
        },
      }));

      const payload: IWhatsAppButtonsMessagePayload = {
        messagingProduct: Channels.WHATSAPP,
        to,
        type: MessageTypes.INTERACTIVE,
        interactive: {
          type: MessageInteractiveTypes.BUTTON,
          body: { text: message },
          action: {
            buttons: whatsAppButtons,
          },
        },
      };

      const response = await firstValueFrom(
        this.httpService.post(
          MESSAGES,
          snakeKeys(payload, { recursive: true, recursiveInArray: true }),
        ),
      );

      return response.data;
    } catch (error) {
      this.logger.error(error.response?.data || error.message);

      throw new BadGatewayException(CODE_MESSAGE.SOMETHING_WRONG_HAPPENED);
    }
  }
}
