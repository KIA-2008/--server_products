import Product from "../models/Product.js";
import fileService from "../services/fileService.js";

class ProductController {
  async getProducts(req, res) {
    try {
      const products = await Product.find();
      res.json(products);
      console.log(products);
    } catch (error) {
      console.log("Ошибка при получении продуктов: " + error);
    }
  }

  async addProduct(req, res) {
    try {
      
       let fileName = null;
        console.log(req.files.image);
        
       if(req.files && req.files.image){
        fileName  =   await  fileService.saveFile(req.files.image)
        if(!fileName){
         return res.send("Ошибка при добавлении файла "  , fileName )
        }

        
       }
      
      const { title, description, price } = req.body;
      const newProduct = await Product.create({
        title,
        description,
        price,
        image: fileName
      });

      await newProduct.save();
      res.send("Продукт успешно добавлен!");
    } catch (error) {
      
      console.log("Ошибка при добавлении продукта: " + error);
    }
  }
  async getOneProduct(req, res) {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) return res.status(404).send("Товар не найден");
      res.json(product);
    } catch (e) {
      res.status(500).send("Ошибка при получении товара: " + e.message);
    }
  }

  async updateProduct(req, res) {
    try {
      const { id } = req.params;
      const { title, description, price } = req.body;
      
      let updateData = { title, description, price };
      
      if (req.files && req.files.image) {
        const fileName = await fileService.saveFile(req.files.image);
        if (fileName) updateData.image = fileName;
      }

      const updated = await Product.findByIdAndUpdate(id, updateData, { new: true });
      if (!updated) return res.status(404).send("Товар не найден");
      
      res.json(updated);
    } catch (e) {
      res.status(500).send("Ошибка при обновлении: " + e.message);
    }
  }

  async deleteProduct(req, res) {
    try {
      const product = await Product.findByIdAndDelete(req.params.id);
      if (!product) return res.status(404).send("Товар не найден");
      res.send("Товар удален");
    } catch (e) {
      res.status(500).send("Ошибка при удалении: " + e.message);
    }
  }
}

export default new ProductController();
