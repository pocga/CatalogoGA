const express = require("express"),
    router = express.Router(),
    productsController = require('../controllers/productosGet');

router.get("/catalogo/productos/", productsController.productos);
router.get("/catalogo/productos/categorias/", productsController.categoria);
router.get("/catalogo/productos/rango/", productsController.rango);
router.get("/catalogo/productos/imagenes/", productsController.imagen);
router.get("/catalogo/productos/:id", productsController.id);

module.exports = router;