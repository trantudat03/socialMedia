const mongoose = require('mongoose')

const typeProductSchema = new mongoose.Schema({
    typeName: String,
    
})

const TypeProductModel = mongoose.model('TypeProduct', typeProductSchema);

module.exports = TypeProductModel;