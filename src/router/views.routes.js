import express from "express";
import authorizeRole from "../config/auth.config.js";
import { createFakeProducts } from "../config/faker.config.js";
import transporter from "../config/nodemailer.js";


const ViewsRouter = express.Router()

//Rutas GET para la página de inicio y detalles del producto:
//deberia agregar las otras vistas aca?

ViewsRouter.get("/inicio", async (req, res) => {
    res.render("inicio", {
        title: "App de compras",
    })
})
ViewsRouter.get("/register", (req, res) => {
    res.render("register", {
        title: "Registro de Usuario"
    })
})

//Ruta para que el usuario se identifique
ViewsRouter.get("/login", (req, res) => {
    res.render("login", {
        title: "Login de Usuario"
    })
})

// Ruta para enviar correo de recuperacion de contraseña
ViewsRouter.post("/enviar-correo", (req, res) => {
    const mailOptions = {
        from: "lissett777@gmail.com",
        to: "lissett777@gmail.com",
        subject: "Recuperar contraseña",
        html: `
        <p>Para recuperar tu contraseña, haz click en el siguiente enlace:</p>
        <a href="http://localhost:8080/reset"> Recuperar contraseña </a>
        `
    }
    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            req.logger.error(err.message)
            return res.status(500).send("Error al enviar el correo")
        }
        req.logger.info("Correo enviado")
        res.render("confirmedMail", {
            title: "Correo enviado"
        })
    })
})

//ruta para vista donde el usuario pide recuperacion de contraseña
ViewsRouter.get("/reset", (req, res) => {
    res.render("reset", {
        title: "Reset Password"
    })
})

//ruta para vista para que el usuario cree una nueva contraseña
ViewsRouter.get("/createPass", (req, res) => {
    const email = req.query.email
    res.render("createPass", {
        title: "Reset Password",
        email: email
    })
})

//ruta para vista donde el usuario confirma que su contraseña fue cambiada
ViewsRouter.get("/confirmedReset", (req, res) => {
    res.render("confirmedReset", {
        title: "Reset Password"
    })
})



ViewsRouter.get("/addProducts", authorizeRole("admin"), (req, res) => {
    res.render("addProducts", {
        title: "Agregar Productos"
    })
})

ViewsRouter.get("/mockingProducts", async (req, res) => {
    let products = await createFakeProducts()
    res.render("mockingProducts", {
        title: "Agregar Productos",
        products: products
    })
})










export default ViewsRouter