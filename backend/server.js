const express=require('express')
const dotenv=require('dotenv').config();
const port=process.env.PORT||5000;
const morgan=require('morgan');
const connectDB = require('./config/db');
const {errorHandler}=require('./middleware/ErrorMiddleware')
const cors=require('cors')

connectDB();
const app=express();
//middleware
app.use(cors({ origin: 'http://localhost:3000' }))
app.use(express.json());
app.use(express.urlencoded({extended:false}));
//app.use(morgan('dev'));

//routes
app.use('/api/users',require('./Routes/authRoutes'));
app.use('/api/product',require('./Routes/productRoutes'));
app.use('/api/category',require('./Routes/categoryRoutes'));
app.use('/api/cart',require('./Routes/cartRoutes'));




app.use(errorHandler);
app.listen(port,()=>console.log(`server started on port ${port}`));
