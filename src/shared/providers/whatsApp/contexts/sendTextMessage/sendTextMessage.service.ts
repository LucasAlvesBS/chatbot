import { HttpService } from '@nestjs/axios';
import { BadGatewayException, Injectable, Logger } from '@nestjs/common';
import { CODE_MESSAGE, MESSAGES } from '@shared/constants';
import { Channels, MessageTypes } from '@shared/enums';
import { ISimpleMessage, IWhatsAppMessage } from '@shared/interfaces';
import { snakeKeys } from 'js-convert-case';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class SendTextMessageService {
  constructor(private readonly httpService: HttpService) {}

  private readonly logger = new Logger(SendTextMessageService.name);

  async execute({ to, message }: ISimpleMessage) {
    try {
      const payload: IWhatsAppMessage = {
        messagingProduct: Channels.WHATSAPP,
        to,
        type: MessageTypes.TEXT,
        text: { body: message },
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
