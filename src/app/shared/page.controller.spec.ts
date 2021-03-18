import { PagerController } from './pager.controller';

describe('PagerController', () => {
    const list = [];
    let number;
  const pagecontroller: PagerController = new PagerController(list , number);

  it('should create an instance', () => {
    expect(pagecontroller).toBeTruthy();
  });
  it('should call  nextPage', () => {
    pagecontroller.refresh();
    pagecontroller.nextPage();
  });
  it('should call  prevPage', () => {
    pagecontroller.refresh();
    pagecontroller.prevPage();
  });
  it('should call  refresh', () => {
    pagecontroller.refresh();
  });
});
