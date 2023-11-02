const getAddButton = document.querySelectorAll(".addButton");
const getCartValue = document.getElementById("cartCount");
const getUser = document.getElementById("userId");
let getActiveCart = localStorage.getItem("cartId");
let productAmmount = localStorage.getItem("productAmmount") || 0;
const purchase = document.getElementById("purchase");
const finishPurchase = document.getElementById("finishPurchase");


finishPurchase?.addEventListener('click',function(){
  window.location.href = `https://coderproyect-production.up.railway.app/api/payment/createCheckout/${getActiveCart}`;
})

purchase?.addEventListener('click', function(){
  window.location.href = `https://coderproyect-production.up.railway.app/api/carts/${getActiveCart}/cart`;
})

getCartValue.textContent = productAmmount;

getAddButton.forEach((button) => {
  button.addEventListener("click", function () {
    addProduct(button);
  });
});

const createCart = async () => {
  const response = await fetch("/api/carts/", {
    method: "POST",
    body: JSON.stringify({ userId: getUser.value }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const result = await response.json();
  if (result.status === "error") return alert(result.error);
  return result.payload._id;
};

const addProduct = async (button) => {
  const body = {
    product: button.value,
    quantity: 1,
  };
  try {
    if (!getActiveCart) {
      const query = await createCart();
      getActiveCart = query;
      localStorage.setItem("cartId", getActiveCart);
    }

    const addProduct = await fetch(`/api/carts/${getActiveCart}`, {
      method: "PUT",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await addProduct.json();
    if (result.status === "error") return alert(result.error);
    productAmmount += 1;
    getCartValue.textContent = productAmmount;
    localStorage.setItem("productAmmount", parseInt(productAmmount));
    return alert("Product Added");
  } catch (error) {
    alert(`Ocurrio un error ${error}`);
  }
};
