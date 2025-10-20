

## Description

A RESTful API built with NestJS that analyzes strings and stores their computed properties in MongoDB.
For each analyzed string, the API computes and stores:
 * length — Number of characters in the string

 * is_palindrome — Whether the string reads the same forwards and backwards (case-insensitive)

*  unique_characters — Count of distinct characters

*  word_count — Number of whitespace-separated words

* sha256_hash — SHA-256 hash (used as a unique identifier)

* character_frequency_map — Frequency of each character in the string

## Project setup

```bash
git clone https://github.com/Oliver2929/string-analyzer.git
cd string-analysis-api
$ npm install
```
### Environment Variables
PORT=3000
MONGO_URI=mongodb://localhost:27017/string_analysis_db

### Running the App Locally
npm run start:dev


