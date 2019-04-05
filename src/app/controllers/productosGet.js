const client = require('../dbconnection/dbRedisConnection'),
    fetch = require('node-fetch'),
    redis = require("redis"),
    express = require("express"),
    producto = require('../model/producto'),
    imagen = require('../model/imagen'),
    error = require('../errores/errores'),
    constantes = require('../../constantes'),
    mongoose = require('../dbconnection/dbConnectionMongo')
router = express.Router();

//localhost:4000/catalogo/catalogo/productos/
//localhost:4000/catalogo/catalogo/productos?from=####&to=#### -> Consulta por rango
//localhost:4000/catalogo/catalogo/productos?categ="""" -> Consulta por categoria
//localhost:4000/catalogo/catalogo/productos?disp=true/false -> Consulta por disponibilidad
exports.productos = async(req, res) => {

    precioMenor  =  req.query.from  ?  req.query.from  :  0;
    precioMayor =  req.query.to  ?  req.query.to  : 0;
    categ  =  req.query.categ  ?  req.query.categ  : 0;
    disp =  req.query.disp ?  req.query.disp : 0;
    let productsReturn;

    try {

        const productos = await producto.find({});
        var rediskey = `categ-${categ}precioMenor-${precioMenor}precioMayor-${precioMayor}disponibilidad-${disp}.`;
        client.get(rediskey, function(error, redisFilter) {
            if (error) {
                console.log(error);
                throw error;
            }
            if (redisFilter === null) {

                let productsList = { producto: [] };
                fetch(process.env.MOCKP_ROUTE).then(function(productosMock) {
                        return productosMock.json();
                    })
                    .then(productosMock => {
                        productosMock.producto.forEach(productoActualMock => {
                            const productFound = productos.filter(value => value.idProducto === productoActualMock.idProducto)
                            if (productFound.length > 0) {
                                productoActualMock.imagen = productFound[0].imagen;
                                productoActualMock.miniatura = productFound[0].miniatura;

                                productsList.producto.push({
                                    "idProducto": productoActualMock.idProducto,
                                    "categoria": productoActualMock.categoria,
                                    "cantidadDisponible": productoActualMock.cantidadDisponible,
                                    "precio": productoActualMock.precio,
                                    "descripcion": productoActualMock.descripcion,
                                    "imagen": productoActualMock.imagen,
                                    "miniatura": productoActualMock.miniatura
                                });
                            }


                        })
                        var catarray = categ ? categ.split(",") : categ;
                        var isWithinCategory = function(filterCateg, currentCategory) {
                            for (i = 0; i < filterCateg.length; i++) {
                                if (currentCategory == filterCateg[i]) {
                                    return true;
                                }
                            }
                            return false;
                        }
                        productsReturn = productsList.product;
                        if (catarray.length > 0 || parseInt(precioMenor) !== 0 || parseInt(precioMayor) !== 0 || String(disp) !== "0") {
                            filterBy = { "categoria": catarray, "precioMayor": precioMayor, "precioMenor": precioMenor, "disponibilidad": disp },
                                productsReturn = productsList.producto.filter(function(productoActual) {
                                    if ((catarray ? isWithinCategory(catarray, productoActual.categoria) : true) &&
                                        (filterBy.precioMayor ? productoActual.precio <= parseInt(filterBy.precioMayor) : true) &&
                                        (filterBy.precioMenor ? productoActual.precio >= parseInt(filterBy.precioMenor) : true) &&
                                        (filterBy.disponibilidad ? (String(filterBy.disponibilidad) === "true" ? productoActual.cantidadDisponible > 0 :
                                            (String(filterBy.disponibilidad) === "false" ? productoActual.cantidadDisponible === 0 : false)) : true)) {
                                        return true;
                                    }
                                });
                            productsList.producto = productsReturn;
                            client.setex(rediskey, process.env.TMPREDIS, JSON.stringify(productsList), redis.print);
                        } else {
                            client.setex(rediskey, process.env.TMPREDPR, JSON.stringify(productsList), redis.print);
                        }

                        res.send(productsList);

                    })
                    .catch(function(err) {
                        console.log(err);
                    });

            } else {
                res.send(JSON.parse(redisFilter));
            }
        });

    } catch (error) {
        res.send(error);
    }
};


