import { HttpService } from '@nestjs/axios';
import { BadGatewayException, Injectable, Logger } from '@nestjs/common';
import { CODE_MESSAGE, MESSAGES } from '@shared/constants';
import { Channels, MessageTypes } from '@shared/enums';
import { IButtonMessage, IWhatsAppButtonsMessage } from '@shared/interfaces';
import { snakeKeys } from 'js-convert-case';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class SendButtonsMessageProvider {
  constructor(private readonly httpService: HttpService) {}

  private readonly logger = new Logger(SendButtonsMessageProvider.name);

  async execute({ to, message, buttons }: IButtonMessage) {
    try {
      const payload: IWhatsAppButtonsMessage = {
        messagingProduct: Channels.WHATSAPP,
        to,
        type: MessageTypes.INTERACTIVE,
        interactive: {
          type: MessageTypes.BUTTON,
          body: { text: message },
          action: {
            buttons: buttons.map((button) => ({
              type: MessageTypes.REPLY,
              reply: {
                id: button.id,
                title: button.title,
              },
            })),
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
