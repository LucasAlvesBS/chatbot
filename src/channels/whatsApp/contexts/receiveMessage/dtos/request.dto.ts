import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import {
  IsBoolean,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class ButtonReplyInReceivedMessageDTO {
  @Expose()
  @ApiProperty()
  @IsString()
  id: string;

  @Expose()
  @ApiProperty()
  @IsString()
  title: string;
}

export class InteractiveInReceivedMessageDTO {
  @Expose()
  @ApiProperty()
  @IsString()
  type: string;

  @Expose()
  @ApiProperty({ type: ButtonReplyInReceivedMessageDTO })
  @ValidateNested()
  @Type(() => ButtonReplyInReceivedMessageDTO)
  buttonReply: ButtonReplyInReceivedMessageDTO;
}

export class TextInReceivedMessageDTO {
  @Expose()
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  body?: string;
}

export class MessageInReceivedMessageDTO {
  @Expose()
  @ApiProperty()
  @IsString()
  from: string;

  @Expose()
  @ApiProperty()
  @IsString()
  id: string;

  @Expose()
  @ApiProperty()
  @IsString()
  timestamp: string;

  @Expose()
  @ApiProperty()
  @IsString()
  type: string;

  @Expose()
  @ApiPropertyOptional({ type: TextInReceivedMessageDTO })
  @ValidateNested()
  @Type(() => TextInReceivedMessageDTO)
  @IsOptional()
  text?: TextInReceivedMessageDTO;

  @Expose()
  @ApiPropertyOptional({ type: InteractiveInReceivedMessageDTO })
  @ValidateNested()
  @Type(() => InteractiveInReceivedMessageDTO)
  @IsOptional()
  interactive?: InteractiveInReceivedMessageDTO;
}

export class NameInReceivedMessageDTO {
  @Expose()
  @ApiPropertyOptional()
  @IsString()
  name: string;
}

export class ContactsInReceivedMessageDTO {
  @Expose()
  @ApiProperty()
  @IsString()
  waId: string;

  @Expose()
  @ApiProperty({ type: NameInReceivedMessageDTO })
  @Type(() => NameInReceivedMessageDTO)
  @ValidateNested()
  profile: NameInReceivedMessageDTO;
}

export class PricingInReceivedMessageDTO {
  @Expose()
  @ApiPropertyOptional()
  @IsBoolean()
  billable: boolean;

  @Expose()
  @ApiPropertyOptional()
  @IsString()
  pricingModel: string;

  @Expose()
  @ApiPropertyOptional()
  @IsString()
  category: string;

  @Expose()
  @ApiPropertyOptional()
  @IsString()
  type: string;
}

export class StatusesInReceivedMessageDTO {
  @Expose()
  @ApiPropertyOptional()
  @IsString()
  id: string;

  @Expose()
  @ApiPropertyOptional()
  @IsString()
  status: string;

  @Expose()
  @ApiPropertyOptional()
  @IsString()
  timestamp: string;

  @Expose()
  @ApiPropertyOptional()
  @IsString()
  recipientId: string;

  @Expose()
  @ApiPropertyOptional({ type: PricingInReceivedMessageDTO })
  @Type(() => PricingInReceivedMessageDTO)
  @ValidateNested()
  pricing: PricingInReceivedMessageDTO;
}

export class MetadataInReceivedMessageDTO {
  @Expose()
  @ApiProperty()
  @IsString()
  displayPhoneNumber: string;

  @Expose()
  @ApiProperty()
  @IsString()
  phoneNumberId: string;
}

class ValueOfChangesInReceivedMessageDTO {
  @Expose()
  @ApiProperty()
  @IsString()
  messagingProduct: string;

  @Expose()
  @ApiProperty({ type: MetadataInReceivedMessageDTO })
  @Type(() => MetadataInReceivedMessageDTO)
  @ValidateNested()
  metadata: MetadataInReceivedMessageDTO;

  @Expose()
  @ApiPropertyOptional({ isArray: true, type: StatusesInReceivedMessageDTO })
  @Type(() => StatusesInReceivedMessageDTO)
  @ValidateNested({ each: true })
  statuses?: StatusesInReceivedMessageDTO[];

  @Expose()
  @ApiProperty({ isArray: true, type: ContactsInReceivedMessageDTO })
  @Type(() => ContactsInReceivedMessageDTO)
  @ValidateNested({ each: true })
  contacts?: ContactsInReceivedMessageDTO[];

  @Expose()
  @ApiProperty({ isArray: true, type: MessageInReceivedMessageDTO })
  @Type(() => MessageInReceivedMessageDTO)
  @ValidateNested({ each: true })
  messages?: MessageInReceivedMessageDTO[];
}

class ChangesOfEntryInReceivedMessageDTO {
  @Expose()
  @ApiProperty()
  @IsString()
  @Type(() => ValueOfChangesInReceivedMessageDTO)
  value: ValueOfChangesInReceivedMessageDTO;

  @Expose()
  @ApiProperty()
  @IsString()
  field: string;
}

class EntryInReceivedMessageDTO {
  @Expose()
  @ApiProperty()
  @IsString()
  id: string;

  @Expose()
  @ApiProperty({ isArray: true, type: ChangesOfEntryInReceivedMessageDTO })
  @Type(() => ChangesOfEntryInReceivedMessageDTO)
  @ValidateNested({ each: true })
  changes: ChangesOfEntryInReceivedMessageDTO[];
}

@Exclude()
export class ReceiveWhatsAppMessageRequestDTO {
  @Expose()
  @ApiProperty()
  @IsString()
  object: string;

  @Expose()
  @ApiProperty({ isArray: true, type: EntryInReceivedMessageDTO })
  @Type(() => EntryInReceivedMessageDTO)
  @ValidateNested({ each: true })
  entry: EntryInReceivedMessageDTO[];
}
