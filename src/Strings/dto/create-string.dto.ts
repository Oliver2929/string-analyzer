import { IsNotEmpty, IsString } from 'class-validator';

export class CreateStringDto {
  @IsNotEmpty({ message: 'value is required' })
  @IsString({ message: 'value must be a string' })
  value: string;
}
