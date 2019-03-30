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
router.get('/catalogo/productos/', async (req, res) => {
    precioMenor = req.query.from ? req.query.from : 0;
    precioMayor= req.query.to ? req.query.to :0;
    categ = req.query.categ ? req.query.categ :0; 
    disp= req.query.disp? req.query.disp:0; 
    let result;
    var cadena = "";
    try{
        
        cadena = `Categoria: ${String(categ)}, precioMenor: ${parseInt(precioMenor)}, precioMayor: ${parseInt(precioMayor)}, disponibilidad: ${String(disp)}.`

//--------------------------------------------------------------------------------------------        



    client.get('mensaje', function (error, result) {
        if (error) {
            console.log(error);
            throw error;
        }
        if (result === null){
            console.log('result is: ',result);
        } else {
            client.get('/catalogo/productos/', function (error, result) {
                if (error) {
                    console.log(error);
                    throw error;
                }
                    valor = false;
                    res.send(result);
            });
        }
    });


//--------------------------------------------------------------------------------------------
    {
        const productos = await producto.find({});        
        let products ={producto: []};
        const test = await  fetch('http://localhost:8080/Inventario/getProductoAll').then(function(response) {
            return response.json();
        })
        .then(response=>{
            response.producto.forEach(element=>{
                const productFound = productos.filter(value => value.idProducto === element.idProducto)
                if(productFound.length > 0) {
                    element.imagen = productFound[0].imagen;
                    element.miniatura = productFound[0].miniatura;
                    
                        products.producto.push({ 
                            "idProducto": element.idProducto,
                            "categoria": element.categoria,
                            "cantidadDisponible": element.cantidadDisponible,
                            "precio": element.precio,
                            "descripcion": element.descripcion,
                            "imagen": element.imagen,
                            "miniatura": element.miniatura                        
                        });
                    }
                    
                    
            })
            console.log(String(categ));
            console.log(parseInt(precioMenor));
            console.log(parseInt(precioMayor));
            console.log(String(disp));
            
              
            if (String(categ) !== "0" || parseInt(precioMenor) !== 0 || parseInt(precioMayor) !== 0 || String(disp) !== "0"){
            filterBy = { "categoria": categ, "precioMayor": precioMayor, "precioMenor": precioMenor, "disponibilidad": disp},
            result = products.producto.filter(function (productoActual) {
                if (productoActual.categoria === filterBy.categoria || 
                    (parseInt(productoActual.precio) <= filterBy.precioMayor && parseInt(productoActual.precio) >= filterBy.precioMenor)
                    || (parseInt(productoActual.cantidadDisponible) > 0 && String(filterBy.disponibilidad) === "true")
                    || (parseInt(productoActual.cantidadDisponible) === 0 && String(filterBy.disponibilidad) === "false")){
                        return true;
                    }
            });
            client.setex('mensaje', 30, cadena, redis.print);
            products = result;
            client.setex('/catalogo/productos/', 30, JSON.stringify(products), redis.print);
            }   
        })
        .catch(function(err){
            console.log(err);
        });
        
        res.json(products);
    }  
     } catch (error) {
        res.send(error);
    }
});

//localhost:4000/catalogo/productos/categorias/
router.get('/catalogo/productos/categorias', async (req, res) => {

    var valor=true;
    try{
        
        client.get('/catalogo/productos/categorias', function (error, result) {
            if (error) {
                console.log(error);
                throw error;
            }
            if (result === null){
                console.log('result is: ',result);
                //valor = 1;
            } else {
                valor = false;
                res.send(result);
            }
        });

        if (valor === true) { 
            let categoria = [];       
            await  fetch('http://localhost:8080/Inventario/getCategoriaAll')
            .then(function(response) {
                return response.json();
            })
            .then(response=>{
                response.categorias.forEach(element=>{
                    categoria.push(element.categoria);
                })
                client.setex('/catalogo/productos/categorias', 30, JSON.stringify(response), redis.print);
                return categoria;
            })
            .catch(function(err){
                console.log(err);
        });
        res.json({categoria});
    }
    }
    catch (error) {
        res.send(error);
    }
});

//localhost:4000/catalogo/productos/rango/
router.get('/catalogo/productos/rango', async (req, res) => {
    var precio;
    var precioMenor;
    var precioMayor;
    valor =true;
    try{
        client.get('/catalogo/productos/rango', function (error, result) {
            if (error) {
                console.log(error);
                throw error;
            }
            if (result === null){
                console.log('result is: ',result);
            } else {
                valor = false;
                res.send(result);
            }
        });

        if (valor === true) {
            var rango = [];
            await  fetch('http://localhost:8080/Inventario/getProductoAll').then(function(response) {
                return response.json();
            })
            .then(response=>{
                precioMenor = parseInt(response.producto[0].precio);
                precioMayor = parseInt(response.producto[0].precio);
                response.producto.forEach(element=>{
                    precio = parseInt(element.precio);
                    if (precio < precioMenor){
                    precioMenor = precio;
                    } else if (precio > precioMayor){
                    precioMayor = precio;
                    }
                })
                rango = {precioMenor, precioMayor};
                client.setex('/catalogo/productos/rango', 30, JSON.stringify(rango), redis.print);
                return rango;
            })
            .catch(function(err){
                console.log(err);
            });
            res.json(rango);
        }
    } catch (error) {
        res.send(error);
    }
});

//localhost:4000/alogo/productos/""""
router.get('/catalogo/productos/:id', async (req, res) => {
    var validar = 0;
    try{
        const id = req.params.id;
        console.log(id);
        const productos = await producto.find({idProducto: id});

        var data = {
            idProducto: "",
            categoria: "",
            cantidadDisponible: "",
            precio: "",
            descripcion: "",
            imagen: "",
            miniatura: ""
        };

        await  fetch(process.env.MOCKP_ROUTE).then(function(response) {
            return response.json();
        })
        .then(response=>{
            response.producto.forEach(element=>{
                if (element.idProducto == id){
                    data = {
                        idProducto: element.idProducto,
                        categoria: element.categoria,
                        cantidadDisponible: element.cantidadDisponible,
                        precio: element.precio,
                        descripcion: element.descripcion,
                        imagen: productos[0].imagen,
                        miniatura: productos[0].miniatura
                    };
                    validar = 1;                    
                }
            })
        })
        .catch(function(err){
            console.log(err);
        });
        if (validar != 1) {
            res.status(400).send({ error: "Producto no encontrado." });
        } else {
        res.json(data);      
        }
    }        
    catch (error) {
        res.send(error);
    }
});

module.exports = router;
