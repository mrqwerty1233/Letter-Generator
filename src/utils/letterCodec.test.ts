import test from 'node:test';
import assert from 'node:assert/strict';
import {
  DEFAULT_BIRTHDAY_LETTER,
  createShareUrl,
  decodeLetterFromHash,
  encodeLetterToHash,
  formatEditorialDate,
  getOccasionCountdown,
  getWaxSealMonogram,
  validateLetterConfig,
} from './letterCodec';

test('encodeLetterToHash and decodeLetterFromHash round-trip accurately with November 01, 2026 data', () => {
  const encoded = encodeLetterToHash(DEFAULT_BIRTHDAY_LETTER);
  assert.ok(encoded.length > 20);
  const decoded = decodeLetterFromHash(encoded);
  assert.ok(decoded !== null);
  assert.equal(decoded?.occasionDate, '2026-11-01');
  assert.equal(decoded?.recipientName, 'Elise');
  assert.equal(decoded?.slides.length, 4);
  assert.ok(decoded?.slides[0].imageUrl.startsWith('data:image/svg+xml;utf8,'));
});

test('createShareUrl produces valid recipient URL with hash and shortId', () => {
  const url = createShareUrl(
    'https://example.com',
    '/',
    DEFAULT_BIRTHDAY_LETTER,
    'nov01-elise'
  );
  assert.ok(url.startsWith('https://example.com/?k=nov01-elise&view=gift#letter='));
});

test('getOccasionCountdown calculates countdown to November 01, 2026 accurately', () => {
  const oct30 = new Date(2026, 9, 30, 12, 0, 0).getTime();
  const countdown = getOccasionCountdown('2026-11-01', oct30);
  assert.equal(countdown.isToday, false);
  assert.equal(countdown.isPast, false);
  assert.equal(countdown.days, 1);
  assert.equal(countdown.hours, 12);

  const nov01 = new Date(2026, 10, 1, 14, 30, 0).getTime();
  const onDay = getOccasionCountdown('2026-11-01', nov01);
  assert.equal(onDay.isToday, true);
});

test('formatEditorialDate formats 2026-11-01 as November 01, 2026', () => {
  assert.equal(formatEditorialDate('2026-11-01'), 'November 01, 2026');
});

test('getWaxSealMonogram builds monogram from initials or custom string including heart emojis', () => {
  assert.equal(getWaxSealMonogram('Julian', 'Elise', ''), 'J♥E');
  assert.equal(getWaxSealMonogram('Julian', 'Elise', 'j&e'), 'J&E');
  assert.equal(getWaxSealMonogram('Marco', 'Anna', 'm🩶a'), 'M🩶A');
});

test('validateLetterConfig catches empty required fields', () => {
  const validResult = validateLetterConfig(DEFAULT_BIRTHDAY_LETTER);
  assert.equal(validResult.valid, true);

  const invalidResult = validateLetterConfig({
    ...DEFAULT_BIRTHDAY_LETTER,
    recipientName: '   ',
    paragraphs: [''],
  });
  assert.equal(invalidResult.valid, false);
  assert.ok(invalidResult.errors.recipientName);
  assert.ok(invalidResult.errors.paragraphs);
});
