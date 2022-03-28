import bcrypt from "bcryptjs";

const users = [
    {
        name: "Admin User",
        email: "admin@example.com",
        password: bcrypt.hashSync("123456", 10),
        isAdmin: true
    },
    {
        name: "Ali Hacker",
        email: "ali@example.com",
        password: bcrypt.hashSync("123456", 10),
        isAdmin: false
    },
    {
        name: "Veli Hacker",
        email: "veli@example.com",
        password: bcrypt.hashSync("123456", 10),
        isAdmin: false
    },
]

export default users;