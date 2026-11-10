import mongoose from "mongoose";

const UserSchema = new mongoose.Schema ({
    email: {
        type: String ,
        requered: [true , "Почта не может быть пустой!"],
        match: [/^\S+@\S+\.\S+$/ , "Введите корректный емаил"],
        unique: true
    },
    password: {
        type: String,
        requered: [true, "Пароль обязателен"],
        minLength: [6, "Пароль должен быть не менее 6 символов"]
    },
    name: {
        type: String ,
        requered: [true , "Имя обязательно к заполнению!"],
    },
    lastName: {
        type: String,
        requered: [true , "Фамилия обязательна к заполнению!"],
    },
    phoneNumber: {
        type: String
    }
})

export default mongoose.model("User", UserSchema);