//localhost:4000/catalogo/productos/categorias/
exports.categoria = async(req, res) => {

    //const sendresponse = option => res.end(JSON.parse(JSON.stringify(option)));
    try {
        let valor = true;
        client.get('/catalogo/productos/categorias', (error, redisCategory) => {
            if (error) {
                console.log(error);
                throw error;
            }
            if (redisCategory === null) {
                fetch(process.env.MOCKC_ROUTE)
                    .then(function(mockProductos) {
                        return mockProductos.json();
                    })
                    .then(mockProductos => {
                        client.setex('/catalogo/productos/categorias', process.env.TMPREDIS, JSON.stringify(mockProductos), redis.print);
                        res.send(mockProductos);
                    })
                    .catch(function(err) {
                        console.log(err);
                    });

            } else {
                valor = false;
                res.send(JSON.parse(redisCategory));
            }
        })
    } catch (error) {
        res.send(error);
    }

}

//localhost:4000/catalogo/productos/rango/
exports.rango = async(req, res) => {

    var precio;
    var precioMenor;
    var precioMayor;
    var valor = true;


    try {

        client.get('/catalogo/productos/rango', function(error, redisRange) {
            if (error) {
                console.log(error);
                throw error;
            }
            if (redisRange === null) {
                var range = [];
                fetch(process.env.MOCKP_ROUTE).then(function(mockProductos) {
                        return mockProductos.json();
                    })
                    .then(mockProductos => {
                        precioMenor = parseInt(mockProductos.producto[0].precio);
                        precioMayor = parseInt(mockProductos.producto[0].precio);
                        mockProductos.producto.forEach(productoActualMock => {
                            precio = parseInt(productoActualMock.precio);
                            if (precio < precioMenor) {
                                precioMenor = precio;
                            } else if (precio > precioMayor) {
                                precioMayor = precio;
                            }
                        })
                        range = { precioMenor, precioMayor };
                        client.setex('/catalogo/productos/rango', process.env.TMPREDIS, JSON.stringify(range), redis.print);
                        res.send(range);
                    })
                    .catch(function(err) {
                        console.log(err);
                    });

            } else {
                res.send(JSON.parse(redisRange));
            }
        });
    } catch (error) {
        res.send(error);
    }
};

//metodo implementado para verificar las imagenes leo - diego
//localhost:4000/catalogo/imagenes/""""
exports.imagen = async(req, res, next) => {

    try {
        let validacion = true;
        let listaImagen = await imagen.find();

        if (listaImagen.length === 0)
            throw error(constantes.IMG_NO_ENC, "Err: Imagenes no tiene datos.");

        validacion = false;
        res.send(listaImagen);

    } catch (error) {
        next(error);
    }

};


//localhost:4000/catalogo/productos/""""
exports.id = async(req, res, next) => {

    try {

        const idProdBusqueda = parseInt(req.params.id);

        if (isNaN(idProdBusqueda))
            throw error(constantes.TIPO_NO_VAL, "Err: Tipo de idProducto no valido.");

        const productoMongo = await producto.find({ idProducto: idProdBusqueda });

        if (productoMongo.length > 1)
            throw error(constantes.ERR_NEG_MONGO, "Err: La busqueda de mongo retorno más de un proucto");

        fetch(process.env.MOCKP_ROUTE).then((mockReponse) => mockReponse.json())
            .then(mockData => {

                if (!mockData || !mockData.producto)
                    throw error(constantes.MOCK_RES_ERR, "Err: El mock no contiene datos de productos o no cumple el formato esperado")

                let productFound = mockData.producto.find(productoMock => productoMock.idProducto === idProdBusqueda);

                if (!productFound || productFound.length <= 0)
                    throw error(constantes.PROD_NO_ENC, "Err: Producto no encontrado en API Catalogo Aval.");

                if (productoMongo.length) {
                    productFound.imagen = productoMongo[0].imagen;
                    productFound.miniatura = productoMongo[0].miniatura;
                }
                return productFound;

            }).then(producto => res.send(producto)).catch(next);
    } catch (err) {
        next(err);
    }
};