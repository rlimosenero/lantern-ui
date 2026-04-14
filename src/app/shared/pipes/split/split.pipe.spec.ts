import { SplitPipe } from './split.pipe';

describe('SplitPipe', () => {
  let pipe: SplitPipe;

  beforeEach(() => {
    pipe = new SplitPipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should split a string by the default separator (comma)', () => {
    const input = 'Angular, React, Vue';
    const result = pipe.transform(input);
    expect(result).toEqual(['Angular', 'React', 'Vue']);
  });

  it('should trim whitespace from split items', () => {
    const input = '  Java  ,  Spring Boot  ,  Postgres  ';
    const result = pipe.transform(input);
    expect(result).toEqual(['Java', 'Spring Boot', 'Postgres']);
  });

  it('should split by a custom separator', () => {
    const input = 'Red|Green|Blue';
    const result = pipe.transform(input, '|');
    expect(result).toEqual(['Red', 'Green', 'Blue']);
  });

  it('should return an empty array if value is null or undefined', () => {
    expect(pipe.transform(null)).toEqual([]);
    expect(pipe.transform(undefined)).toEqual([]);
  });

  it('should return an empty array if value is an empty string', () => {
    expect(pipe.transform('')).toEqual([]);
  });

  it('should filter out empty strings resulting from the split', () => {
    const input = 'Apple,,Banana, ,Orange';
    const result = pipe.transform(input);
    expect(result).toEqual(['Apple', 'Banana', 'Orange']);
  });

  it('should handle strings with no separators correctly', () => {
    const input = 'SingleItem';
    const result = pipe.transform(input);
    expect(result).toEqual(['SingleItem']);
  });
});