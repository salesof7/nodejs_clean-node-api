import app from "@/main/config/app";
import env from "@/main/config/env";
import { MongoHelper } from "@/infra/db/mongodb/helpers/mongo-helper";
import { sign } from "jsonwebtoken";
import { Collection } from "mongodb";
import request from "supertest";

const makeAccessToken = async (): Promise<string> => {
  const res = await accountCollection.insertOne({
    name: "any_name",
    email: "any_email@mail.com",
    password: "any_password",
    role: "admin",
  });

  const id = res.ops[0]._id;
  const accessToken = sign({ id }, env.jwtSecret);
  await accountCollection.updateOne(
    {
      _id: id,
    },
    {
      $set: {
        accessToken,
      },
    }
  );
  return accessToken;
};

let surveyCollection: Collection;
let accountCollection: Collection;
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
    accountCollection = await MongoHelper.getCollection("accounts");
    await accountCollection.deleteMany({});
  });

  describe("POST /surveys", () => {
    test("should return 403 on add survey without accessToken", async () => {
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
        .expect(403);
    });

    test("should return 204 on add survey with valid accessToken", async () => {
      const accessToken = await makeAccessToken();
      await request(app)
        .post("/api/surveys")
        .set("x-access-token", accessToken)
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

  describe("GET /surveys", () => {
    test("should return 403 on load surveys without accessToken", async () => {
      await request(app).get("/api/surveys").expect(403);
    });

    test("should return 204 on load surveys with valid accessToken", async () => {
      const accessToken = await makeAccessToken();
      await request(app)
        .get("/api/surveys")
        .set("x-access-token", accessToken)
        .expect(204);
    });
  });
});
