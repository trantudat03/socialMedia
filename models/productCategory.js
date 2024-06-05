const mongoose = require("mongoose");

const productCategorySchema = new mongoose.Schema({
  idCategory: { type: String, required: true, unique: true },
  name: String,
  description: String,
  createDate: Date,
  status: String,
  images: [String],
});

const ProductCategoryModel = mongoose.model(
  "productCategory",
  productCategorySchema
);

module.exports = ProductCategoryModel;
