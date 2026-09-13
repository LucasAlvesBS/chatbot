import { HttpService } from '@nestjs/axios';
import { BadGatewayException, Injectable, Logger } from '@nestjs/common';
import { CODE_MESSAGE, MESSAGES } from '@shared/constants';
import { Channels, MessageTypes } from '@shared/enums';
import { ISimpleMessage, IWhatsAppMessage } from '@shared/interfaces';
import axios from 'axios';
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

      await firstValueFrom(
        this.httpService.post(
          MESSAGES,
          snakeKeys(payload, { recursive: true, recursiveInArray: true }),
        ),
      );
    } catch (error) {
      if (axios.isAxiosError(error)) {
        this.logger.error(error.response?.data || error.message);
      } else if (error instanceof Error) {
        this.logger.error(error.message);
      } else {
        this.logger.error(error);
      }

      throw new BadGatewayException(CODE_MESSAGE.SOMETHING_WRONG_HAPPENED);
    }
  }
}
