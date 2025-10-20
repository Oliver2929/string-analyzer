import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AnalyzedString, AnalyzedStringDocument } from '../schema/schema';
import { CreateStringDto } from '../dto/create-string.dto';
import { analyzeString, AnalyzedProps } from '../utils/analyzer.util';

@Injectable()
export class StringsService {
  constructor(
    @InjectModel(AnalyzedString.name)
    private readonly stringModel: Model<AnalyzedStringDocument>,
  ) {}

  private buildResponseFromDoc(doc: any) {
    return {
      id: doc._id,
      value: doc.value,
      properties: {
        length: doc.length,
        is_palindrome: doc.is_palindrome,
        unique_characters: doc.unique_characters,
        word_count: doc.word_count,
        sha256_hash: doc.sha256_hash,
        character_frequency_map: doc.character_frequency_map,
      },
      created_at: doc.created_at.toISOString(),
    };
  }

  async create(dto: CreateStringDto) {
    if (!dto || dto.value === undefined || dto.value === null) {
      throw new BadRequestException(
        'Invalid request body or missing "value" field',
      );
    } else if (typeof dto.value !== 'string') {
      throw new UnprocessableEntityException(
        'Invalid data type for "value" (must be string)',
      );
    }
    const value = dto.value;
    const props = analyzeString(value);

    const exists = await this.stringModel.findById(props.sha256_hash).lean();
    if (exists) {
      throw new ConflictException('String already exists in the system');
    }

    const doc = {
      _id: props.sha256_hash,
      value,
      length: props.length,
      is_palindrome: props.is_palindrome,
      unique_characters: props.unique_characters,
      word_count: props.word_count,
      sha256_hash: props.sha256_hash,
      character_frequency_map: props.character_frequency_map,
      created_at: new Date(),
    };

    const created = await new this.stringModel(doc).save();
    return this.buildResponseFromDoc(created.toObject());
  }

  async findByValue(value: string) {
    if (typeof value !== 'string')
      throw new BadRequestException('Invalid string value');
    const props = analyzeString(value);
    const doc = await this.stringModel.findById(props.sha256_hash).lean();
    if (!doc)
      throw new NotFoundException('String does not exist in the system');
    return this.buildResponseFromDoc(doc);
  }

  async findAll(filters: {
    is_palindrome?: boolean;
    min_length?: number;
    max_length?: number;
    word_count?: number;
    contains_character?: string;
  }) {
    const query: any = {};

    if (filters.is_palindrome !== undefined)
      query.is_palindrome = filters.is_palindrome;
    if (filters.min_length !== undefined)
      query.length = { ...(query.length || {}), $gte: filters.min_length };
    if (filters.max_length !== undefined)
      query.length = { ...(query.length || {}), $lte: filters.max_length };
    if (filters.word_count !== undefined) query.word_count = filters.word_count;
    if (filters.contains_character !== undefined) {
      const char = filters.contains_character;
      if (char.length !== 1)
        throw new BadRequestException(
          'contains_character must be a single character',
        );
      query[`character_frequency_map.${char}`] = { $exists: true, $gt: 0 };
    }

    const docs = await this.stringModel.find(query).lean();
    const data = docs.map((d) => this.buildResponseFromDoc(d));
    return { data, count: data.length, filters_applied: filters };
  }

  parseNaturalLanguage(q: string) {
    if (!q || q.trim().length === 0)
      throw new BadRequestException('Unable to parse natural language query');

    const original = q;
    const low = q.toLowerCase();
    const parsed_filters: any = {};

    // single word
    if (/\bsingle word\b|\bone word\b/.test(low)) parsed_filters.word_count = 1;

    // palindrome
    if (/\bpalindrom/i.test(low)) parsed_filters.is_palindrome = true;

    // longer than N characters -> min_length = N+1
    const longer = low.match(/longer than (\d+)\s*(characters)?/);
    if (longer) parsed_filters.min_length = parseInt(longer[1], 10) + 1;

    // shorter than N characters -> max_length = N-1
    const shorter = low.match(/shorter than (\d+)\s*(characters)?/);
    if (shorter) parsed_filters.max_length = parseInt(shorter[1], 10) - 1;

    // contains letter X (various phrasings)
    let contains = low.match(
      /contain(?:s|ing)?(?: the)?(?: letter)?\s+([a-z0-9])/i,
    );
    if (!contains)
      contains =
        low.match(/containing\s+([a-z0-9])/i) ||
        low.match(/contain\s+([a-z0-9])/i);
    if (contains) parsed_filters.contains_character = contains[1];

    // heuristic: 'first vowel' -> 'a'
    if (/\bfirst vowel\b/.test(low)) parsed_filters.contains_character = 'a';

    if (Object.keys(parsed_filters).length === 0) {
      throw new BadRequestException('Unable to parse natural language query');
    }

    if (
      parsed_filters.min_length !== undefined &&
      parsed_filters.max_length !== undefined &&
      parsed_filters.min_length > parsed_filters.max_length
    ) {
      throw new UnprocessableEntityException(
        'Query parsed but resulted in conflicting filters',
      );
    }

    return { original, parsed_filters };
  }

  async findByNaturalLanguage(q: string) {
    const parsed = this.parseNaturalLanguage(q);
    const results = await this.findAll(parsed.parsed_filters);
    return {
      data: results.data,
      count: results.count,
      interpreted_query: {
        original: parsed.original,
        parsed_filters: parsed.parsed_filters,
      },
    };
  }

  async removeByValue(value: string) {
    if (typeof value !== 'string')
      throw new BadRequestException('Invalid string value');
    const { sha256_hash } = analyzeString(value);
    const res = await this.stringModel.findByIdAndDelete(sha256_hash).lean();
    if (!res)
      throw new NotFoundException('String does not exist in the system');
    return;
  }
}
