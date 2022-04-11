const {Router} = require("express");
const {body} = require("express-validator");
const userController = require("../controllers/user.controller");
const User = require("../models/user.model");

const router = Router();

// POST api/v1/field attachField to user
router.post(
    "/fields",
    [
        body("field_id").not().isEmpty().withMessage("Field id is required")
    ],
    userController.attachField
);

// GET ap1/v1/user_to_book


// DELETE api/v1/fields:id detuchField from user
router.delete("/fields:id",userController.detuchField);

// GET api/v1/users get users list
router.get("/",userController.index);

// PUT ap1/v1/users/:id update user
router.put(
    "/:id",
    [
        body('first_name').trim().escape().not().isEmpty().withMessage('First Name is required')    
        .isLength({max: 255}).withMessage('First Name cannot be longer than 255 characters'),   
        body('last_name').trim().escape().not().isEmpty().withMessage('Last Name is required') 
        .isLength({max: 255}).withMessage('First Name cannot be longer than 255 characters')
    ],
    userController.update
);

// DELETE api/v1/users/:id delete user
router.delete("/:id",userController.delete);

module.exports = router;