const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const database = require('./config/database');
const adminRoutes = require('./routes/admin/index.route');


const app = express();
const port = process.env.PORT || 5000;

// Đọc file .env
dotenv.config();

// Kết nối database
database.connect();


// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
adminRoutes(app);


app.listen(port, () => {
  console.log(`Server đang chạy tại: http://localhost:${port}`);
});