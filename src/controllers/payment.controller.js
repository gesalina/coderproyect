import Stripe from "stripe";
import { cartRepository } from "../repositories/repository.js";

const stripe = new Stripe("sk_test_51O7LZIIR1vqRXT5fShjlSYZQQs4ktR6Sgcq6jeetkkBot11H9F9CPgKrIhLreXbJioCcQ9qweKSA2nS6qYLAczMX00XOcfPgKT");

export const paymentController = async (request, response) => {
  try {
    const cartId = request.params.cid;
    const cart = await cartRepository.getCartById(cartId);
    const items = cart.products.map((product) => {
      let price = Math.round(product.product.price * 100);
      return {
        price_data: {
          product_data: {
            name: product.product.title,
            description: product.product.description,
          },
          currency: "usd",
          unit_amount: price,
        },
        quantity: product.quantity,
      };
    });
    const sessions = await stripe.checkout.sessions.create({
      line_items: items,
      mode: "payment",
      success_url: `http://localhost:8080/api/payment/success/${cartId}`,
      cancel_url: `http://localhost:8080/api/payment/cancel`,
    });
    return response.redirect(sessions.url);
  } catch (error) {
    return response.sendServerError(error.message);
  }
};

export const paymentSuccessController = async(request, response) => {
    try {
        const cartId = request.params.cid;
        const cart = await cartRepository.getCartById(cartId);
        response.render('payment/success', {
            cart: cart._id
        });
    } catch (error) {
        return response.sendServerError(error.message);

    }
}

export const paymentCancelController = async(request, response) => {
    try {
        response.render('payment/cancel');
    } catch (error) {
        return response.sendServerError(error.message);
    }
}