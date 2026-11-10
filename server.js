import express from "express";
import mongoose from "mongoose";
import cors from "cors"; 
import router from "./routes/router.js";
import reuteUser from "./routes/routeUser.js"
import fileUpload from "express-fileupload";
import { fileURLToPath } from "url";
import path from "path";

const __fileName = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__fileName);

const PORT = 5000;

// 1. Сначала создаем экземпляр приложения
const app = express();

// 2. Только после этого подключаем middleware
app.use(cors()); 
app.use(express.json());
app.use(fileUpload({}));
app.use("/files", express.static(path.resolve(__dirname, "files")));
app.use(router);
app.use(reuteUser)

mongoose
  .connect("mongodb://localhost:27017/products")
  .then(() => {
    console.log("Успешное подключение к БД");
  })
  .catch((error) => {
    console.log("Ошибка при подключении к БД: " + error);
  });

app.listen(PORT, () => {
  console.log("Сервер успешно запущен на порту: " + PORT);
});