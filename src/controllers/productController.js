import Product from '../models/Product.js';

// obtener todos los productos con paginacion, filtros y ordenamiento
export const getAllProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10, sort = 'asc', query = '', available } = req.query;

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { price: sort === 'asc' ? 1 : -1 },
    };

    const filter = {};

    if (query) {
      filter.category = query;
    }

    if (available) {
      filter.availability = available === 'true'; 
    }

    const products = await Product.paginate(filter, options);

    res.status(200).json({
      status: 'success',
      payload: products.docs,
      totalPages: products.totalPages,
      prevPage: products.prevPage,
      nextPage: products.nextPage,
      page: products.page,
      hasPrevPage: products.hasPrevPage,
      hasNextPage: products.hasNextPage,
      prevLink: products.hasPrevPage
        ? `/api/products?page=${products.prevPage}&limit=${limit}`
        : null,
      nextLink: products.hasNextPage
        ? `/api/products?page=${products.nextPage}&limit=${limit}`
        : null,
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// crear un nuevo producto
export const createProduct = async (req, res) => {
  try {
    const { name, price, category, availability } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({ message: 'Faltan datos obligatorios' });
    }

    const newProduct = new Product({
      name,
      price,
      category,
      availability: availability !== undefined ? availability : true,
    });

    await newProduct.save();
    req.app.get('io').emit('newProduct', newProduct);
    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error al crear producto:', error);
    res.status(500).json({ message: 'No se pudo crear el producto' });
  }
};

// actualizar un producto por su ID
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true });

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    req.app.get('io').emit('updateProduct', updatedProduct);
    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    res.status(500).json({ message: 'No se pudo actualizar el producto' });
  }
};

// eliminar un producto por su ID
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    req.app.get('io').emit('deleteProduct', deletedProduct);
    res.status(200).json({ message: 'Producto eliminado', deletedProduct });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).json({ message: 'No se pudo eliminar el producto' });
  }
};
