import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { API_TAGS, VERSIONS } from '@shared/constants';
import { Public } from '@shared/decorators';

import { CheckService } from './check.service';
import { HealthCheckResponseDTO } from './dtos';

@Public()
@ApiTags(API_TAGS.HEALTH)
@Controller({ version: VERSIONS.API })
export class CheckController {
  constructor(private checkService: CheckService) {}

  @ApiOperation({ summary: 'Health Check' })
  @ApiOkResponse({ description: 'Health Check', type: HealthCheckResponseDTO })
  @Get()
  handle() {
    return this.checkService.execute();
  }
}
