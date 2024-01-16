import express from "express";
import passport from "passport";
import { registerUser, loginUser, logoutUser, handleGitHubCallback, requestPasswordReset, resetPassword, renderPas, changeRole, uploadDocuments } from "../controllers/users.controller.js";
import UserDTO from "../dao/DTOs/user.dto.js";
import upload from "../multer.js";
import uploader from "../multer.js";
const UserRouter = express.Router()


UserRouter.post("/register",
    passport.authenticate("register",
        { failureRedirect: "/api/users/failregister" }), registerUser
)

UserRouter.get("/failregister", async (req, res) => {
    req.logger.error("Failed Strategy")
    res.send({ error: "Failed" })
})

UserRouter.post("/login",
    passport.authenticate("login",
        { failureRedirect: "/faillogin" }), loginUser
)

UserRouter.get("/faillogin", async (req, res) => {
    res.send({ error: "Failed Login" })
})

UserRouter.get("/logout", logoutUser)

UserRouter.get("/github", passport.authenticate("github", { scope: ["user: email"] }), async (req, res) => {
    req.logger.info("Redirecting to GitHub for authentication...")
})

UserRouter.get("/githubcallback", passport.authenticate("github", { failureRedirect: "/login" }), handleGitHubCallback);

UserRouter.get("/profile", async (req, res) => {
    try {
        let user = req.session.user

        if (!user || !user.email) {
            return res.redirect("/login")
        }
        const userData = {
            email: user.email,
            role: user.role,
            id: user._id,
        }

        return res.render("profile", {
            title: "Perfil de Usuario",
            user: userData
        })
    }
    catch (error) {
        req.logger.error("Error en la ruta /profile:", error);
        return res.status(500).json(error);
    }
})

UserRouter.get("/current", async (req, res) => {
    try {
        let user = req.session.user

        if (!user || user == null || user == undefined) {
            req.logger.error("No se encontró el usuario")
            return res.redirect("/login")
        }
        const userData = {
            name: user.name,
            surname: user.surname,
            email: user.email,
            age: user.age,
            password: user.password,
            cart: user.cart,
            role: user.role
        }

        const userSafe = new UserDTO(userData).toSafeObject()

        return res.render("current", {
            title: "Perfil de Usuario",
            user: userSafe
        })
    }
    catch (error) {
        req.logger.error("Error en la ruta /current:", error);
        return res.status(500).json(error);
    }
})

UserRouter.get("/allUsers", async (req, res) => {
    try {
        let users = await req.db.User.findAll()
        return res.render("users", {
            title: "Lista de Usuarios",
            users: users
        })
    }
    catch (error) {
        req.logger.error("Error en la ruta /allUsers:", error);
        return res.status(500).json(error);
    }
})



UserRouter.post("/request-password", requestPasswordReset)


//ruta para vista para que el usuario cree una nueva contraseña
UserRouter.get("/createPass/:token", renderPas)



// Ruta para enviar correo de recuperacion de contraseña
UserRouter.post("/createPass/:token", resetPassword)

//Ruta para cambiar el rol del usuario
UserRouter.get("/premium/:uid", changeRole)

//Ruta para subir documentos
UserRouter.post("/:uid/documents", uploader.array("documents"), uploadDocuments)






export default UserRouter;



