const express = require('express')
const cors = require('cors');
const {mongoose } = require('mongoose');
require('dotenv').config();
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken')
const multer = require('multer')
const fs = require('fs')
const User = require('./models/user.js')
const TypeProduct = require('./models/typeProduct.js');
const Product = require('./models/product.js')
const bcrypt = require('bcryptjs')
const moment = require('moment')
const bcryptSalt = bcrypt.genSaltSync(10);
const app = express();
const jwtSecret = 'dat1234456789';
app.use(express.json())
app.use(cookieParser())
app.use('/uploads', express.static(__dirname + '/uploads'));
app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000'
}));

mongoose.connect('mongodb+srv://ecommerce:EhxC9BmyyQnAm4Y3@cluster0.yjlgbbg.mongodb.net/?retryWrites=true&w=majority');
// console.log(process.env.MONGO_URL)

// password mongodb: EhxC9BmyyQnAm4Y3
app.get('/test', (req, res) => {
    res.json("test sucssect");
})

app.post('/signup',async (req, res) => {
    const {name, email, password} = req.body;
    try{
        
        const userDoc = await User.create({
            name,
            email,
            password:bcrypt.hashSync(password, bcryptSalt),
        })
        res.json(userDoc)
    }catch(e) {
        res.status(422).json(e);
    }
    
})

app.post('/login',async (req, res) => {
    const {email, password} = req.body;
    const userDoc = await User.findOne({email});
    if(userDoc){
        const name = userDoc.name;
        const _id = userDoc.id;
        const passOk = bcrypt.compareSync(password, userDoc.password);
        if(passOk) {
            jwt.sign({
                email: userDoc.email,
                id: userDoc.id
                
                }, jwtSecret, {}, (err, token) => {
                if(err) throw err;
                
                res.cookie('token', token).json({name, email, _id});
                
            })
            
        }else{
            res.status(422).json('pass not ok');
        }
    }
    else{
        res.status(422).json('fail');
    }  
})

app.post('/logout', async (req, res) => {
    // Perform any necessary logout operations
    // For example, clearing session, deleting tokens, etc.
  
    // Assuming you are using cookies, clear the 'token' cookie
    res.clearCookie('token');
    
    // Send a response indicating successful logout
    res.json({ message: 'Logout successful' });
  });

app.get('/profile',  (req, res) => {
    const {token} = req.cookies;
    
    if(token) {
        jwt.verify(token, jwtSecret, {},async (err, userData) =>{
            if(err) throw err;
            const {name, email, _id} = await User.findById(userData.id);

            res.json({name, email, _id});
        });
    }else{
        res.json(null);
    }
})

app.post('/addTypeProduct', async (req,res) => {
    const {typeName} = req.body;
    try{
        const typeDoc = await TypeProduct.create({
            typeName,
           
        })
        res.json(typeDoc)
    }catch(e) {
        res.status(422).json(e);
    }
})

app.get('/typeProduct', async (req, res) => {
    try{
         res.json( await TypeProduct.find());
    }catch(e) {
        res.status(422).json(e);
    }
    
})

app.delete('/deleteTypeProduct/:id', async (req, res) => {
    const id = req.params.id;
    
    try {
        await TypeProduct.findByIdAndDelete(id);
        res.json(id);
      } catch (err) {
        //console.error(err);
        res.status(422).json(err);
      }
})

const photosMiddleware = multer({dest: 'uploads/'});
app.post('/upload', photosMiddleware.array('photos', 100),(req, res) => {
    const uploadedFiles = [];
    for(let i=0; i< req.files.length;i++) {
        const {path, originalname} = req.files[i];
        const parts = originalname.split('.');
        const ext = parts[parts.length -1];    
        const newPath = path + '.' + ext;
        fs.renameSync(path, newPath);
        uploadedFiles.push(newPath.replace('uploads\\', ''));
    }
    res.json(uploadedFiles)
});

app.post('/product', (req, res) => {
    const {token} = req.cookies;
    const {name, priceNew, priceOld, description,quantity, images, typeProduct} = req.body;
    const star = 0;
    const dateUpdate = moment().format('DD-MM-YYYY HH:mm:ss');

    if(token) {
        jwt.verify(token, jwtSecret, {}, async(err, userData)=> {
            if(err) throw err;
            
            const productDoc = await Product.create({
                owner: typeProduct,
                name,priceNew,priceOld,description,quantity,images,star,dateUpdate
            })
            res.json(productDoc);
        })
    }else{
        res.status(422).json("fail");
    }

})


app.listen(4000);