import express from "express";
import passport from "passport";
import { registerUser, loginUser, logoutUser, handleGitHubCallback } from "../controllers/users.controller.js";
import UserDTO from "../dao/DTOs/user.dto.js";
import UserService from "../services/UserService.js";
import { createHash } from "../utils.js";
const UserRouter = express.Router()

const userService = new UserService();

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
            res.redirect("/login")
        }
        const userData = {
            email: user.email,
            role: user.role,
        }

        res.render("profile", {
            title: "Perfil de Usuario",
            user: userData
        })
    }
    catch (error) {
        req.logger.error("Error en la ruta /profile:", error);
        res.status(500).json(error);
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

        res.render("current", {
            title: "Perfil de Usuario",
            user: userSafe
        })
    }
    catch (error) {
        req.logger.error("Error en la ruta /current:", error);
        res.status(500).json(error);
    }
})

UserRouter.get("/allUsers", async (req, res) => {
    try {
        let users = await req.db.User.findAll()
        res.render("users", {
            title: "Lista de Usuarios",
            users: users
        })
    }
    catch (error) {
        req.logger.error("Error en la ruta /allUsers:", error);
        res.status(500).json(error);
    }
})

UserRouter.post("/reset-password", async (req, res) => {
    try {
        console.log("entro en el try")
        const email = req.body.email
        const password = req.body.password
        console.log(password)
        console.log(email)
        let user = await userService.findEmail({ email: email })
        console.log(user)
        if (!user) {
            req.logger.error("No se encontró el usuario")
            return res.redirect("/login")
        }

        const hashedPassword = await createHash(password);
        console.log(hashedPassword)
        user.password = hashedPassword
        await user.save()
        res.redirect("http://localhost:8080/confirmedReset")
    }
    catch (error) {
        req.logger.error("Error en la ruta /reset-password:", error);
        res.status(500).json(error);
    }
}
)
export default UserRouter;



