import { Channels } from '@shared/enums';

export interface IUnifiedMessage {
  channel: Channels;
  from: string;
  message: string;
}
