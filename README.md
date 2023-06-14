# By Andry Morales

## tienda de estetica y belleza

### En esta web nos vamos a encontrar con:

-Una single page responsability con los campos necesarios para poder crearnos un usuario.

-hacer loggin y loggout

-Esta desarrollada para visualizar los productos de belleza disponibles y poder añadirlos a un carrito de compra o eliminarlos en su defecto.

-Podremos encontrar en el footer botones con sus enlaces correspondientes a las redes sociales de la tienda

-Encontraremos tambien los servicios con los que cuenta la tienda de estetica con el objetivo de que en un futuro se pueda añadir

como extra, la visualizacion de un calendario con los servicios antes mencionados y donde podemos reservar las citas correspondientes.

-**Modelo de datos**

```
Product:

id: Types.ObjectId,

name: string,

image: string,

price: number,

category: “producto” | “servicio”,

area: “ceja” | “pestaña” | “manicura”,

description: string,

isAvailable: boolean,

```

**-Modelo de usuario**

```
UserI :

id: Types.ObjectId;

name: string;

email: string;

passwd: string;

isDelete: boolean;

role: “user” | “admin”;

myProducts: Array<{
productId: types.ObjectId;

amount: number;

price: number,}>;
```

## EndPoints

**-user**

```
◾ [POST]/register ➡ Recibe datos al registrar a un usuario.

✅ STATUS 201
◾ [POST]/login ➡ Recibe datos del usuario para comprobar si está creado en la BD.

✅ STATUS 200
◾ [PATCH]/delete/:id ➡ Actualiza la propiedad isDelete a true del usuario borrado por id

✅ STATUS 200
◾ [PATCH]/cart/add/:userId/:productId ➡ Recibe un id del producto, un id del usuario y Añade el producto a la propiedad myProducts del usuario

✅ STATUS 200
◾ [PATCH]/cart/update/:userId/:productId ➡ Recibe un id del producto, un id del usuario y actualiza el producto dentro de la propiedad myProducts del usuario

✅ STATUS 200
◾ [PATCH]/cart/delete/:userId/:productId ➡ Recibe un id del producto, un id del usuario y borra el producto de la propiedad myProducts del usuario

✅ STATUS 200

```

**-product**

```
◾ [GET]/➡ Devuelve un array con todos los productos.

✅ STATUS: 200
◾ [GET]/:id➡ Devuelve un objeto con el producto que contiene el id de la query.

✅ STATUS: 200
◾ [POST]/➡ Recibe un objeto product sin id para crearlo en la BD y devuelve el mismo objeto con id creada. (solo puede crear el admin)

✅ STATUS: 201
◾ [PATCH]/:id➡ Recibe un id del producto y lo actualiza (solo puede crear el admin)

✅ STATUS: 200
◾ [DELETE]/:id➡ elimina de la BD el product por id y devuelve un objeto vacio. (solo puede eliminar el admin)

✅ STATUS: 200

```
