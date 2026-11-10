import bcrypt from "bcrypt"

class HashService {
    async hashPassword(password) {
        try {
            const salt = await bcrypt.genSalt(10)

            const hash = await bcrypt.hash(password, salt)
            console.log(hash);
            return hash
        } catch (err) {
            throw new Error("Ошибка при хешировании пароля")
        }
    }

    async comparePassword(password , hashPass){
        try{
            return bcrypt.compare(password , hashPass)
        }catch(err){
            throw new Error("Ошибка при сравнении паролей")
        }
    }
}

export default new HashService();