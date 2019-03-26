const express = require('express');
const router = express.Router();
const producto = require('../model/producto');
//var request = require('request');
//var getJSON = require('get-json')
//const mongoose = require('mongoose');
//var fs = require('fs');

//var data = fs.read('catalogo.json')
//var catalogo = JSON.parse(data); 
//var dataprod = JSON.stringify(productos, null, 2);
//fs.writeFile('catalogo.json', productos, finished);

var catalogo = {
    "_id": "5c96b8dbcff17c34d8464276",
    "id": "",
    "categoria": "tv",
    "inventario": 20,
    "precio": 10000,
    "descripcion": "super bbb",
    "url_small": "",
    "url_large": ""
};



//localhost:4000/productos
router.get('/productos', async (req, res) => {
    console.log("file");

    /*getJSON('http://localhost:8080/Inventario/getProductoAll')
    .then(function(response) {
      //var allprod = response;
      console.log(response);
    }).catch(function(error) {
      console.log(error);
    });*/

    try{
        const productos = await producto.find({});        
        res.json(productos);
    } catch (error) {
        res.send(error);
    }
});

//localhost:4000/producto/categoria/""""
router.get('/productos/categorias', async (req, res) => {
    console.log('its me again');
    try{
        
        const productos = await producto.find({}, 'url_full_img');               
        res.json(productos);
        }
    catch (error) {
        res.send(error);
    }
});

//localhost:4000/producto/precio?from=####&to=####
//localhost:4000/productos/precio?from=####&to=####
router.get('/productos/precio', async (req, res) => {
    console.log('its me again');
    var precioMenor = req.query.from;
    var precioMayor = req.query.to;
    console.log(precioMenor, precioMayor);
    try{
        
        if (catalogo.precio >= precioMenor && catalogo.precio <= precioMayor){
            var id = catalogo._id;
            const productos = await producto.findById(id);        
            catalogo.id = productos.id;
            catalogo.url_large = productos.url_full_img;
            catalogo.url_small = productos.url_small_img;            
            res.json(catalogo);
        } else {
            res.send('no encontrado');
        }
    } catch (error) {
        res.send(error);
    }
});

//localhost:4000/producto/id/""""
router.get('/productos/:id', async (req, res) => {
    console.log('its me');
    //console.log(JSON.stringify(catalogo));
    try{

        

        var id = req.params.id;
            const productos = await producto.findById(id);        
            catalogo.id = productos._id;
            catalogo.url_large = productos.url_full_img;
            catalogo.url_small = productos.url_small_img;
            res.json(catalogo);      
        }
        //var o3 = Object.assign(catalogo, productos);
        //console.log(o3);
        //var productoFull = JSON.parse(productos._id, productos.url_small_img, productos.url_full_img);
        //console.log(productoFull);
        
    catch (error) {
        res.send(error);
    }
});







/*router.get('/producto/search/:id?', async (req, res, next) => {
    console.log('its me');
    try{
        //console.log('missed me?');
        //var id = req.params.id;   
        //ObjectId.fromString(id);  
        //console.log(producto);
        //const productos = await producto.findById(id)
        //res.json(productos);        
        var id = "5c96ba61cff17c34d8464277";
        producto.find({}, function(err, doc) { 
            console.log(doc);
            console.log(err);
            return res.send(doc);
        });
    } catch (error) {
        //res.send(error);
        console.log(error);
    }

    


});*/


module.exports = router;
