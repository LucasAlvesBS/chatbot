import { Module } from '@nestjs/common';
import { Languages } from '@shared/enums';
import {
  AcceptLanguageResolver,
  I18nModule as NestI18nModule,
} from 'nestjs-i18n';
import { join } from 'path';

@Module({
  imports: [
    NestI18nModule.forRoot({
      fallbackLanguage: Languages.PT,
      loaderOptions: {
        path: join(__dirname, 'languages/'),
        languages: [Languages.PT],
        watch: true,
      },
      typesOutputPath: join(
        process.cwd(),
        'src/core/i18n/generated/i18n.generated.ts',
      ),
      resolvers: [AcceptLanguageResolver],
    }),
  ],
  providers: [],
  exports: [],
})
export class I18nModule {}
