import { Request, Response } from "express";
import { Restaurant } from "../models/restaurant.model";
import { Order } from "../models/order.model";
import { Error } from "mongoose";
import Stripe from "stripe";
import dotenv from 'dotenv'
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

type checkoutSessionRequest = {
  cartItems: {
    menuId: string,
    name: string,
    image: string,
    price: string,
    quantity: string,
  }[],
  deliveryDetails: {
    name: string,
    email: string,
    address: string,
    city: string,
  },
  RestaurantId: string
} 

// gettingrestaurant all orders
export const getOrders = async (req:Request, res:Response) => {
  try {
    const allOrders = await Order.find({ user: req.id }).populate("user").populate("restaurant")
    
    res.status(200).json({
      success: true,
      allOrders,
    })
    return
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error!"
    })
    return
  }
}

// creating stripe session
export const createCheckoutSession = async (req: Request, res: Response) => {
  try {
    const checkoutSessionRequest: checkoutSessionRequest = req.body
    const restaurant = await Restaurant.findById(checkoutSessionRequest.RestaurantId).populate("menus")
    
    if (!restaurant) {
      res.status(404).json({
        success: false,
        message: "Restaurant not found"
      })
      return
    }

    const order: any = new Order({
      restaurant: restaurant._id,
      user: req.id,
      deliveryDetails: checkoutSessionRequest.deliveryDetails,
      cartItems: checkoutSessionRequest.cartItems,
      status: "pending"
    })

    // line items
    const menuItems = restaurant.menus
    const lineItems = createLinesItems(checkoutSessionRequest, menuItems);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      shipping_address_collection: {
        allowed_countries: ['GB', 'US', 'CA', 'AE', 'PK', 'IN'],
      },
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/order/status`,
      cancel_url: `${process.env.FRONTEND_URL}/cart`,
      metadata: {
        orderId: order._id.toString(),
      }
    })

    if (!session.url) {
      res.status(400).json({
        success: false,
        message: "Error while creating session"
      })
      return;
    }

    await order.save()
    res.status(200).json({
      session
    })
    return
    
  } catch (error) {
    console.log("Stripe Session Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    })
    return
  }
}

// creating line item to show on stripe page
export const createLinesItems = (checkoutSessionRequest: checkoutSessionRequest, menuItems: any) => {
  // 1. create line items
  const lineItems = checkoutSessionRequest.cartItems.map((cartItem) => {
    const menuItem = menuItems.find((item: any) => item._id.toString() === cartItem.menuId)
    if (!menuItem) throw new Error(`Menu item id ${cartItem.menuId} is not found`)
    return {
      price_data: {
        currency: 'usd',
        product_data: {
          name: menuItem.name,
          images: [menuItem.image]
        },
        unit_amount: Math.round(menuItem.price * 100),
      },
      quantity: parseInt(cartItem.quantity, 10) 
    }
  })
  // 2. return lineItems
  return lineItems
}

export const stripeWebhook = async (req: Request, res: Response) => {
  let event;

  try {
      const signature = req.headers["stripe-signature"];

      // Construct the payload string for verification
      const payloadString = JSON.stringify(req.body, null, 2);
      const secret = process.env.WEBHOOK_ENDPOINT_SECRET!;

      // Generate test header string for event construction
      const header = stripe.webhooks.generateTestHeaderString({
          payload: payloadString,
          secret,
      });

      // Construct the event using the payload string and header
      event = stripe.webhooks.constructEvent(payloadString, header, secret);
  } catch (error: any) {
      console.error('Webhook error:', error.message);
       res.status(400).send(`Webhook error: ${error.message}`);
       return
  }

  // Handle the checkout session completed event
  if (event.type === "checkout.session.completed") {
      try {
          const session = event.data.object as Stripe.Checkout.Session;
          const order = await Order.findById(session.metadata?.orderId);

          if (!order) {
               res.status(404).json({ message: "Order not found" });
               return
          }

          // Update the order with the amount and status
          if (session.amount_total) {
              order.totalAmount = session.amount_total;
          }
          order.status = "confirmed";

          await order.save();
      } catch (error) {
          console.error('Error handling event:', error);
           res.status(500).json({ message: "Internal Server Error" });
           return
      }
  }
  // Send a 200 response to acknowledge receipt of the event
  res.status(200).send();
};


