const express = require('express');
const router = express.Router();
const producto = require('../model/producto');
const fetch = require('node-fetch')
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






//localhost:4000/productos
router.get('/catalogo/productos/', async (req, res) => {
    console.log("file");   
    try{

        
        const productos = await producto.find({});        
        let products ={producto: []};;
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
            console.log(products);
            return products;
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
    console.log('its me again');
       
    try{
        var cate = [];
        const test = await  fetch('http://localhost:8080/Inventario/getProductoAll').then(function(response) {
            return response.json();
        })
        .then(response=>{
            response.producto.forEach(element=>{
                cate += element.categoria + ',';
            })
            console.log('CATE=', cate);
            return cate;
        })
        .catch(function(err){
            console.log(err);
        });
        res.json(cate);
    }
    catch (error) {
        res.send(error);
    }
});


router.get('/catalogo/productos/rango', async (req, res) => {
    console.log('its me again');
    var precio = 0;
    var precioMenor = 0;
    var precioMayor = 0;
    var ret = "";
    console.log(precioMenor, precioMayor);
    try{
        var rango = [];
        const test = await  fetch('http://localhost:8080/Inventario/getProductoAll').then(function(response) {
            return response.json();
        })
        .then(response=>{
            precioMenor = response.producto[0].precio;
            console.log('CATE=', precioMenor);
            precioMayor = response.producto[0].precio;
            console.log('CATE=', precioMayor);
            response.producto.forEach(element=>{
                //cate += element.categoria + ',';
                precio = element.precio;
                console.log('algo=', precio);
                if (precioMenor > precio){
                  precioMenor = precio;
                } else if (precioMayor < precio){
                  precioMayor = precio;
                }
            })
            rango += precioMenor + ',' + precioMayor;
            
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


//localhost:4000/producto/precio?from=####&to=####
//localhost:4000/productos/precio?from=####&to=####
router.get('/catalogo/productos/par', async (req, res) => {
    console.log('its me again');
    var precioMenor = req.query.from;
    console.log(precioMenor);
    var precioMayor = req.query.to;
    console.log(precioMayor);
    var categoria = req.query.cat;
    console.log(categoria);
    var disp = req.query.disp;
    console.log(disp);
    var cont = 0;
    var ret = "";
    
    //console.log(precioMenor, precioMayor);
    try{
        const productos = await producto.find({});        
        let products ={producto: []};;
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
            console.log(products);
            return products;
        })
        .catch(function(err){
            console.log(err);
        });
        res.json(products);
    } catch (error) {
        res.send(error);
    }
});

//localhost:4000/producto/id/""""
router.get('/catalogo/productos/:id', async (req, res) => {
    console.log('its me');
    //console.log(JSON.stringify(catalogo));
    try{
        var id = req.params.id;
        //var cont = 0;
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

        let products = [];
        const test = await  fetch('http://localhost:8080/Inventario/getProductoAll').then(function(response) {
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
                }
            })

            console.log(data);
            return data;
        })
        .catch(function(err){
            console.log(err);
        });
        res.json(data);      
    }        
    catch (error) {
        res.send(error);
    }
});








module.exports = router;
