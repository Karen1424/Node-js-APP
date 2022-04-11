const {Router} = require("express");
const {body} = require("express-validator");
const authController = require("../controllers/auth.controller");

const router = Router();

// Post api/v1/auth/signUp
router.post(
    "/signUp",
    [
        body("first_name").trim().escape().not().isEmpty().withMessage("First Name is requierid")
        .isLength({max:255}).withMessage("First name can not be longger than 255 characters"),
        body("last_name").trim().escape().not().isEmpty().withMessage("last name is requierid")
        .isLength({max:255}).withMessage("last name name can not be longger than 255 characters"),
        body('email', 'Invalid Email').normalizeEmail().isEmail(),
        body('password', 'Invalid Password').isLength({min: 6}),
        body('phone','invalid phone number').isLength({min:8})
          
    ],
    authController.signUp
);

// Post api/v1/auth/signIn
router.post(
    "/signIn",
    [
        body('email', 'Invalid Email').normalizeEmail().isEmail(),
        body('password', 'Password is required').not().isEmpty()
    ],
    authController.signIn
);

module.exports = router;