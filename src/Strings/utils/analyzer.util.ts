import * as crypto from 'crypto';

export interface AnalyzedProps {
  length: number;
  is_palindrome: boolean;
  unique_characters: number;
  word_count: number;
  sha256_hash: string;
  character_frequency_map: Record<string, number>;
}

export function analyzeString(value: string): AnalyzedProps {
  const length = value.length;

  const freq: Record<string, number> = {};
  for (const ch of value) {
    freq[ch] = (freq[ch] || 0) + 1;
  }
  const unique_characters = Object.keys(freq).length;

  const word_count =
    value.trim().length === 0 ? 0 : value.trim().split(/\s+/).length;

  const sha256_hash = crypto.createHash('sha256').update(value).digest('hex');

  const normalized = value.replace(/[^0-9a-zA-Z]/g, '').toLowerCase();

  const is_palindrome =
    normalized.length > 0 &&
    normalized === normalized.split('').reverse().join('');

  return {
    length,
    is_palindrome,
    unique_characters,
    word_count,
    sha256_hash,
    character_frequency_map: freq,
  };
}
