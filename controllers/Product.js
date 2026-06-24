import Product from '../models/Product.js';
import errorHandler from '../helper/handleError.js';
import APIHelper from '../helper/APIHelper.js';
import { v2 as cloudinary } from 'cloudinary';




//get all products -api/v1/products
export const getAllProducts = async (req,res,next)=>{
  // const products = await Product.find();
  // console.log(req.query);
    const apiHelper =  new APIHelper(Product.find(), req.query).search().filter();
     //console.log(apiHelper);
     const resultsPerPage = 8;
     const filteredQuery = await apiHelper.query.clone();
     //const productCount =  await filteredQuery.countDocuments();
      const productCount =  filteredQuery.length;
     const totalPages =Math.ceil(productCount / resultsPerPage);
     const page = req.query.page || 1;

     if(totalPages > 0 && page > totalPages){
        return next (new errorHandler("Page does not exit", 404)); 
     }
        apiHelper.pagination(resultsPerPage);
     const products = await apiHelper.query;
      res.status(200).json({
        success:true,
        products,
        productCount,
        resultsPerPage,
        totalPages,
        currentPage: page,
      })
}

// Create a new product- /api/v1/product/new

export const newProduct = async (req, res) => {
  try {
    let imageStr = req.body.image;
    
    // If the image was uploaded via multipart/form-data, it will be in req.files
    if (req.files && req.files.image) {
      const file = req.files.image;
      imageStr = `data:${file.mimetype};base64,${file.data.toString("base64")}`;
    }

    if (!imageStr) {
      return res.status(400).json({
        success: false,
        message: "Missing image file",
      });
    }

    const result = await cloudinary.uploader.upload(
      imageStr,
      {
        folder: "Products",
      }
    );

    const product = await Product.create({
      name: req.body.name,
      price: req.body.price,
      description: req.body.description,
      category: req.body.category,
      stock: req.body.stock,
      user: req.user.id,
      image: {
        public_id: result.public_id,
        url: result.secure_url,
      },
    });

    res.status(201).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// get a single product - /api/v1/product/:id
export const getSingleProduct = async (req,res,next)=>{
    const {id} = req.params;
    const product = await Product.findById(id);
    if(!product){
        return next (new errorHandler("Product not found", 404));

    }
    res.status(200).json({
        success:true,
        product,
    })
} 

// delete a product =api/v1/product/:id
export const deleteProduct = async (req,res,next)=>{
    const {id} = req.params;
     const product = await Product.findByIdAndDelete(id);
     if(!product){
        return next (new errorHandler("Product not found",404));
        }
   res.status(200).json({
        sucess:true,
        message :"Product deleted successfully"
 })
}

//update a product = /api/v1/product/:id
export const updateProduct = async (req,res,next)=>{
    const {id} = req.params;
    
    let updateData = { ...req.body };
    
    if (req.files && req.files.image) {
      const file = req.files.image;
      const imageStr = `data:${file.mimetype};base64,${file.data.toString("base64")}`;
      
      const result = await cloudinary.uploader.upload(
        imageStr,
        {
          folder: "Products",
        }
      );
      
      updateData.image = {
        public_id: result.public_id,
        url: result.secure_url,
      };
    }

    const product = await Product.findByIdAndUpdate(id, updateData, { new: true });
    if(!product){
        return next(new errorHandler( "Product not found", 404));
    }
    res.status(200).json({
        success:true,
        product,
    })
    
}

// product reviews
export const productReviews = async (req,res,next)=>{
    const {ratings, comment, productId} = req.body;
    const review ={
        user :req.user._id,
        name: req.user.name,
        avatar: req.user.avatar.url,
        ratings :Number(ratings),
        comment,

    }
    const product = await Product.findById(productId);
    if(!product){
        return next (new errorHandler("Product not found",404));
    }
    const isReviewed = product.reviews.find((review)=> review.user.toString() === req.user._id.toString());
    if(isReviewed){
        product.reviews.forEach((review)=>{
            if(review.user.toString() === req.user._id.toString()){
                review.comment = comment;
                review.ratings = ratings;
            }
        });
    }else{
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length;

    }
    let totalRatings =0;
    product.reviews.forEach((review)=>{
        totalRatings += review.ratings;
    });
    product.ratings = totalRatings / product.reviews.length;
    await product.save({validateBeforeSave:false});
    res.status(200).json({
        success:true,
        product,
    })
}

//view product reviews - /api/v1/admin/reviews
export const viewProductReviews =async(req,res,next)=>{
    const product = await Product.findById(req.query.id);
    if(!product){
        return next (new errorHandler("Product not found",404));
    }
    res.status(200).json({
        success:true,
        reviews: product.reviews,
    })
}

// get all product by admin
export const getAllProductsByAdmin = async (req,res,next)=>{
    const products = await Product.find();
    if(!products){
        return next (new errorHandler("Products not found",404));
    }
    res.status(200).json({
        success:true,
        products,
    })
}

// delete review
export const deleteReview = async( req,res, next)=>{
    const {productId, reviewId} = req.query;
    const product = await Product.findById(productId);
    if(!product){
        return next (new errorHandler("Product not found",404));
    }
    const reviews = product.reviews.filter((review)=>review._id.toString() !== reviewId.toString());
    let totalRatings = 0;
    reviews.forEach((review)=>{
        totalRatings += review.ratings;
    })
    const ratings = reviews.length === 0 ? 0 : totalRatings / reviews.length;
    const numOfReviews = reviews.length;

    await Product.findByIdAndUpdate(productId,{
        reviews,
        ratings,
        numOfReviews,
    },{
        new:true,
        runValidators:true,
    }
)

    await product.save({validateBeforeSave:false});
    res.status(200).json({
        success:true,
        message:"Review deleted successfully"
    })
}