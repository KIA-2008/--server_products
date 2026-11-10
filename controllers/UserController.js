import User from "../models/User.js";
import hashService from "../services/hashService.js";

class UserController {
    async registration(req, res) {
        try {
            const { email, password, name, lastName, phoneNumber } = req.body
            console.log(name);


            const hashPassword = await hashService.hashPassword(password)

            const user = await User.create({ email, password: hashPassword, name, lastName, phoneNumber })
            res.status(200).json("Регистрация прошла успешно")
        } catch (err) {
            res.status(500).json("Ошибка при регистрации")
        }
    }

    async login(req , res){
        try{
            const {email , password} = req.body

            const user = await User.findOne({email})

            if(!user){
                return res.status(400).json("Неверный логин или пароль")
            }
            
            const isPassValid = await hashService.comparePassword(password, user.password)

            if(!isPassValid){
                return res.status(400).json("Неверный логин или пароль")
            }
            return res.json(user)
            
        }catch(err){
            console.log(err);
            res.status(500).json({massage: "Ошибка при авторизации"})
            
        }
    }
}

export default new UserController()