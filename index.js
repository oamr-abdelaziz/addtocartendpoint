const http = require('http');
// const { decode } = require("querystring");
const Cart = require('./models/Cart.js');
const Product = require('./models/Product.js');
const MongoServer = require('./config/db');

MongoServer();

http.createServer(function(req, res) {

    if (req.url === '/cart/items' && req.method=="GET") {
       Cart.find({})
        .then((items) => {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(items));
        })
    }
    
    else if  (req.url === '/product/items'  && req.method=="GET") {
        
          Product.find({})
        .then((items) => {
           res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(items));
        })
    }

    else if (req.url === '/cart/addtocart'  && req.method=="POST") {
        let body = "";
        req.on("data",data=>{
            //request data is the code of the product, the size and its quantity
            body+=data;
            cartItems(req,res,body);   
        });
        req.on("end",()=>{     
                // const { code , size , quantity } = decode(body);
                // console.log("ended", code,size,quantity);
        });

      async function cartItems(req,res,body){


        try {
            body=JSON.parse(body); 
                
            const {
            code,
            size,
            quantity
            } = body;

            //Search if product exists
            let product = await Product.findOne({code});

            if (!product) {
                //handling product missing error
                const msg={msg: "product Doesn't Exists"}
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(msg));
            }

            //find if product is added to cart previously
            let cartItem = await Cart.findOne({"product":product,"size":size});

            if (cartItem!=null){
                // if it is available in cart with the same size add quantity to previous quantity
                cartItem['quantity']=cartItem['quantity']+quantity;
            }
            else{
                //if not available in cart then:-
                //Create new cart item with the product object, its size and the quantity
                cartItem = new Cart({
                product,
                size,
                quantity
                });

            }
            
            //save or update the cart item
            await cartItem.save();
            res.writeHead(200 ,{ 'Content-Type': 'plain/text' })
            res.end("saved successfully");

        } catch (err) {
            //handle saving error
            console.log(err.message);
            const msg={message: `Error in saving: ${err.message}`}
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(msg));
        }
      }
    }

    else {
        res.writeHead(404);
        res.end();
    }
    
}).listen(8000, '127.0.0.1');
