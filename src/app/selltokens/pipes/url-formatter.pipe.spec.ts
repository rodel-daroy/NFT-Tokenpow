import { UrlFormatterPipe } from './url-formatter.pipe';

describe('UrlFormatterPipe', () => {
  const pipe = new UrlFormatterPipe();

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should remove https://', () => {
    const url = 'https://testingjusttesting.com';
    const formattedUrl = pipe.transform(url);
    expect(formattedUrl).toBe('testingjusttesting.com');
  });
});
