import { createHash, comparePasswords } from "../utils.js";
import mailer from "../config/nodemailer.js";
import jwt from "jsonwebtoken";
import UserService from "../services/UserService.js";
import generatePasswordResetToken from "../config/token.js";

const { sendMail } = mailer;
const userService = new UserService();

export async function registerUser(req, res, next) {
    try {
        req.logger.info("Registering user...");
        const { name, surname, email, password, role } = req.body;
        if (!name || !surname || !email || !password || !role) {
            return next(
                CustomError.createError({
                    statusCode: 404,
                    causeKey: USER_NOT_CREATED,
                    message: "El usuario no se ha podido crear"
                })
            )
        }
        res.redirect("/login");
    } catch (error) { res.status(500).send("Error al registrar usuario: " + error.message); }

}

export async function loginUser(req, res) {
    try {
        let user = req.user
        req.session.email = user.email
        req.session.role = user.role
        req.session.name = user.name
        req.session.surname = user.surname
        req.session.age = user.age;
        req.session.user = user;
        req.session.last_connection = user.last_connection;
        if (user.role === "admin") {

            res.redirect("/api/users/profile")
        } else {

            res.redirect("/api/products")
        }
        req.logger.info("Session established:", req.session.user);

    } catch (error) {
        res.status(500).json("Usuario o contraseña incorrectos")
    }
}

export async function logoutUser(req, res) {
    try {
        console.log("Entra en logoutUser")
        let user = req.session.user
        user.last_connection = new Date();
        await userService.updateUser(user._id, user);
        console.log("User logged out:", user.name + " ultima conexion: " + user.last_connection);
        req.session.destroy()
        res.redirect("/login")
    } catch (error) {
        res.status(500).json(error)
    }
}

export async function handleGitHubCallback(req, res) {
    try {
        req.session.user = req.user;
        req.session.email = req.user.email;
        req.session.role = req.user.role;

        res.redirect("/api/users/profile");
    } catch (error) {
        res.status(500).json("Error during GitHub authentication");
    }
}

export async function requestPasswordReset(req, res) {
    try {
        const { email } = req.body;
        const user = await userService.getUserByEmail(email);
        if (!user) {
            return res.status(404).json("El usuario no existe");
        }
        const resetToken = generatePasswordResetToken({ userId: user.id, email: user.email });
        const resetUrl = `http://localhost:8080/api/users/createPass/${resetToken}`;
        const emailOptions = {
            from: "lissett777@gmail.com",
            to: email,
            subject: "Reset Password",
            html: `<p>Para cambiar tu contraseña, haz click en el siguiente link: <a href="${resetUrl}">${resetUrl}</a></p>
            <p>Reset token: ${resetToken}</p>`
        }

        await sendMail(emailOptions);
        return res.render("confirmedMail", {
            title: "Reset Mail",
        });
    } catch (error) {
        return res.status(500).json(error.message);
    }

}

export async function renderPas(req, res) {
    const token = req.params.token;

    // Decodificar el token y recuperar información adicional
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const email = decoded.email;

    res.render("createPass", {
        title: "Reset Password",
        email: email,
        token: token
    });
}



export async function resetPassword(req, res) {
    const { password, confirmedPassword } = req.body;
    const token = req.params.token;
    if (password !== confirmedPassword) {
        return res.status(400).json("Las contraseñas no coinciden");
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const email = decoded.email;
        const user = await userService.getUserByEmail(email);
        const id = user.id;

        if (!user) {
            return res.status(404).json("El usuario no existe");
        }

        if (await comparePasswords(password, user.password)) {
            return res.status(400).json("La contraseña no puede ser igual a la anterior");
        }
        const hashedPassword = await createHash(password);
        const updatedUser = { password: hashedPassword };
        await userService.updateUser(id, updatedUser);

        return res.render("confirmedReset", {
            title: "Reset Password"
        });
    } catch (error) {
        return res.status(500).json(error.message);
    }
}

export async function changeRole(req, res) {
    try {
        const { uid } = req.params;
        console.log("El id del usuario es ", uid);
        const user = await userService.getUserById(uid);
        console.log("El usuario es ", user);
        if (!user) {
            return res.status(404).json("El usuario no existe");
        }
        let updatedUser;
        console.log("El rol del usuario es ", user.role);
        if (user.role === "user") {
            updatedUser = { role: "premium" };
        }
        else {
            updatedUser = { role: "user" };
        }
        console.log("El usuario actualizado es ", updatedUser);
        await userService.updateUser(uid, updatedUser);
        return res.redirect("/api/users/profile");
    } catch (error) {
        return res.status(500).json(error.message);
    }
}







