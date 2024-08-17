import { CartModel } from "./models/cart.model.js";

export default class CartDaoMongoDB {
  
  // Método para crear un nuevo carrito
  async create() {
    try {
      return await CartModel.create({
        products: [],
      });
    } catch (error) {
      console.log(error);
    }
  }

  // Método para obtener todos los carritos
  async getAll() {
    try {
      return await CartModel.find({});
    } catch (error) {
      throw new Error("Error al obtener todos los carritos");
    }
  }

  // Método para obtener un carrito por su ID, populando los productos asociados
  async getById(id) {
    try {
      return await CartModel.findById(id).populate("products.product");
    } catch (error) {
      console.log(error);
    }
  }

  // Método para eliminar un carrito por su ID
  async delete(id) {
    try {
      return await CartModel.findByIdAndDelete(id);
    } catch (error) {
      console.log(error);
    }
  }

  // Método para verificar si un producto existe en un carrito específico
  async existProdInCart(cartId, prodId) {
    try {
      return await CartModel.findOne({
        _id: cartId,
        products: { $elemMatch: { product: prodId } }
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  // Método para agregar un producto a un carrito
  async addProdToCart(cartId, prodId) {
    try {
      const existProdInCart = await this.existProdInCart(cartId, prodId);
      if (existProdInCart) {
        // Si el producto ya existe en el carrito, incrementa su cantidad
        return await CartModel.findOneAndUpdate(
          { _id: cartId, 'products.product': prodId },
          { $set: { 'products.$.quantity': existProdInCart.products[0].quantity + 1 } },
          { new: true }
        );
      } else {
        // Si el producto no existe en el carrito, lo agrega
        return await CartModel.findByIdAndUpdate(
          cartId,
          { $push: { products: { product: prodId } } },
          { new: true }
        );
      }
    } catch (error) {
      console.log(error);
    }
  }

  // Método para eliminar un producto de un carrito
  async removeProdToCart(cartId, prodId) {
    try {
      return await CartModel.findByIdAndUpdate(
        { _id: cartId },
        { $pull: { products: { product: prodId } } },
        { new: true }
      );
    } catch (error) {
      console.log(error);
    }
  }

  // Método para actualizar un carrito por su ID con nuevos datos
  async update(id, obj) {
    try {
      const response = await CartModel.findByIdAndUpdate(id, obj, {
        new: true,
      });
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  // Método para actualizar la cantidad de un producto en un carrito
  async updateProdQuantityToCart(cartId, prodId, quantity) {
    try {
      return await CartModel.findOneAndUpdate(
        { _id: cartId, 'products.product': prodId },
        { $set: { 'products.$.quantity': quantity } },
        { new: true }
      );
    } catch (error) {
      console.log(error);
    }
  }

  // Método para vaciar todos los productos de un carrito
  async clearCart(cartId) {
    try {
      return await CartModel.findOneAndUpdate(
        { _id: cartId },
        { $set: { products: [] } },
        { new: true }
      );
    } catch (error) {
      console.log(error);
    }
  }
}
