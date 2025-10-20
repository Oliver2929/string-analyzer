import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { StringsModule } from './Strings/module/strings.module';
import * as dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI as string;

if (!MONGO_URI) {
  throw new Error('MONGO_URI not defined in .env');
}

@Module({
  imports: [MongooseModule.forRoot(MONGO_URI), StringsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
