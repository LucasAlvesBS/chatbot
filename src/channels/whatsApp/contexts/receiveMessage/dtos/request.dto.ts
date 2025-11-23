import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  Exclude,
  Expose,
  plainToClassFromExist,
  Type,
} from 'class-transformer';
import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { camelKeys } from 'js-convert-case';

export class ButtonInReceivedMessageDTO {
  @Expose()
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  payload?: string;

  @Expose()
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  text?: string;
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
  @ApiPropertyOptional({ type: () => TextInReceivedMessageDTO })
  @ValidateNested()
  @Type(() => TextInReceivedMessageDTO)
  @IsOptional()
  text?: TextInReceivedMessageDTO;

  @Expose()
  @ApiPropertyOptional({ type: () => ButtonInReceivedMessageDTO })
  @ValidateNested()
  @Type(() => ButtonInReceivedMessageDTO)
  @IsOptional()
  button?: ButtonInReceivedMessageDTO;
}

export class ContactInReceivedMessageDTO {
  @Expose()
  @ApiProperty({ type: String })
  @IsString()
  waId: string;

  @Expose()
  @ApiProperty()
  @Type(() => Object)
  profile: {
    name: string;
  };
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
  @ApiProperty({ isArray: true, type: ContactInReceivedMessageDTO })
  @Type(() => ContactInReceivedMessageDTO)
  @ValidateNested({ each: true })
  contacts: ContactInReceivedMessageDTO[];

  @Expose()
  @ApiProperty({ isArray: true, type: MessageInReceivedMessageDTO })
  @Type(() => MessageInReceivedMessageDTO)
  @ValidateNested({ each: true })
  messages: MessageInReceivedMessageDTO[];
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

  constructor(dto: ReceiveWhatsAppMessageRequestDTO) {
    plainToClassFromExist(this, camelKeys(dto), {
      excludeExtraneousValues: true,
    });
  }
}

/* {
  "object": "whatsapp_business_account",
  "entry": [
    {
      "id": "102290129340398",
      "changes": [
        {
          "value": {
            "messaging_product": "whatsapp",
            "metadata": {
              "display_phone_number": "15550783881",
              "phone_number_id": "106540352242922"
            },
            "contacts": [
              {
                "profile": {
                  "name": "Sheena Nelson"
                },
                "wa_id": "16505551234"
              }
            ],
            "messages": [
              {
                "from": "16505551234",
                "id": "wamid.HBgLMTY1MDM4Nzk0MzkVAgASGBQzQTRBNjU5OUFFRTAzODEwMTQ0RgA=",
                "timestamp": "1749416383",
                "type": "text"
                "text": {
                  "body": "Does it come in another color?"
                }
              }
            ]
          },
          "field": "messages"
        }
      ]
    }
  ]
} */
