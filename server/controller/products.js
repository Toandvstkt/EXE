const productModel = require("../models/products");
const fs = require("fs");
const path = require("path");

class Product {
  static deleteImages(images, mode) {
    var basePath =
      path.resolve(__dirname + "../../") + "/public/uploads/products/";
    for (var i = 0; i < images.length; i++) {
      let filePath = "";
      if (mode == "file") {
        filePath = basePath + `${images[i].filename}`;
      } else {
        filePath = basePath + `${images[i]}`;
      }
      if (fs.existsSync(filePath)) {
        fs.unlink(filePath, (err) => {
          if (err) {
            return err;
          }
        });
      }
    }
  }

  async getAllProduct(req, res) {
    try {
      let Products = await productModel
        .find({})
        .populate("pCategory", "_id cName")
        .sort({ _id: -1 });
      if (Products) {
        return res.json({ Products });
      }
    } catch (err) {
      console.log(err);
    }
  }

  async postAddProduct(req, res) {
    let { pName, pDescription, pPrice, pQuantity, pCategory, pOffer, pStatus, pType } =
      req.body;
    let images = req.files;
    if (
      !pName ||
      !pDescription ||
      !pPrice ||
      !pQuantity ||
      !pCategory ||
      !pOffer ||
      !pStatus ||
      !pType
    ) {
      Product.deleteImages(images, "file");
      return res.json({ error: "All fields must be required" });
    }
    else if (pName.length > 255 || pDescription.length > 3000) {
      Product.deleteImages(images, "file");
      return res.json({
        error: "Name must be less than 255 & Description must not be more than 3000 characters",
      });
    }
    else if (images.length !== 2) {
      Product.deleteImages(images, "file");
      return res.json({ error: "Must provide exactly 2 images" });
    } else {
      try {
        let allImages = [];
        for (const img of images) {
          allImages.push(img.filename);
        }
        let newProduct = new productModel({
          pImages: allImages,
          pName,
          pDescription,
          pPrice,
          pQuantity,
          pCategory,
          pOffer,
          pStatus,
          pType,
        });
        let save = await newProduct.save();
        if (save) {
          return res.json({ success: "Product created successfully" });
        }
      } catch (err) {
        console.log(err);
      }
    }
  }

  async postEditProduct(req, res) {
    let {
      pId,
      pName,
      pDescription,
      pPrice,
      pQuantity,
      pCategory,
      pOffer,
      pStatus,
      pImages,
      pType,
    } = req.body;
    let editImages = req.files;
    if (
      !pId ||
      !pName ||
      !pDescription ||
      !pPrice ||
      !pQuantity ||
      !pCategory ||
      !pOffer ||
      !pStatus ||
      !pType
    ) {
      return res.json({ error: "All fields must be required" });
    }
    else if (pName.length > 255 || pDescription.length > 3000) {
      return res.json({
        error: "Name must be less than 255 & Description must not be more than 3000 characters",
      });
    }
    else if (editImages && editImages.length == 1) {
      Product.deleteImages(editImages, "file");
      return res.json({ error: "Must provide exactly 2 images" });
    } else {
      let editData = {
        pName,
        pDescription,
        pPrice,
        pQuantity,
        pCategory,
        pOffer,
        pStatus,
        pType,
      };
      if (editImages.length == 2) {
        let allEditImages = [];
        for (const img of editImages) {
          allEditImages.push(img.filename);
        }
        editData = { ...editData, pImages: allEditImages };
        Product.deleteImages(pImages.split(","), "string");
      }
      try {
        let editProduct = productModel.findByIdAndUpdate(pId, editData);
        editProduct.exec((err) => {
          if (err) console.log(err);
          return res.json({ success: "Product edited successfully" });
        });
      } catch (err) {
        console.log(err);
      }
    }
  }

  async getDeleteProduct(req, res) {
    let { pId } = req.body;
    if (!pId) {
      return res.json({ error: "All fields must be required" });
    } else {
      try {
        let deleteProductObj = await productModel.findById(pId);
        let deleteProduct = await productModel.findByIdAndDelete(pId);
        if (deleteProduct) {
          Product.deleteImages(deleteProductObj.pImages, "string");
          return res.json({ success: "Product deleted successfully" });
        }
      } catch (err) {
        console.log(err);
      }
    }
  }

  async getSingleProduct(req, res) {
    let { pId } = req.body;
    if (!pId) {
      return res.json({ error: "All fields must be required" });
    } else {
      try {
        let singleProduct = await productModel
          .findById(pId)
          .populate("pCategory", "cName")
          .populate("pRatingsReviews.user", "name email userImage");
        if (singleProduct) {
          return res.json({ Product: singleProduct });
        }
      } catch (err) {
        console.log(err);
      }
    }
  }

