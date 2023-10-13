import chai from "chai";
import supertest from "supertest";

const expect = chai.expect;
const requester = supertest("http://localhost:8080/");

describe("Testing E-Commerce Tenda - CARTS API ROUTE", () => {
let _cookie;
  const user = {
    email: "ezequiel20101942@gmail.com",
    password: "admin",
  };

  it("This route loggin a user - METHOD POST", async () => {
    const loginUser = await requester.post("session/login").send(user);
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

  it("Get a cart by ID - /api/carts/:cid - Method: POST", async () => {
    const cid = "64ea820ded1daa3c588c879f";
    const response = await requester.get(`api/carts/${cid}`).set("Cookie", [`${_cookie.name}=${_cookie.value}`]);
    expect(response.status).to.equal(200);
  });

  it("Insert a product into a cart - /api/carts/:cid/products/:pid - Method: POST", async () => {
    const cid = "64ea820ded1daa3c588c879f";
    const pid = "64f3ae88481e4294e75041a0"
    const response = await requester.put(`api/carts/${cid}/products/${pid}`).set("Cookie", [`${_cookie.name}=${_cookie.value}`]).send({quantity: 10});
    expect(response.status).to.equal(200);
  });

})