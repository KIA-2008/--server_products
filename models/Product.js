import mongoose from "mongoose"

 const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true , "Название обязательно!"], 
        trim: true
    },
    description: {
        type:String,
        required:  [true , "Описание обязательно!"],
        trim: true
    },
    price: {
        type: Number,
        required: [true , "Цена обязательна!"],
        min: 0
    }, 
    image: {
        type: String
    }
 })

export default mongoose.model("Product" , productSchema);