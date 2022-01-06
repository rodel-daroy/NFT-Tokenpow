import { BigNumberPipe } from './big-number.pipe';

describe('BigNumberPipe', () => {
  it('create an instance', () => {
    const pipe = new BigNumberPipe();
    expect(pipe).toBeTruthy();
  });

  it('should format bigNumber', () => {
    const pipe = new BigNumberPipe();
    expect(pipe.transform(1000)).toBe('1K');
    expect(pipe.transform(1000000)).toBe('1M');
    expect(pipe.transform(1000000000)).toBe('1B');
    expect(pipe.transform(1000000000000)).toBe('1T');
    expect(pipe.transform(1000000000000000)).toBe('1Q');
  });

  it('should get null', () => {
    const pipe = new BigNumberPipe();
    expect(pipe.transform(NaN)).toBe(null);
    expect(pipe.transform(null)).toBe(null);
    expect(pipe.transform(0)).toBe(null);
  });
});
