import { describe, it, expect } from 'vitest';
import { validateScore } from '../src/validateScore';
describe('validateScore', () => {
  it('should return valid result for a normal score', () => {
    const result = validateScore(75);
    expect(result.valid).toBe(true);
    expect(result.score).toBe(75);
    expect(result.passed).toBe(true);
    expect(result.grade).toBe('C');
  });
  it('should return error for missing score', () => {
    const result = validateScore(undefined);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Score ist erforderlich');
  });
  it('should return error for non-numeric score', () => {
    const result = validateScore('abc');
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Score muss eine Zahl sein');
  });
  it('should return error for score out of range', () => {
    const result = validateScore(150);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Score muss zwischen 0 und 100 liegen');
  });
  it('should validate strict mode for non-integer score', () => {
    const result = validateScore(75.5, { strictMode: true });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Score muss eine ganze Zahl sein');
  });
  it('should validate strict mode for NaN score', () => {
    const result = validateScore(NaN, { strictMode: true });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Score muss eine gültige Zahl sein');
  });
  it('should apply bonus categories correctly', () => {
    const result = validateScore(85, { bonusCategories: ['math', 'science'] });
    expect(result.score).toBe(89); // 85 + 2*2 = 89
    expect(result.grade).toBe('B');
  });
  it('should cap bonus points at 10', () => {
    const result = validateScore(85, { bonusCategories: ['a', 'b', 'c', 'd', 'e', 'f'] });
    expect(result.score).toBe(95); // 85 + max 10 = 95
    expect(result.grade).toBe('A');
  });
  it('should return failing grade for low scores', () => {
    const result = validateScore(50);
    expect(result.passed).toBe(false);
    expect(result.grade).toBe('F');
  });
  it('should respect custom passing score', () => {
    const result = validateScore(65, { passingScore: 70 });
    expect(result.passed).toBe(false);
    expect(result.grade).toBe('D');
  });
  it('should correctly handle edge case at grade thresholds', () => {
    expect(validateScore(89).grade).toBe('B');
    expect(validateScore(90).grade).toBe('A');
    expect(validateScore(79).grade).toBe('C');
    expect(validateScore(80).grade).toBe('B');
    expect(validateScore(69).grade).toBe('D');
    expect(validateScore(70).grade).toBe('C');
    expect(validateScore(59).grade).toBe('F');
    expect(validateScore(60).grade).toBe('D');
  });
});