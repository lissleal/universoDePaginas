# Nombre del Proyecto

API para un ecommerce de libros

## Objetivo de esta preentrega

- Implementar un sistema de recuperacion de contraseña
- Crear nuevo role premium que permita crear productos
- Crear campo owner en schema products
- Modificar permisos de modificacion y eliminacion de productos según role y owner
- Implementar ruta para cambiar role de user a premium

## Iniciar el Proyecto

Para iniciar el proyecto, sigue los siguientes pasos:

1. Instala las dependencias:

npm install

"@faker-js/faker": "^8.3.1",
"bcrypt": "^5.1.1",
"commander": "^11.1.0",
"connect-mongo": "^5.1.0",
"cookie-parser": "^1.4.6",
"dotenv": "^16.3.1",
"express": "^4.18.2",
"express-handlebars": "^7.1.2",
"express-session": "^1.17.3",
"jsonwebtoken": "^9.0.2",
"mongodb-connection-string-url": "^3.0.0",
"mongoose": "^6.10.0",
"mongoose-paginate-v2": "^1.7.4",
"multer": "^1.4.5-lts.1",
"nodemailer": "^6.9.7",
"package-name": "^0.1.0",
"passport": "^0.6.0",
"passport-github2": "^0.1.12",
"passport-local": "^1.0.0",
"session-file-store": "^1.5.0",
"socket.io": "^4.7.2",
"twilio": "^4.20.0",
"uuid": "^9.0.1",
"winston": "^3.11.0"

2. Inicia el servidor

npm start

## Aplicaciones agregadas

# Implementar un sistema de recuperacion de contraseña

Se modifico vista login añadiendo boton de recuperacion de contraseña.
Este boton debe enviar correo con link de reestablecer contraseña que solo sea valido por 1 hora

Se agrego vista confirmedMail para indicar al usuario que el correo fue enviado

Se creo vista reset en la cual el usuario ingresa mail del usuario que desea cambiar, se redirige a la pagina donde se crea la contraseña

Se creo ruta createPass que busca contraseña nueva, y llama al endPoint resetPassword

Se creo endpoint resetPassword que cambia la contraseña en la BBDD

Se creo vista confirmedReset para indicarle al usuario que la contraseña se cambio con exito

# Crear nuevo role premium que permita crear productos

Se añadio la opcion premium en el schema de user

# Crear campo owner en schema products

Se añadio el campo owner en el schema de products el cual por default es admin

# Modificar permisos de modificacion y eliminacion de productos según role y owner

Se modifico la funcion manageProducts añadiendo el rol premium a los permisos

Se modifico la funcion deleteProducts añadiendo comprobacion de que el usuario owner solo elimine los productos que le pertenecen

Se modifico la funcion addProductsInCart añadiendo comprobacion de que el usuario owner no pueda añadir a su carro sus propios productos

# Implementar ruta para cambiar role de user a premium

Se creo ruta POST
http://localhost:8080/api/users/premium/:uid
Que utiliza la funcion changeRole para modificar el rol de user a premium y viceversa

## Rutas para interactuar con postman

# Agregar Producto

Ruta POST
http://localhost:8080/api/products

Cuerpo de la solicitud

{
"name": "nombre del producto",
"description": "descripcion del producto",
"price": 2000,
"stock": 20,
"category": "categoria",
"thumbnail": "url de la imagen en png"
}

# Agregar Carrito

Ruta POST
http://localhost:8080/api/carts

Cuerpo de la solicitud

{
"name": "nombre carrito",
"description": "descripcion carrito",
"products": []
}

# Agregar Producto a un Carrito

Ruta POST
http://localhost:8080/api/carts/<cid>/products/<pid>

Cuerpo de la solicitud
{
"id": "<pid>",
"cantidad": 1
}

# Ruta para Agregar Ticket

POST
http://localhost:8080/api/carts/<cid>/purchase

## Usuarios de Prueba

Usuario Admin
Email: p@gmail.com
Contraseña: 1

Usuario Regular
Email: puser@gmail.com
Contraseña: 1

Usuario Premium
Email: upremium@gmail.com
Contraseña: 1

## Carritos de Prueba

Para productos con stock
ID: 65804fabfa5eb4929dd1ecea

Para productos sin stock
ID: 65805c4dbc17875eca98d93d

Productos de Prueba con stock
ID: 65804717fa5eb4929dd1ec8e
ID: 6580439568ab20da69fad8bb

Producto de Prueba sin Stock
ID: 65805c4dbc17875eca98d93d
