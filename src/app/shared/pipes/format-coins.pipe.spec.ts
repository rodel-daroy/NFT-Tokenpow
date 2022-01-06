import { FormatCoinsPipe } from './format-coins.pipe';

describe('FormatCoinsPipe', () => {
  // 1
  // 10
  // 100
  // 1 000
  // 10 000
  // 100 000
  // 1 000 000
  // 10 000 000
  // 100 000 000
  // 1 000 000 000

  it('create an instance', () => {
    const pipe = new FormatCoinsPipe();
    expect(pipe).toBeTruthy();
  });

  it('should format coins', () => {
    const pipe = new FormatCoinsPipe();
    expect(pipe.transform(1)).toBe('1');
    expect(pipe.transform(10)).toBe('10');
    expect(pipe.transform(100)).toBe('100');
    expect(pipe.transform(1000)).toBe('1\'000');
    expect(pipe.transform(10000)).toBe('10\'000');
    expect(pipe.transform(100000)).toBe('100\'000');
    expect(pipe.transform(1000000)).toBe('1\'000\'000');
    expect(pipe.transform(10000000)).toBe('10\'000\'000');
    expect(pipe.transform(100000000)).toBe('100\'000\'000');
    expect(pipe.transform(1000000000)).toBe('1\'000\'000\'000');
  });
});
