import express from 'express';
import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';

const router = express.Router();

// obtener todos los productos (GET /api/products)
router.get('/', getAllProducts);

// crear un nuevo producto (POST /api/products)
router.post('/', createProduct);

// actualizar un producto por su ID (PUT /api/products/:id)
router.put('/:id', updateProduct);

// eliminar un producto por su ID (DELETE /api/products/:id)
router.delete('/:id', deleteProduct);

export default router;
