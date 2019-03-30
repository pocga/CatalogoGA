const express = require('express');
const router = express.Router();
const producto = require('../model/producto');
const fetch = require('node-fetch')
//var request = require('request');
//var getJSON = require('get-json')
//const mongoose = require('mongoose');
//var fs = require('fs');

//var data = fs.read('catalogo.json')
//var catalogo = JSON.parse(data); 
//var dataprod = JSON.stringify(productos, null, 2);
//fs.writeFile('catalogo.json', productos, finished);

var catalogo = [{
    "idProducto": "001",
    "categoria": "movil",
    "cantidadDisponible": 20,
    "precio": 15000,
    "descripcion": "super bbb",
    "imagen": "",
    "miniatura": ""
},
{
    "idProducto": "002",
    "categoria": "tv",
    "cantidadDisponible": 20,
    "precio": 10000,
    "descripcion": "super bbb",
    "imagen": "",
    "miniatura": ""
},
{
    "idProducto": "003",
    "categoria": "tv",
    "cantidadDisponible": 20,
    "precio": 4000,
    "descripcion": "super bbb",
    "imagen": "",
    "miniatura": ""
},
{
    "idProducto": "004",
    "categoria": "tv",
    "cantidadDisponible": 20,
    "precio": 25000,
    "descripcion": "super bbb",
    "imagen": "",
    "miniatura": ""
},
{
    "idProducto": "005",
    "categoria": "tv",
    "cantidadDisponible": 20,
    "precio": 2000,
    "descripcion": "super bbb",
    "imagen": "",
    "miniatura": ""
}];


const mockUrl= process.env.MOCK_URL
console.log(`esta es la url dl mock ${process.env.MOCK_URL}`);


router.get('/catalogo/productos/', async (req, res) => {
    precioMenor = req.query.from ? req.query.from : 0;
    precioMayor= req.query.to ? req.query.to :0;
    categ = req.query.categ ? req.query.categ :0; 
    disp= req.query.disp? req.query.disp:0; 
    let result;
    try{
        
        const productos = await producto.find({});        
        let products ={producto: []};
        const test = await  fetch(mockUrl).then(function(response) {
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
            console.log(categ);
            
            filterBy = { "categoria": categ, "precioMayor": precioMayor, "precioMenor": precioMenor, "disponibilidad": disp},
            result = products.producto.filter(function (productoActual) {
                if (productoActual.categoria === filterBy.categoria || 
                    (productoActual.precio < filterBy.precioMayor && productoActual.precio > filterBy.precioMenor)
                    || (productoActual.cantidadDisponible > 0 && filterBy.disponibilidad)){
                        return true;
                    }
            });
        
         
            if(result.length>0){
                products.producto =  result;
            } else {
                result = products;
            }
        })
        .catch(function(err){
            console.log(err);
        });
        res.json(products);
     } catch (error) {
        res.send(error);
    }
});





//localhost:4000/producto/categoria/""""
router.get('/catalogo/productos/categorias', async (req, res) => {
       
    try{
        
        let categoria = [];
        const test = await  fetch(mockUrl)
        .then(function(response) {
            return response.json();
        })
        .then(response=>{
            response.categorias.forEach(element=>{
                categoria.push(element.categoria);
            })
            return categoria;
        })
        .catch(function(err){
            console.log(err);
        });
        res.json({categoria});
    }
    catch (error) {
        res.send(error);
    }
});


router.get('/catalogo/productos/rango', async (req, res) => {
    var precio;
    var precioMenor;
    var precioMayor;
    var ret = "";
    var cont = 0;
    try{
        var rango = [];
        const test = await  fetch(mockUrl).then(function(response) {
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
            return rango;
        })
        .catch(function(err){
            console.log(err);
        });
        res.json(rango);
    } catch (error) {
        res.send(error);
    }
});

//localhost:4000/producto/id/""""
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

        const test = await  fetch(mockUrl).then(function(response) {
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
                    Console.log("Estoy intentando")
                }
            })
        })
        .catch(function(err){
            console.log(err);
        });
        console.log(validar)
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
