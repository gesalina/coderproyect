import chai from "chai";
import supertest from "supertest";

const expect = chai.expect;
const requester = supertest("http://localhost:8080/");

describe("Testing E-Commerce Tenda - SESSION ROUTE", () => {
  // GET USER TOKEN
  let _cookie;
  const newUser = {
    email: "isCoderTest@admin.com",
    password: "admin",
  };

  it("This route create a new user - METHOD POST", async () => {
    const query = await requester.post("session/register").send({
      first_name: "ADMIN CODER",
      last_name: "TESTER",
      email: newUser.email,
      age: 23,
      password: newUser.password,
    });
    expect(query.status).to.equal(302);
  });


  it("This route loggin a user - METHOD POST", async () => {
    const loginUser = await requester.post("session/login").send(newUser);
    const requestToken = loginUser.headers["set-cookie"][0];
    expect(requestToken).to.be.ok;
    // SAVE THE REQUESTED TOKEN
    _cookie = {
      name: requestToken.split("=")[0],
      value: requestToken.split("=")[1],
    };
    expect(_cookie.name).to.be.ok.and.eql("tendaCookie");
    expect(_cookie.value).to.be.ok;
  });
});
