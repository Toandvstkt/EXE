const orderModel = require("../models/orders");
const Product = require('../models/products'); 
class Order {
  async getAllOrders(req, res) {
    try {
      let Orders = await orderModel
        .find({})
        .populate("allProduct.id", "pName pImages pPrice")
        .populate("user", "name email")
        .sort({ _id: -1 });
      if (Orders) {
        return res.json({ Orders });
      }
    } catch (err) {
      console.log(err);
    }
  }

  async getOrderByUser(req, res) {
    let { uId } = req.body;
    if (!uId) {
      return res.json({ message: "All filled must be required" });
    } else {
      try {
        let Order = await orderModel
          .find({ user: uId })
          .populate("allProduct.id", "pName pImages pPrice")
          .populate("user", "name email")
          .sort({ _id: -1 });
        if (Order) {
          return res.json({ Order });
        }
      } catch (err) {
        console.log(err);
      }
    }
  }

  async postCreateOrder(req, res) {
    let { allProduct, user, amount, shippingMethod, address, phone } = req.body;
    if (
      !allProduct ||
      !user ||
      !amount ||
      !shippingMethod ||
      !address ||
      !phone
    ) {
      return res.json({ message: "All filled must be required" });
    } else {
      try {
        let newOrder = new orderModel({
          allProduct,
          user,
          amount,
          shippingMethod,
          address,
          phone,
        });
        let save = await newOrder.save();
        if (save) {
          return res.json({ success: "Order created successfully" });
        }
      } catch (err) {
        return res.json({ error: error });
      }
    }
  }

  async postUpdateOrder(req, res) {
    let { oId, status } = req.body;
    if (!oId || !status) {
      return res.json({ message: "All filled must be required" });
    } else {
      let currentOrder = orderModel.findByIdAndUpdate(oId, {
        status: status,
        updatedAt: Date.now(),
      });
      currentOrder.exec((err, result) => {
        if (err) console.log(err);
        return res.json({ success: "Order updated successfully" });
      });
    }
  }

  async postDeleteOrder(req, res) {
    let { oId } = req.body;
    if (!oId) {
      return res.json({ error: "All filled must be required" });
    } else {
      try {
        let deleteOrder = await orderModel.findByIdAndDelete(oId);
        if (deleteOrder) {
          return res.json({ success: "Order deleted successfully" });
        }
      } catch (error) {
        console.log(error);
      }
    }
  }
  async postCreateCODOrder(req, res) {
    let { allProduct, user, amount, address, phone } = req.body;
    if (!allProduct || !user || !amount || !address || !phone) {
        return res.json({ message: "All fields must be required" });
    } else {
        try {
            let insufficientProducts = []; // Danh sách sản phẩm không đủ số lượng trong kho
            for (let product of allProduct) {
                let existingProduct = await Product.findById(product.id);
                if (existingProduct) {
                    if (existingProduct.pQuantity === 0 || existingProduct.pQuantity < product.quantity) {
                        // Nếu số lượng sản phẩm trong kho không đủ, thêm vào danh sách sản phẩm không đủ
                        insufficientProducts.push(existingProduct.pName);
                    } else {
                        // Trừ số lượng sản phẩm từ kho
                        existingProduct.pQuantity -= product.quantity;
                        await existingProduct.save();
                    }
                }
            }
            if (insufficientProducts.length > 0) {
                // Nếu có sản phẩm không đủ số lượng trong kho, trả về thông báo lỗi
                return res.json({ error: `Not enough quantity for products: ${insufficientProducts.join(', ')}` });
            } else {
                // Nếu tất cả sản phẩm đều đủ số lượng trong kho, tạo đơn hàng và trả về kết quả thành công
                let newOrder = new orderModel({
                    allProduct,
                    user,
                    amount,
                    shippingMethod: 'COD', 
                    address,
                    phone,
                });
                let save = await newOrder.save();
                if (save) {
                    return res.json({ success: "COD order created successfully" });
                }
            }
        } catch (err) {
            return res.json({ error: err.message });
        }
    }
}




}

const ordersController = new Order();
module.exports = ordersController;
