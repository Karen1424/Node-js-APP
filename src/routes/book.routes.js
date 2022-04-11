const {Router} = require("express");
const {body} = require("express-validator");
const bookController = require("../controllers/book.controller");

const router = Router();

// GET api/v1/books get list of books
router.get("/",bookController.index);

// POST api/v1/books create book
router.post(
    "/",
    [
    body('book_name').trim().escape().not().isEmpty().withMessage('Field book_name is required')
    .isLength({max: 255}).withMessage('Field book_name cannot be longer than 255 characters')
    ],
    bookController.create
);

module.exports = router;
