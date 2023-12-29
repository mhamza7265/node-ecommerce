const { body, validationResult } = require("express-validator");

module.exports = {
  createCategoryValidation: [
    body("name").exists().withMessage("Name is require!"),
    body("description").exists().withMessage("Description is require!"),
  ],
  handleValidationErrors: (req, res, next) => {
    console.log(req.body)
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.json({ status: false, Error: error.array() });
    }
    next();
  },
};
