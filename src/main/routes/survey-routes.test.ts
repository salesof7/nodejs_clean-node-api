import { Collection } from "mongodb";
import request from "supertest";
import { MongoHelper } from "../../infra/db/mongodb/helpers/mongo-helper";
import app from "../config/app";

let surveyCollection: Collection;
describe("Login Routes", () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as unknown as string);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection("surveys");
    await surveyCollection.deleteMany({});
  });

  describe("POST /surveys", () => {
    test("should return 204 on add survey success", async () => {
      await request(app)
        .post("/api/surveys")
        .send({
          question: "question",
          answers: [
            {
              image: "http://image-name.com",
              answer: "answer 1",
            },
            {
              answer: "answer 2",
            },
          ],
        })
        .expect(204);
    });
  });
});
