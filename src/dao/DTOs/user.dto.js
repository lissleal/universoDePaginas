export default class UserDTO {
    constructor(user) {
        this.name = user.name || "";
        this.surname = user.surname || "";
        this.email = user.email || "";
        this.age = user.age || "";
        this.password = user.password || "";
        this.cart = user.cart || [];
        this.role = user.role || "user";
        this.documents = user.documents || [];
        this.last_connection = user.last_connection || Date.now();
    }

    toSafeObject() {
        return {
            name: this.name,
            surname: this.surname,
            email: this.email,
            age: this.age,
            cart: this.cart,
            role: this.role,
            documents: this.documents,
            last_connection: this.last_connection,
            password: "********"
        };
    }
}