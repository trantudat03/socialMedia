const mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema({
    owner: {type: mongoose.Schema.Types.ObjectId, ref: 'TypeProduct'},
    name: String,
    priceNew: Number,
    priceOld: Number,
    description: String,
    star: Number,
    images: [String],
    quantity: Number,
    dateUpdate: String
})

const ProductModel = mongoose.model('Product', ProductSchema);

module.exports = ProductModel;