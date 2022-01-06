import { LocationFormatterPipe } from './location-formatter.pipe';

describe('LocationFormatterPipe', () => {
  it('create an instance', () => {
    const pipe = new LocationFormatterPipe();
    expect(pipe).toBeTruthy();
  });

  it('should take name from location', () => {
    const pipe = new LocationFormatterPipe();
    expect(pipe.transform({name: 'Slovakia'})).toBe('Slovakia');
  });
});
