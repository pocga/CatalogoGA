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
    let result;
    var valor =true;
    var cadena = "";
    try{
        
        var rediskey = `categ-${String(categ)}precioMenor-${parseInt(precioMenor)}precioMayor-${parseInt(precioMayor)}disponibilidad-${String(disp)}.`
      

        client.get(rediskey, function (error, result) {
            if (error) {
                console.log(error);
                throw error;
            }
            if (result === null){
                console.log('result is: ',result);
            
            } else {
                console.log('por fa')
                valor = false;
                res.send(JSON.parse(result));
            }
        });

        if (valor === true)
        {
        const productos = await producto.find({});        
        let products ={producto: []};
        let products2;
        await  fetch('http://localhost:8080/Inventario/getProductoAll').then(function(response) {
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

            console.log(catarray, parseInt(precioMenor), parseInt(precioMayor), String(disp));
            var str = String(categ)
            var catarray = categ ? categ.split(",") : categ;
            console.log(parseInt(precioMayor));
            var isWithinCategory = function(filterCateg, currentCategory)
            {
                for (i = 0; i < filterCateg.length; i++) {
                    if (currentCategory == filterCateg[i]) {
                        return true;
                    }
                }
                return false;
            }
            result = products.product;
            if (catarray.length>0 || parseInt(precioMenor) !== 0 || parseInt(precioMayor) !== 0 || String(disp) !== "0"){
            filterBy = { "categoria": catarray, "precioMayor": precioMayor, "precioMenor": precioMenor, "disponibilidad": disp},
            result = products.producto.filter(function (productoActual) {
                if ((catarray ? isWithinCategory(catarray, productoActual.categoria) : true) &&
                    (filterBy.precioMayor ? parseInt(productoActual.precio) <= filterBy.precioMayor : true) && 
                    (filterBy.precioMenor ? parseInt(productoActual.precio) >= filterBy.precioMenor : true) &&
                    (filterBy.disponibilidad ? (String(filterBy.disponibilidad) === "true" ? parseInt(productoActual.cantidadDisponible) > 0 
                    : (String(filterBy.disponibilidad) === "false" ? parseInt(productoActual.cantidadDisponible) === 0 : false)) : true)) {
	                return true;
            }
            });            
            products = result;
            client.setex(rediskey, 30, JSON.stringify(products), redis.print);
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
            
            } else {
                valor = false;
                res.send(JSON.parse(result));
            }
        });
     
    
        {
        let categoria = [];       
            await  fetch('http://localhost:8080/Inventario/getCategoriaAll')
            .then(function(response) {
                return response.json();
            })
            .then(response=>{
                response.categorias.forEach(element=>{
                    categoria.push(element.categoria);
                })
                client.setex('/catalogo/productos/categorias', 30, JSON.stringify(categoria), redis.print);
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
        client.get('rango', function (error, result) {
            if (error) {
                console.log(error);
                throw error;
            }
            if (result === null){
                console.log('result is: ',result);
            } else {
                valor = false;
                console.log("Ahi vamos viendo");
                res.send(JSON.parse(result));
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
                client.setex('rango', 30, JSON.stringify(rango), redis.print);
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

        await  fetch('http://localhost:8080/Inventario/getProductoAll').then(function(response) {
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
