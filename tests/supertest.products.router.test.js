import chai from "chai";
import supertest from "supertest";

const expect = chai.expect;
const requester = supertest("http://localhost:8080/");

describe("Testing E-Commerce Tenda - PRODUCTS API ROUTE", () => {
  // GET USER TOKEN
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

  it("Get all products from the router /api/products - Method: GET", async () => {
    const response = await requester.get("api/products");
    expect(response.status).to.equal(200);
    expect(response.body.payload.payload).to.be.an("array");
  });

  it("Get a product by ID - /api/products/:id - Method: GET", async () => {
    const pid = "64f3c0ac05ded0c1a30ea66d";
    const response = await requester.get(`api/products/${pid}`);
    expect(response.status).to.equal(200);
    expect(response.body.payload[0]).to.have.property('_id').equal(pid);
  });

  it("Insert a new product - /api/products - Method: POST", async () => {
    const productData = {
      title: "Arroz",
      description: "Frito",
      price: 200,
      thumbnail: "foto.png",
      code: "ALFABETA001",
      status: true,
      stock: 200,
      owner: user.email,
    };
    const response = await requester
      .get(`api/products`)
      .set("Cookie", [`${_cookie.name}=${_cookie.value}`])
      .send(productData);
      console.log(response.body.payload.payload)
    expect(response.status).to.equal(200);
  });
});
