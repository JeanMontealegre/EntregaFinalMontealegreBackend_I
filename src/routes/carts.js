import express from 'express';
import {
  createCart,
  addProductToCart,
  deleteProductFromCart,
  emptyCart,
  updateProductQuantity,
  getCartById 
} from '../controllers/cartController.js';

const router = express.Router();

// crear un nuevo carrito (POST /api/carts)
router.post('/', createCart);

// obtener un carrito por su ID (GET /api/carts/:cid)
router.get('/:cid', getCartById); // Nueva ruta para obtener el carrito

// agregar un producto al carrito (POST /api/carts/:cid/product/:pid)
router.post('/:cid/product/:pid', addProductToCart);

// eliminar un producto especifico del carrito (DELETE /api/carts/:cid/product/:pid)
router.delete('/:cid/product/:pid', deleteProductFromCart);

// vaciar completamente el carrito (DELETE /api/carts/:cid)
router.delete('/:cid', emptyCart);

// actualizar la cantidad de un producto en el carrito (PUT /api/carts/:cid/product/:pid)
router.put('/:cid/product/:pid', updateProductQuantity);

export default router;
