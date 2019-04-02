const chai = require('chai'), 
    chaiHttp = require('chai-http'),
    app = require('../src/app'),
    assertArrays = require('chai-arrays'),
    expect = chai.expect;

chai.use(chaiHttp);
chai.should();
chai.use(assertArrays);

describe("TechnoShop GA", () => {

    describe("GET /", ()=> {
        it("Deberia Pasar ya que existen productos", done => {
            chai.request(app)                
                .get('/catalogo/productos/')
                .query({from:0, to: 100000000, categ: 'TV', disp: true})
                .then(res =>{
                    expect(res.statusCode).to.be.equal(200);
                    expect(res.body).should.be.a('object');
                    expect(res.body.producto[0]).to.have.property('idProducto');
                    expect(res.body.producto[0]).to.have.property('categoria');
                    expect(res.body.producto[0]).to.have.property('cantidadDisponible');
                    expect(res.body.producto[0]).to.have.property('precio');
                    expect(res.body.producto[0]).to.have.property('descripcion');
                    expect(res.body.producto[0]).to.have.property('imagen');
                    expect(res.body.producto[0]).to.have.property('miniatura');
                    done();
                })
        })
        it("Deberia Pasar ya que llama todos los productos", done => {
            chai.request(app)                
                .get('/catalogo/productos/')
                .then(res => {
                    expect(res.statusCode).to.be.equal(200);
                    expect(res.text).should.be.a('object');                    
                    expect(res.body.producto[0]).to.have.property('idProducto');
                    expect(res.body.producto[0]).to.have.property('categoria');
                    expect(res.body.producto[0]).to.have.property('cantidadDisponible');
                    expect(res.body.producto[0]).to.have.property('precio');
                    expect(res.body.producto[0]).to.have.property('descripcion');
                    expect(res.body.producto[0]).to.have.property('imagen');
                    expect(res.body.producto[0]).to.have.property('miniatura');
                    done();
                })
        })
        it("Deberia Pasar llama todas las categorias", done => {
            chai.request(app)                
                .get('/catalogo/productos/categorias')
                .then(res =>{
                    expect(res.statusCode).to.be.equal(200);
                    expect(res.body).should.be.a('object');
                    expect(res.text).to.be.containing('categorias');
                    done();
                })
        })
        it("Deberia Pasar Saca el Precio Menor y el Precio Mayor", done => {
            chai.request(app)                
                .get('/catalogo/productos/rango')
                .then(res =>{
                    expect(res.statusCode).to.be.equal(200);
                    expect(res.text).to.be.containing('precioMenor');
                    expect(res.text).to.be.containing('precioMayor');
                    done();
                })
        })
        it("Deberia Pasar llama un producto especifico", done => {
            chai.request(app)                
                .get('/catalogo/productos/5')
                .then(res =>{
                    expect(res.statusCode).to.be.equal(200);
                    expect(res.body).to.have.property('idProducto');
                    expect(res.body).to.have.property('categoria');
                    expect(res.body).to.have.property('cantidadDisponible');
                    expect(res.body).to.have.property('precio');
                    expect(res.body).to.have.property('descripcion');
                    expect(res.body).to.have.property('imagen');
                    expect(res.body).to.have.property('miniatura');
                    done();
                })
        })
        it("Deberia Pasar llama un producto que no existe", done => {
            chai.request(app)                
                .get('/catalogo/productos/dafasf')
                .then(res =>{
                    expect(res.statusCode).to.be.equal(404);
                    expect(res.body.message).to.be.eql('Err: Producto no encontrado en API Catalogo Aval.');
                    done();
                })
        })
        it("Deberia Pasar ya que no existen productos con esta busqueda", done => {
            chai.request(app)                
                .get('/catalogo/productos/')
                .query({from:0, to: 10000, categ: 'TV', disp: false})
                .then(res =>{
                    expect(res.statusCode).to.be.equal(200);
                    expect(res.body).to.not.have.property('idProducto');
                    expect(res.body).to.not.have.property('categoria');
                    expect(res.body).to.not.have.property('cantidadDisponible');
                    expect(res.body).to.not.have.property('precio');
                    expect(res.body).to.not.have.property('descripcion');
                    expect(res.body).to.not.have.property('imagen');
                    expect(res.body).to.not.have.property('miniatura');
                    done();
                })
        })
    })
})