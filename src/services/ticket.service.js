import { ticketModel } from "../dao/models/ticket.model.js";
import { productModel } from "../dao/models/product.model.js";
import { cartModel } from "../dao/models/cart.model.js";

export default class Ticket {
  constructor() {
    this.error = "";
  }

  finishTicket = async (request, cartId) => {
    const validateCart = await cartModel.findOne({ id: cartId });
    const getProductId = validateCart.products;

    getProductId.forEach(async(item) => {
        let validateStock = await productModel.findOne({ _id: item.product.toHexString()});
        let saveIds = [];
        if(validateStock.stock === 0){
          saveIds.push(validateStock._id)
          console.log("Productos no agregados:", saveIds)
          return console.log("ESTE PRODUCTO NO PUEDE SER AGREGADO PORQUE", validateStock.stock);

        }
        console.log("PERO ESTE SI, PORQUE TIENE", validateStock.stock - item.quantity)

    })

    // if (!validateCart) return (this.error = { error: "Cart not found" });
    // const validateStock = await productModel.findOne({ _id: getProductId });
    return getProductId;
  };
}
