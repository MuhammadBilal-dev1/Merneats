import { Request, Response } from "express";
import uploadImageOnCloudinary from "../utils/uploadImage";
import { Menu } from "../models/menu.model";
import { Restaurant } from "../models/restaurant.model";
import mongoose from "mongoose";

// Add menu
export const addMenu = async (req: Request, res: Response) => {
  try {
    const {name, description, price} = req.body
    const file = req.file

    
    if (!file) {
      res.status(400).json({
        success: false,
        message: "Image is required!"
      })  
      return
    }

    const imageURL = await uploadImageOnCloudinary(file as Express.Multer.File)
    const menu: any = await Menu.create({
      name,
      description,
      price,
      image: imageURL
    })

    const restaurant = await Restaurant.findOne({user: req.id})
    if (restaurant) {
      // menu_id as mongoose.schema.types.objectid
      (restaurant.menus as mongoose.Schema.Types.ObjectId[]).push(menu._id )
      await restaurant.save()
    }

    res.status(201).json({
      success: true,
      message: "Menu added successfully.",
      menu
    })
    return
    
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    })
    return
  }
}

// Edit menu
export const editMenu = async (req: Request, res: Response) => {
  try {
    const {id} = req.params
    const {name, description, price} = req.body
    const file = req.file
    const menu = await Menu.findById(id)
    if (!menu) {
      res.status(400).json({
        success: false,
        message: "Menu not found!"
      })  
      return
    }

    menu.name = name
    menu.description = description
    menu.price = price
    if (file) {
      const imageURL = await uploadImageOnCloudinary(file as Express.Multer.File)
      menu.image = imageURL
    }
    await menu.save()

    res.status(201).json({
      success: true,
      message: "Menu edit successfully.",
      menu
    })
    return
    
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    })
    return
  }
}

// Delete menu
export const deleteMenu = async (req: Request, res: Response) => {
  try {
    const {id} = req.params
    const menu = await Menu.findById(id)
    if (!menu) {
      res.status(404).json({
        success: false,
        message: "Menu not found!"
      })
      return
    }

    // Delete image from cloudinary if exists
    if (menu.image) {
      const publicId = menu.image.split("/").pop()?.split(".")[0];
      if (publicId) {
        // You'll need to import cloudinary from your utils
        const {v2: cloudinary} = await import('cloudinary');
        await cloudinary.uploader.destroy(publicId);
      }
    }

    // Remove from menu collection
    await Menu.findByIdAndDelete(id)

    // Remove menu id from restaurant
    const restaurant = await Restaurant.findOne({user: req.id})

    if (restaurant) {
      restaurant.menus = restaurant.menus.filter(menuId => menuId.toString() !== id) as any;
      await restaurant.save()
    }

    res.status(200).json({
      success: true,
      message: "Menu deleted successfully."
    })
    return
    
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    })
    return
  }
} 