const express = require('express'),
    router = express.Router(),
    producto = require('../model/producto'),
    fetch = require('node-fetch'),
    redis = require('redis');
    
var client = redis.createClient(process.env.PORTRED, process.env.HOSTRED);

//Creating connection with redis
client.on('connect', function() {
    console.log('Redis client connected');
});

    


//localhost:4000/catalogo/catalogo/productos/
//localhost:4000/catalogo/catalogo/productos?from=####&to=#### -> Consulta por rango
//localhost:4000/catalogo/catalogo/productos?categ="""" -> Consulta por categoria
//localhost:4000/catalogo/catalogo/productos?disp=true/false -> Consulta por disponibilidad
router.get('/catalogo/productos/', async (req, res) => {
    
    precioMenor = req.query.from ? req.query.from : 0;
    precioMayor= req.query.to ? req.query.to :0;
    categ = req.query.categ ? req.query.categ :0; 
    disp= req.query.disp? req.query.disp:0; 
    let productsReturn;
    var valor =true;

    try{

        const productos = await producto.find({});
        var rediskey = `categ-${categ}precioMenor-${precioMenor}precioMayor-${precioMayor}disponibilidad-${disp}.`;
        client.get(rediskey, function (error, redisFilter) {
            if (error) {
                console.log(error);
                throw error;
            }
            if (redisFilter === null){
                        
            let productsList ={producto: []};
            fetch(process.env.MOCKP_ROUTE).then(function(productosMock) {
                return productosMock.json();
            })
            .then(productosMock=>{
                productosMock.producto.forEach(productoActualMock=>{
                    const productFound = productos.filter(value => value.idProducto === productoActualMock.idProducto)
                    if(productFound.length > 0) {
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
                var isWithinCategory = function(filterCateg, currentCategory)
                {
                    for (i = 0; i < filterCateg.length; i++) {
                        if (currentCategory == filterCateg[i]) {
                            return true;
                        }
                    }
                    return false;
                }
                productsReturn = productsList.product;
                if (catarray.length>0 || parseInt(precioMenor) !== 0 || parseInt(precioMayor) !== 0 || String(disp) !== "0"){
                filterBy = { "categoria": catarray, "precioMayor": precioMayor, "precioMenor": precioMenor, "disponibilidad": disp},
                productsReturn = productsList.producto.filter(function (productoActual) {
                    if ((catarray ? isWithinCategory(catarray, productoActual.categoria) : true) &&
                        (filterBy.precioMayor ? parseInt(productoActual.precio) <= filterBy.precioMayor : true) && 
                        (filterBy.precioMenor ? parseInt(productoActual.precio) >= filterBy.precioMenor : true) &&
                        (filterBy.disponibilidad ? (String(filterBy.disponibilidad) === "true" ? parseInt(productoActual.cantidadDisponible) > 0 
                        : (String(filterBy.disponibilidad) === "false" ? parseInt(productoActual.cantidadDisponible) === 0 : false)) : true)) {
                        return true;
                }
                });        
                productsList.producto = productsReturn;
                client.setex(rediskey, 30, JSON.stringify(productsList), redis.print);
                } 
                res.send(productsList);
                                    
            })
            .catch(function(err){
                console.log(err);
            });
                
            } else {
                res.send(JSON.parse(redisFilter));
            }
        });
  
    } catch (error) {
        sendresponse(error);
    }
});

//localhost:4000/catalogo/productos/categorias/
router.get('/catalogo/productos/categorias', async (req, res) => {
    
    //const sendresponse = option => res.end(JSON.parse(JSON.stringify(option)));
    try {
        let valor = true;
        client.get('/catalogo/productos/categorias', (error, redisCategory) => {
            if (error) {
                console.log(error);
                throw error;
            }
            if (redisCategory === null){ 
                fetch(process.env.MOCKC_ROUTE)
                .then(function(mockProductos) {
                    return mockProductos.json();
                })
                .then(mockProductos=>{
                    client.setex('/catalogo/productos/categorias', 30, JSON.stringify(mockProductos), redis.print);
                    res.send(mockProductos);
                })
                .catch(function(err){
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

});

//localhost:4000/catalogo/productos/rango/
router.get('/catalogo/productos/rango', async (req, res, next) => {

    var precio;
    var precioMenor;
    var precioMayor;
    var valor = true;
    //var validar = 0;

    try{

        client.get('/catalogo/productos/rango', function (error, redisRange) {
            let validar=0;
            if (error) {
                console.log(error);
                throw error;
            }
            if (redisRange === null){
                var range = [];
            fetch(process.env.MOCKP_ROUTE).then(function(mockProductos) {  
            return mockProductos.json();
            })
            .then(mockProductos=>{
                precioMenor = parseInt(mockProductos.producto[0].precio);
                precioMayor = parseInt(mockProductos.producto[0].precio);
                mockProductos.producto.forEach(productoActualMock=>{
                    precio = parseInt(productoActualMock.precio);
                    if (precio < precioMenor){
                    precioMenor = precio;
                    } else if (precio > precioMayor){
                    precioMayor = precio;
                    }
                })
                range = {precioMenor, precioMayor};
                client.setex('/catalogo/productos/rango', 30, JSON.stringify(range), redis.print);
                res.send(range);
            })
            .catch(function(err){
                console.log(err);
            });
                
            } else {
                res.send(JSON.parse(redisRange));
            }
        });
    } catch (error) {
        res.send(error);
    }
});

//localhost:4000/alogo/productos/""""
router.get('/catalogo/productos/:id', async (req, res) => {
    
    try{
        let id = req.params.id;
        const productos = await producto.find({idProducto: id});

        fetch(process.env.MOCKP_ROUTE).then(function(mockProductos) {  
        return mockProductos.json();
        })
        .then(mockProductos=>{
            let productFound = mockProductos.producto
                              .filter(element => element.idProducto === String(id));
            productFound = productFound.map(element => {
                element['imagen'] = productos[0].imagen;
                element['miniatura'] = productos[0].miniatura;
                return element;
            });
            if (productFound.length <= 0) {
                res.send({ error: "Producto no encontrado." });
            } else {
                res.send({productFound});      
            }
        })
        .catch(function(err){
            res.json('Internal Error', err);
        });
    }        
    catch (error) {
        res.send(error);
    }
});

module.exports = router;
