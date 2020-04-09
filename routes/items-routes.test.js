process.env.NODE_ENV = "test";

const request = require("supertest");

const app = require("../app");
let database = require("../fakeDb");

let popsicle = { name: "popsicle", price: 2.45 };

beforeEach(function () {
  database.push(popsicle);
});

afterEach(function () {
  database.length = 0;
});

/** GET /items - returns `{items: [popsicle, ...]}` */

describe("GET /items", function () {
  it("Gets a list of items", async function () {
    const resp = await request(app).get("/items");
    console.log("BODY IS", resp.body);
    expect(resp.statusCode).toBe(200);
    expect(resp.body).toEqual([{ name: "popsicle", price: 2.45 }]);
  });
});
