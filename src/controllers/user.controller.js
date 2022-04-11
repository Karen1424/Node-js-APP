const {validationResult} = require("express-validator");
const User = require("../models/user.model");
const Book = require("../models/book.model");
const { prototype } = require("../models/book.model");


module.exports.attachField = async (req,res) => {
    try {
          const errors = validationResult(req);
          if(!errors.isEmpty()) {
            return res.status(400)
                .json({
                    errors: errors.array()
                });
        } 
        const field = await Book.prototype.findById(req.body.book_id);
        if(!field) {
            return res.status(400)
                .json({
                    msg: "Invalid field"
                });
        }

        const user = new User({id:req.sentinel.id});
        const attachField = await user.attachField(field.id);
        if(!attachField) {
            return res.status(400)
                .json({
                    msg: "Field is already attached to user"
                });
        }
        return res.status(200)
            .json({
                msg:"Field successfully attached to user"
            });
    } catch(e) {
        console.error(e);
        return res.status(500)
            .json({
                msg: "Server Error"
            });
    }
}

module.exports.detuchField = async (req,res) => {
    try {
        const user = new User({id:req.sentinel.id});
        const detached = await user.detuchField(req.params.id);

        if(!detached) {
            return res.status(404)
                .json({
                    msg: "Attached field not found"
                });
        }
        return res.status(200)
            .json({
                msg:"Field successfully detached from user"
            });
    } catch(e) {
        console.error(e);
        return res.status(500)
            .json({
                msg: "Server Error"
            });
    }
}

module.exports.index = async (req, res) => {
    try {
      const users = await User.prototype.findByQuery(req.query);
      return res.status(200)
        .json(users);
    } catch(e) {
      console.error(e, "error a");
      return res.status(500)
        .json({
          msg: 'Server Error'
        });
    }
  };

  module.exports.update = async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (id !== req.sentinel.id) {
        return res.status(403)
          .json({
            msg: 'Access denied'
          });
      }
  
      const errors = validationResult(req);
      if ( !errors.isEmpty()) {
        return res.status(400)
          .json({
            errors: errors.array()
          });
      }
          
      const user = new User(req.body);
      const updated = await user.update(id);
      if ( !updated) {
        return res.status(404)
          .json({
            msg: 'User not found'
          });
      }
  
      return res.status(200)
        .json({
          msg: 'User successfully updated'
        });
    } catch (e) {
      console.error(e);
      return res.status(500)
        .json({
          msg: 'Server Error'
        });                
    }
};

module.exports.delete = async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (id !== req.sentinel.id) {
        return res.status(403)
          .json({
            msg: 'Access denied'
          });
      }
  
      const deleted = await (new User()).delete(id);
      if ( !deleted) {
        return res.status(404)
          .json({
            msg: 'User not found'
          });
      }
  
      return res.status(200)
        .json({
          msg: 'User successfully deleted'
        });
    } catch (e) {
      console.error(e);
      return res.status(500)
        .json({
          msg: 'Server Error'
        });
    }
};