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
    "idProducto": "000302",
    "categoria": "tv",
    "cantidadDisponible": 20,
    "precio": 5000,
    "descripcion": "super bbb",
    "imagen": "",
    "miniatura": ""
}];






//localhost:4000/productos
router.get('/catalogo/productos', async (req, res) => {
    console.log("file");

    var test = await  fetch('http://localhost:8080/Inventario/getCategoriaAll').then(function(response) {
        return response.json();
        })
        .then(function(myJson) {
        return myJson;
        })
        .catch(function(err){
            console.log(err);
    });

    console.log("Partamos de aca")
    console.log(test);
    console.log("quiza")

    try{
        const productos = await producto.find({});        
        res.json(productos);
        //console.log(myvariable + "funciono");
    } catch (error) {
        res.send(error);
    }
});



//localhost:4000/producto/categoria/""""
router.get('/catalogo/productos/categorias', async (req, res) => {
    console.log('its me again');
    try{
        var cate = [];
         
        for (i = 0; i < catalogo.length; i++){
            cate[i] = catalogo[i].categoria;
        }
        console.log(cate);
        let unique = [...new Set(cate)];
        console.log(unique);
        res.json(unique);
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
        precioMenor = catalogo[0].precio;
        precioMayor = catalogo[0].precio;
        console.log(precioMenor)
        for (i = 0; i < catalogo.length; i++){
            precio = catalogo[i].precio;
            if (precioMenor > precio){
                precioMenor = precio;
            } else if (precioMayor < precio){
                precioMayor = precio;
            }
        } 
        //console.log(ret);
        console.log(precioMenor);
        console.log(precioMayor);
        //console.log(cont);
        var rango = {precioMayor, precioMenor}
        res.json(rango);
    } catch (error) {
        res.send(error);
    }
});


//localhost:4000/producto/precio?from=####&to=####
//localhost:4000/productos/precio?from=####&to=####
router.get('/catalogo/productos/precio', async (req, res) => {
    console.log('its me again');
    var precioMenor = req.query.from;
    var precioMayor = req.query.to;
    var cont = 0;
    var ret = "";
    console.log(precioMenor, precioMayor);
    try{
        for (i = 0; i < catalogo.length; i++){
        if (catalogo[i].precio >= precioMenor && catalogo[i].precio <= precioMayor){
            cont = cont + 1;
            console.log(catalogo[i].idProducto);
            //ret = ret + catalogo[i].idProducto;
            var id = catalogo.idProducto;
            const productos = await producto.find({idProducto: id});        
            ret = ret + catalogo[i].idProducto + catalogo[i].categoria;
            //ret = catalogo[i].idProducto + catalogo[i].categoria + catalogo[i].cantidadDisponible + catalogo[i].precio + catalogo[i].descripcion + productos[i].imagen + productos[i].miniatura
            //catalogo[i].idProducto = productos.idProducto;
            //catalogo[i].imagen = productos.imagen;
            //catalogo[i].miniatura = productos.miniatura;
        }         
        } 
        console.log(ret);
        console.log(cont);
        res.json(catalogo);
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
        var cont = 0;
        console.log(id);
            const productos = await producto.find({idProducto: id});
            console.log(productos);
            for (i = 0; i < catalogo.length; i++){
                if (catalogo[i].idProducto == id){
                    cont = i;
                    break;
                }
            }
            //console.log(catalogo[cont].idProducto)
            var data = {
                idProducto: catalogo[cont].idProducto,
                categoria: catalogo[cont].categoria,
                cantidadDisponible: catalogo[cont].cantidadDisponible,
                precio: catalogo[cont].precio,
                imagen: productos[0].imagen,
                miniatura: productos[0].miniatura
            };
            res.json(data);      
        }
        
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
