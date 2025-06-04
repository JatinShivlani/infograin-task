const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: false,
  }
});

const Category = mongoose.models.Category || mongoose.model("Category", CategorySchema);
export default Category;