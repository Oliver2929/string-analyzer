import { Transform } from 'class-transformer';
import { IsBoolean, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { BadRequestException } from '@nestjs/common';

export class QueryStringsDto {
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      const lowered = value.toLowerCase();
      if (lowered === 'true') return true;
      if (lowered === 'false') return false;
      throw new BadRequestException(
        '400 Bad Request: Invalid query parameter values or types',
      );
    }
    return value;
  })
  @IsBoolean()
  is_palindrome?: boolean;

  @IsOptional()
  @Transform(({ value }) => {
    const num = parseInt(value, 10);
    if (isNaN(num) || num < 0)
      throw new BadRequestException(
        '400 Bad Request: Invalid query parameter values or types',
      );
    return num;
  })
  @IsInt()
  @Min(0)
  min_length?: number;

  @IsOptional()
  @Transform(({ value }) => {
    const num = parseInt(value, 10);
    if (isNaN(num) || num < 0)
      throw new BadRequestException(
        '400 Bad Request: Invalid query parameter values or types',
      );
    return num;
  })
  @IsInt()
  @Min(0)
  max_length?: number;

  @IsOptional()
  @Transform(({ value }) => {
    const num = parseInt(value, 10);
    if (isNaN(num) || num < 0)
      throw new BadRequestException(
        '400 Bad Request: Invalid query parameter values or types',
      );
    return num;
  })
  @IsInt()
  @Min(0)
  word_count?: number;

  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value !== 'string' || value.length !== 1)
      throw new BadRequestException(
        '400 Bad Request: Invalid query parameter values or types',
      );
    return value;
  })
  @IsString()
  contains_character?: string;
}
