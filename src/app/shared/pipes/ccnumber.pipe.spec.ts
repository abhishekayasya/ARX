import { CcnumberPipe } from "./ccnumber.pipe";

describe("CcnumberPipe", () => {
  const pipe: CcnumberPipe = new CcnumberPipe();

  it("should create an instance", () => {
    expect(pipe).toBeTruthy();
  });
  it("should call transform method", () => {
    pipe.transform("test", "5");
  });
});
