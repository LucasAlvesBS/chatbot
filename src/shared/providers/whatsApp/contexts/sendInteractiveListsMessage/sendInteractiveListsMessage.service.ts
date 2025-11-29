import { HttpService } from '@nestjs/axios';
import { BadGatewayException, Injectable, Logger } from '@nestjs/common';
import { CODE_MESSAGE, MESSAGES } from '@shared/constants';
import { Channels, MessageInteractiveTypes, MessageTypes } from '@shared/enums';
import {
  IInteractiveListMessage,
  IRowStructure,
  ISectionStrucuture,
  IWhatsAppInteractiveListPayload,
} from '@shared/interfaces';
import { snakeKeys } from 'js-convert-case';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class SendInteractiveListsMessageService {
  constructor(private readonly httpService: HttpService) {}

  private readonly logger = new Logger(SendInteractiveListsMessageService.name);

  async execute({
    to,
    message,
    buttonLabel,
    sections,
    header,
    footer,
  }: IInteractiveListMessage) {
    try {
      const whatsAppSections: ISectionStrucuture[] = sections.map(
        (section) => ({
          title: section.title,
          rows: section.rows.map(
            (row): IRowStructure => ({
              id: row.id,
              title: row.title,
              ...(row.description && { description: row.description }),
            }),
          ),
        }),
      );

      const payload: IWhatsAppInteractiveListPayload = {
        messagingProduct: Channels.WHATSAPP,
        to,
        type: MessageTypes.INTERACTIVE,
        interactive: {
          type: MessageInteractiveTypes.LIST,
          ...(header && { header: { type: MessageTypes.TEXT, text: header } }),
          body: { text: message },
          ...(footer && { footer: { text: footer } }),
          action: {
            button: buttonLabel,
            sections: whatsAppSections,
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
