import { HtmlPipe } from "./html.pipe";
import { OrderByPipe } from "./orderby.pipe";

describe("HtmlPipe", () => {
  const pipe: OrderByPipe = new OrderByPipe();

  it("should create an instance", () => {
    expect(pipe).toBeTruthy();
  });
  xit("should call transform method", () => {
    const test = [];
    pipe.transform(test[""], "5");
  });
});
