import { Request, Response } from "express";
import {Multer} from "multer";
import uploadImageOnCloudinary from "../utils/uploadImage";
import { Restaurant } from "../models/restaurant.model";
import { Order } from "../models/order.model";
import mongoose from "mongoose";

// creating restaurant
export const createRestaurant = async (req:Request, res:Response) => {
  try {
    const {restaurantName, city, country, deliveryTime, cuisines} = req.body    
    const file = req.file
    
    if (!file) {
      res.status(400).json({
        success: false,
        message: "Image is required!"
      })
      return
    }

    const imageUrl = await uploadImageOnCloudinary(file as Express.Multer.File)
    await Restaurant.create({
      user: req.id,
      restaurantName,
      city,
      country,
      deliveryTime,
      cuisines: JSON.parse(cuisines),
      imageUrl
    })
    res.status(201).json({
      success: true,
      message: "Restaurant added successfully."
    })
    return
    
  } catch (error) {
    console.log(error);
    res.status(500).json({message: "Internal server error"})
    return
  }
}

// getting restaurant
export const getRestaurant = async (req: Request, res: Response) => {
  try {
    const restaurant = await Restaurant.findOne({user:req.id}).populate("menus")
    if (!restaurant) {
      res.status(404).json({
        success: false,
        message: "Restaurant not found!",
        restaurant: []
      })
      return
    }

    res.status(200).json({
      success: true,
      restaurant
    })
    return
    
  } catch (error) {
    console.log(error);
    res.status(500).json({message: "Internal server error"})
    return
  }
}

// updating restaurant
export const updatingRestaurant = async (req: Request, res: Response) => {
  try {
    const {restaurantName, city, country, deliveryTime, cuisines} = req.body
    const file = req.file
    const restaurant = await Restaurant.findOne({user:req.id})
    if (!restaurant) {
      res.status(404).json({
        success: false,
        message: "Restaurant not found!"
      })
      return
    }
    restaurant.restaurantName = restaurantName
    restaurant.city = city
    restaurant.country = country
    restaurant.deliveryTime = deliveryTime
    restaurant.cuisines = cuisines

    if (file) {
      const imageUrl = await uploadImageOnCloudinary(file as Express.Multer.File)
      restaurant.imageUrl = imageUrl
    }
    await restaurant.save()
    res.status(200).json({
      success: true,
      message: "Restaurant updated.",
      restaurant
    })
    return
    
  } catch (error) {
    console.log(error);
    res.status(500).json({message: "Internal server error"})
    return
  }
}

// getting restaurant orders
export const getRestaurantOrder = async (req:Request, res:Response) => {
  try {
    const restaurant = await Restaurant.findOne({user: req.id})
    if (!restaurant) {
      res.status(404).json({
        success: false,
        message: "Restaurant not found"
      })
      return
    }

    const orders = await Order.find({restaurant: restaurant._id}).populate("restaurant").populate("user")
    res.status(200).json({
      success: true,
      orders,
    })
    return
  } catch (error) {
    console.log(error);
    res.status(500).json({message: "Internal server error"})
  }
}

// updating order status
export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const {orderId} = req.params
    const {status} = req.body

    const order = await Order.findById(orderId)
    if (!order) {
      res.status(404).json({
        success: false,
        message: "Order not found"
      })
      return
    }
    order.status = status
    await order.save()

    res.status(200).json({
      success: true,
      status: order.status,
      message: "Order updated successfully."
    })
    return

  } catch (error) {
    console.log(error);
    res.status(500).json({message: "Internal server error"})
  }
}

// searching restaurant on behalf of searchText, searchQuery, selectedCuisines
export const searchRestaurant = async (req: Request, res: Response) => {
  try {
    const searchText = req.params.searchText || ""
    const searchQuery = req.query.searchQuery as string || ""
    const selectedCuisines = (req.query.selectedCuisines as string || "").split(",").filter(cuisine => cuisine)

    // Using aggregate to search in menus as well
     const pipeline: any[] = [
      {
        $lookup: {
          from: "menus",
          localField: "menus",
          foreignField: "_id",
          as: "menuItems"
        }
      }
    ];

     const tokens = [searchText, searchQuery].filter((t) => t && t.trim().length > 0) as string[];
     if (tokens.length > 0) {
      pipeline.push({
        $match: {
           $or: tokens.flatMap((t) => [
             { restaurantName: { $regex: t, $options: 'i' } },
             { city: { $regex: t, $options: 'i' } },
             { country: { $regex: t, $options: 'i' } },
             { cuisines: { $regex: t, $options: 'i' } },
             { "menuItems.name": { $regex: t, $options: 'i' } },
             { "menuItems.description": { $regex: t, $options: 'i' } }
           ])
        }
      });
    }

    if (selectedCuisines.length > 0) {
      pipeline.push({
        $match: { cuisines: { $all: selectedCuisines } }
      });
    }

    const restaurants = await Restaurant.aggregate(pipeline);

    res.status(200).json({
      success: true,
      data: restaurants
    })
    return

  } catch (error) {
    console.log(error);
    res.status(500).json({message: "Internal server error"})
  }
}

// getting information of single restaurant
export const getSingleRestaurant = async (req: Request, res: Response) => {
  try {
    const restaurantId = req.params.id
    const restaurant = await Restaurant.findById(restaurantId).populate({
      path: "menus",
      options: {createdAt:-1}
    })

    if (!restaurant) {
      res.status(404).json({
        success: false,
        message: "Restaurant not found"
      })  
      return
    }

    res.status(200).json({
      success: true,
      restaurant
    })
    return

  } catch (error) {
    console.log(error);
    res.status(500).json({message: "Internal server error"})
  }
}
