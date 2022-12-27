import request from "supertest";
import app from "../config/app";

describe("Body Parser Middleware", () => {
  test("should parse body as json", async () => {
    app.post("/test_body_parser", (req, res) => {
      res.send(req.body);
    });

    await request(app)
      .post("/test_body_parser")
      .send({ value: "any_value" })
      .expect({ value: "any_value" });
  });
});