  async getProductByType(req, res) {
    const type = req.params.pType; 
    try {
        const products = await productModel.find({ pType: type });
        if (products.length > 0) {
            return res.json({ Products: products });
        } else {
            return res.json({ error: "No products found for the specified type" });
        }
    } catch (err) {
        return res.json({ error: "Failed to fetch products by type" });
    }
  }

  async getProductByCategory(req, res) {
    let { catId } = req.body;
    if (!catId) {
      return res.json({ error: "All fields must be required" });
    } else {
      try {
        let products = await productModel
          .find({ pCategory: catId })
          .populate("pCategory", "cName");
        if (products) {
          return res.json({ Products: products });
        }
      } catch (err) {
        return res.json({ error: "Search product wrong" });
      }
    }
  }
 
  async getProductByPrice(req, res) {
    let { price } = req.body;
    if (!price) {
      return res.json({ error: "All fields must be required" });
    } else {
      try {
        let products = await productModel
          .find({ pPrice: { $lt: price } })
          .populate("pCategory", "cName")
          .sort({ pPrice: -1 });
        if (products) {
          return res.json({ Products: products });
        }
      } catch (err) {
        return res.json({ error: "Filter product wrong" });
      }
    }
  }

  async getWishProduct(req, res) {
    let { productArray } = req.body;
    if (!productArray) {
      return res.json({ error: "All fields must be required" });
    } else {
      try {
        let wishProducts = await productModel
          .find({
            _id: {
              $in: productArray,
            },
          })
          .populate("pCategory", "cName");
        if (wishProducts) {
          return res.json({ Products: wishProducts });
        }
      } catch (err) {
        return res.json({ error: "Something went wrong to get wish product" });
      }
    }
  }

  async getCartProduct(req, res) {
    let { productArray } = req.body;
    if (!productArray) {
      return res.json({ error: "All fields must be required" });
    } else {
      try {
        let cartProducts = await productModel
          .find({
            _id: {
              $in: productArray,
            },
          })
          .populate("pCategory", "cName");
        if (cartProducts) {
          return res.json({ Products: cartProducts });
        }
      } catch (err) {
        return res.json({ error: "Something went wrong to get wish product" });
      }
    }
  }

  async postAddReview(req, res) {
    let { pId, review, rating, userId } = req.body;
    if (!pId || !review || !rating || !userId) {
      return res.json({ error: "All fields must be required" });
    } else {
      try {
        let reviews = {
          review,
          rating,
          user: userId,
        };
        let pushReview = await productModel.findByIdAndUpdate(pId, {
          $push: { pRatingsReviews: reviews },
        });
        if (pushReview) {
          return res.json({ success: "Your review has been published" });
        }
      } catch (err) {
        return res.json({ error: "Something went wrong to push your review" });
      }
    }
  }

  async deleteReview(req, res) {
    let { pId, rId } = req.body;
    if (!pId || !rId) {
      return res.json({ error: "All fields must be required" });
    } else {
      try {
        let pullReview = await productModel.findByIdAndUpdate(pId, {
          $pull: { pRatingsReviews: { _id: rId } },
        });
        if (pullReview) {
          return res.json({ success: "Your review has been deleted" });
        }
      } catch (err) {
        return res.json({ error: "Something went wrong to delete review" });
      }
    }
  }

  async submitConsignment(req, res) {
    let { pName, pDescription, pPrice, pQuantity, pCategory, pOffer, pStatus, pType } = req.body;
    let images = req.files;

    // Validation
    if (!pName || !pDescription || !pPrice || !pQuantity || !pCategory || !pOffer || !pStatus || !pType || images.length !== 2) {
      Product.deleteImages(images, "file");
      return res.json({ error: "All fields must be required and exactly 2 images" });
    }

    // Validate Name and description
    if (pName.length > 255 || pDescription.length > 3000) {
      Product.deleteImages(images, "file");
      return res.json({ error: "Name must be less than 255 & Description must not be more than 3000 characters" });
    }

    try {
      let allImages = [];
      for (const img of images) {
        allImages.push(img.filename);
      }
      let newProduct = new productModel({
        pImages: allImages,
        pName,
        pDescription,
        pPrice,
        pQuantity,
        pCategory,
        pOffer,
        pStatus,
        pType,
        approved: false
      });
      let save = await newProduct.save();
      if (save) {
        return res.json({ success: "Product submitted successfully and is pending approval" });
      }
    } catch (err) {
      console.log(err);
      Product.deleteImages(images, "file");
      return res.json({ error: "Product submission failed" });
    }
  }

  async approveConsignment(req, res) {
    try {
      const { id } = req.params;
      const item = await productModel.findByIdAndUpdate(id, { approved: true }, { new: true });
      res.json(item);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Approval failed' });
    }
  }
}

module.exports = new Product();
