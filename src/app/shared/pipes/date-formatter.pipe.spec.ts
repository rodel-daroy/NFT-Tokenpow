import { DateFormatterPipe } from './date-formatter.pipe';

describe('DateFormatterPipe', () => {
  it('create an instance', () => {
    const pipe = new DateFormatterPipe();
    expect(pipe).toBeTruthy();
  });

  it('should format date', () => {
    const pipe = new DateFormatterPipe();
    expect(pipe.transform(1605901750, false)).toBe('20 November 2020');
    // expect(pipe.transform(1605901750, true)).toBe('20 November 2020 20:49:10');
    expect(pipe.transform({seconds: 1605901750}, false)).toBe('20 November 2020');
    // expect(pipe.transform({seconds: 1605901750}, true)).toBe('20 November 2020 20:49:10');
  });
});
