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






//localhost:4000/productos
router.get('/catalogo/productos', async (req, res) => {
    console.log("file");

    /*var test = await  fetch('http://localhost:8080/Inventario/getProductoAll').then(function(response) {
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
    console.log("quiza")*/

    


    
    try{
        //const productos = await producto.find({});        

        const productos = await producto.find({});        
        
        let products = [];
        catalogo.forEach(element => {
            const productFound = productos.filter(value => value.idProducto === element.idProducto)
            if(productFound.length > 0) {
                element.imagen = productFound[0].imagen;
                element.miniatura = productFound[0].miniatura;
                products.push(...catalogo)
            }

        })



        /*      
        let products = [];
        catalogo.forEach(element => {
            productos = array2.filter(value => value.idProducto === element.idProducto)
            if(productos.length > 0) {
                element.imagen = productos[0].imagen;
                element.miniatura = productos[0].miniatura;
                products.push(...element)
            }
        })
        if(products.length > 0 ) {
            console.log(products)
        }else {
            console.log('No hay productos para mostrar')
        }*/


        res.json(catalogo);
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


            //const cityJobsData = fetch('http://api.open-notify.org/astros.json');
            //cityJobsData
            //.then(data => data.json())
            //.catch(err => console.log(err));

         //console.log(test);
         /*
        catalogo.forEach(element =>{
                cate.push(element.categoria);
                //console.log('1');
            })
            //var jsonfiledef = JSON.parse(test);
            //console.log(cate);
        */    
        //console.log(cate);
        //let unique = [...new Set(cate)];
        //console.log(unique);
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
        precioMenor = catalogo[0].precio;
        precioMayor = catalogo[0].precio;
        console.log(precioMenor)
        catalogo.forEach(element => {
            precio = element.precio;
            if (precioMenor > precio){
                precioMenor = precio;
            } else if (precioMayor < precio){
                precioMayor = precio;
            }
        })
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
router.get('/catalogo/productos', async (req, res) => {
    console.log('its me again');
    var precioMenor = req.query.from;
    var precioMayor = req.query.to;
    var cont = 0;
    var ret = "";
    console.log(precioMenor, precioMayor);
    try{
        catalogo.forEach(element => {
            if (element.precio >= precioMenor && element.precio <= precioMayor){
                cont = cont + 1;
                console.log(element.idProducto);
                //ret = ret + catalogo[i].idProducto;
                var id = element.idProducto;
                //const productos = await producto.find({idProducto: id});        
                ret = ret + catalogo[i].idProducto + catalogo[i].categoria;
                //ret = catalogo[i].idProducto + catalogo[i].categoria + catalogo[i].cantidadDisponible + catalogo[i].precio + catalogo[i].descripcion + productos[i].imagen + productos[i].miniatura
                //catalogo[i].idProducto = productos.idProducto;
                //catalogo[i].imagen = productos.imagen;
                //catalogo[i].miniatura = productos.miniatura;
            }            
        })
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
        //var cont = 0;
        console.log(id);
        const productos = await producto.find({idProducto: id});
        var data = {
            idProducto: "",
            categoria: "",
            cantidadDisponible: "",
            precio: "",
            imagen: "",
            miniatura: ""
        };
        catalogo.forEach(element => {
            if (element.idProducto == id){
                data = {
                    idProducto: element.idProducto,
                    categoria: element.categoria,
                    cantidadDisponible: element.cantidadDisponible,
                    precio: element.precio,
                    imagen: productos[0].imagen,
                    miniatura: productos[0].miniatura
                };
            }
        })
            
        //console.log(catalogo[cont].idProducto)
        /*var data = {
            idProducto: catalogo[cont].idProducto,
            categoria: catalogo[cont].categoria,
            cantidadDisponible: catalogo[cont].cantidadDisponible,
            precio: catalogo[cont].precio,
            imagen: productos[0].imagen,
            miniatura: productos[0].miniatura
        };*/
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
