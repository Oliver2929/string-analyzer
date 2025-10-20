import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StringsController } from '../controller/strings.controller';
import { StringsService } from '../service/strings.service';
import { AnalyzedString, AnalyzedStringSchema } from '../schema/schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AnalyzedString.name, schema: AnalyzedStringSchema },
    ]),
  ],
  controllers: [StringsController],
  providers: [StringsService],
})
export class StringsModule {}
