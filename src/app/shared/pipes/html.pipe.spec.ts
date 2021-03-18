import { HtmlPipe } from './html.pipe';
import { DomSanitizer } from '@angular/platform-browser';

describe('HtmlPipe', () => {
  // tslint:disable-next-line: prefer-const
  let _sanitizer: DomSanitizer;
  const pipe: HtmlPipe = new HtmlPipe(_sanitizer);

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });
  xit('should call transform method', () => {
    pipe.transform('test', '5');
  });
});
