const Category = require("../models/category");

exports.getCategoryById = (req, res, next, id) => {
    Category.findById(id).exec((err, cate) => {
      if (err) {
        return res.status(400).json({
          error: "Category not found in DB"
        });
      }
      req.category = cate;
      next();
    });
  };

exports.createCategory = (req, res) => {
    const category = new Category(req.body);

    category.save((error, category) => {
        if(error){
            return res.status(400).json({
                error: "Failed to create the category!"
            })
        }

        res.json({category});
    })

}

exports.getCategory = (req, res) => {
    return res.json(req.category);
}

exports.getAllCategories = (req, res) => {
    Category.find().exec((err, item) => {
        if(err){
            return res.status(400).json({
                error: "No categories Found!"
            })
        }

        res.json(item);
    })
}

exports.updateCategory = (req, res) => {
    //req.category; able to get because of getCategorybyId middleware at top
    const category = req.category;
    category.name = req.body.name;

    category.save((err, updatedCategory) => {
        if(err){
            return res.status(400).json({
                error: "Category updatation failed!"
            })
        }

        res.json(updatedCategory);
    })
}

exports.removeCategory = (req, res) => {
    const category = req.category;

    category.remove((err, category) => {
        if(err){
            return res.status(400).json({
                error: "Category deletion failed!"
            })
        }

        res.json({
            msg: `${category.name} deleted successfully`
        })
    })
}