# The main purpose of this reposatory is the addtocart end point which searches in products for the product, add it to cart or increase its quantity in the cart. You can try the endpoint within the nodejs project which gives you three endpoints:- 1)fetch products 2)fetch cart items 3)add to cart

Here is the addtocart endpoint alone also:-

    if (req.url === '/cart/addtocart'  && req.method=="POST") {
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
            res.writeHead(200 ,{ 'Content-Type': 'plain/text' },"saved")
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
