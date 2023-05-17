/*
A continuacion podemos encontrar el código de un supermercado que vende productos.
El código contiene
    - una clase Producto que representa un producto que vende el super
    - una clase Carrito que representa el carrito de compras de un cliente
    - una clase ProductoEnCarrito que representa un producto que se agrego al carrito
    - una función findProductBySku que simula una base de datos y busca un producto por su sku
El código tiene errores y varias cosas para mejorar / agregar
​
Ejercicios
1) Arreglar errores existentes en el código
    a) Al ejecutar agregarProducto 2 veces con los mismos valores debería agregar 1 solo producto con la suma de las cantidades.    
    b) Al ejecutar agregarProducto debería actualizar la lista de categorías solamente si la categoría no estaba en la lista.
    c) Si intento agregar un producto que no existe debería mostrar un mensaje de error.
​
2) Agregar la función eliminarProducto a la clase Carrito
    a) La función eliminarProducto recibe un sku y una cantidad (debe devolver una promesa)
    b) Si la cantidad es menor a la cantidad de ese producto en el carrito, se debe restar esa cantidad al producto
    c) Si la cantidad es mayor o igual a la cantidad de ese producto en el carrito, se debe eliminar el producto del carrito
    d) Si el producto no existe en el carrito, se debe mostrar un mensaje de error
    e) La función debe retornar una promesa
​
3) Utilizar la función eliminarProducto utilizando .then() y .catch()
​
*/

// Cada producto que vende el super es creado con esta clase
class Producto {
    constructor(sku, nombre, precio, categoria, stock = 10) {
      this.sku = sku;
      this.nombre = nombre;
      this.categoria = categoria;
      this.precio = precio;
      this.stock = stock;
    }
  }
  
  // Creo todos los productos que vende mi super
  const queso = new Producto('KS944RUR', 'Queso', 10, 'lacteos', 4);
  const gaseosa = new Producto('FN312PPE', 'Gaseosa', 5, 'bebidas');
  const cerveza = new Producto('PV332MJ', 'Cerveza', 20, 'bebidas');
  const arroz = new Producto('XX92LKI', 'Arroz', 7, 'alimentos', 20);
  const fideos = new Producto('UI999TY', 'Fideos', 5, 'alimentos');
  const lavandina = new Producto('RT324GD', 'Lavandina', 9, 'limpieza');
  const shampoo = new Producto('OL883YE', 'Shampoo', 3, 'higiene', 50);
  const jabon = new Producto('WE328NJ', 'Jabon', 4, 'higiene', 3);
  
  // Genero un listado de productos. Simulando base de datos
  const productosDelSuper = [queso, gaseosa, cerveza, arroz, fideos, lavandina, shampoo, jabon];
  
  // Cada cliente que venga a mi super va a crear un carrito
  class Carrito {
    constructor() {
      this.precioTotal = 0;
      this.productos = [];
      this.categorias = [];
    }
  
    /**
     * función que agrega @{cantidad} de productos con @{sku} al carrito
     */
    agregarProducto(sku, cantidad) {
      console.log(`Agregando ${cantidad} ${sku}`);
  
      // Busco el producto en la "base de datos"
      const producto = findProductBySku(sku);
  
      if (!producto) {
        console.log(`Error: El producto ${sku} no existe.`);
        return;
      }
  
      const productoEnCarrito = this.productos.find((p) => p.sku === sku);
  
      if (productoEnCarrito) {
        productoEnCarrito.cantidad += cantidad;
      } else {
        const nuevoProducto = new ProductoEnCarrito(sku, producto.nombre, cantidad);
        this.productos.push(nuevoProducto);
        this.categorias.push(producto.categoria);
      }
  
      this.precioTotal += producto.precio * cantidad;
    }
  
    /**
     * función que elimina @{cantidad} de productos con @{sku} del carrito
     */
    eliminarProducto(sku, cantidad) {
      return new Promise((resolve, reject) => {
        const productoEnCarrito = this.productos.find((p) => p.sku === sku);
  
        if (!productoEnCarrito) {
          reject(`Error: El producto ${sku} no está en el carrito.`);
          return;
        }
  
        if (cantidad < productoEnCarrito.cantidad) {
          productoEnCarrito.cantidad -= cantidad;
          this.precioTotal -= productoEnCarrito.precio * cantidad;
          resolve();
        } else {
          const index = this.productos.indexOf(productoEnCarrito);
          this.productos.splice(index, 1);
          this.categorias = this.productos.map((p) => p.categoria);
          this.precioTotal -= productoEnCarrito.precio * productoEnCarrito.cantidad;
          resolve();
        }
      });
    }
  }
  
  // Cada producto que se agrega al carrito es creado con esta clase
  class ProductoEnCarrito {
    constructor(sku, nombre, cantidad) {
      this.sku = sku;
      this.nombre = nombre;
      this.cantidad = cantidad;
    }
  }
  
  // Función que busca un producto por su sku en "la base de datos"
  function findProductBySku(sku) {
    return productosDelSuper.find((product) => product.sku === sku);
  }
  
  const carrito = new Carrito();
  carrito.agregarProducto('WE328NJ', 2);
  carrito.agregarProducto('WE328NJ', 2);
  carrito.agregarProducto('XX92LKI', 3);
  
  carrito.eliminarProducto('WE328NJ', 1)
    .then(() => {
      console.log('Producto eliminado correctamente.');
      console.log('Productos en el carrito:', carrito.productos);
      console.log('Categorías en el carrito:', carrito.categorias);
      console.log('Precio total:', carrito.precioTotal);
    })
    .catch((error) => {
      console.log(error);
    });
  