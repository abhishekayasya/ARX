import { PricePipe } from "./price.pipe";

describe("PricePipe", () => {
  const pipe: PricePipe = new PricePipe();

  it("should create an instance", () => {
    expect(pipe).toBeTruthy();
  });
  it("should call transform method", () => {
    pipe.transform(10, "5");
  });
  it("should call transform method if case", () => {
    pipe.transform("test", "5");
  });
});
