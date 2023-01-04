import jwt from "jsonwebtoken";
import { JwtAdapter } from "./jwt-adapter";

jest.mock("jsonwebtoken", () => ({
  async sign(): Promise<string> {
    return await new Promise((resolve, reject) => resolve("any_token"));
  },
}));

describe("Jwt Adapter", () => {
  test("should call sign with correct values", async () => {
    const sut = new JwtAdapter("secret");

    const signSpy = jest.spyOn(jwt, "sign");

    await sut.encrypt("any_id");
    expect(signSpy).toHaveBeenCalledWith({ id: "any_id" }, "secret");
  });

  test("should return a token on sign success", async () => {
    const sut = new JwtAdapter("secret");
    const accessToken = await sut.encrypt("any_id");
    expect(accessToken).toBe("any_token");
  });

  test("should throw if sign throws", async () => {
    const sut = new JwtAdapter("secret");

    const signSpy = jest.spyOn(jwt, "sign") as unknown as jest.Mock<
      ReturnType<(key: Error) => Promise<Error>>,
      Parameters<(key: Error) => Promise<Error>>
    >;

    signSpy.mockReturnValueOnce(
      new Promise((resolve, reject) => reject(new Error()))
    );

    const promise = sut.encrypt("any_id");
    await expect(promise).rejects.toThrow();
  });
});
