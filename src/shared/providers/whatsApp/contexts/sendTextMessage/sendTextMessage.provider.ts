import { HttpService } from '@nestjs/axios';
import { BadGatewayException, Injectable, Logger } from '@nestjs/common';
import { CODE_MESSAGE, MESSAGES } from '@shared/constants';
import { Channels, MessageTypes } from '@shared/enums';
import { IWhatsAppMessage } from '@shared/interfaces';
import { snakeKeys } from 'js-convert-case';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class SendTextMessageProvider {
  constructor(private readonly httpService: HttpService) {}

  private readonly logger = new Logger(SendTextMessageProvider.name);

  async execute(to: string, message: string) {
    try {
      const payload: IWhatsAppMessage = {
        messagingProduct: Channels.WHATSAPP,
        to,
        type: MessageTypes.TEXT,
        text: { body: message },
      };

      const response = await firstValueFrom(
        this.httpService.post(MESSAGES, snakeKeys(payload)),
      );

      return response.data;
    } catch (error) {
      this.logger.error(error.response?.data || error.message);

      throw new BadGatewayException(CODE_MESSAGE.SOMETHING_WRONG_HAPPENED);
    }
  }
}
