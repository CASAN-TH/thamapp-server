'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Product = mongoose.model('Product'),
  Promotion = mongoose.model('Promotion'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  multer = require('multer'),
  config = require(path.resolve('./config/config')),
  cloudinary = require(path.resolve('./config/lib/cloudinary')).cloudinary,
  _ = require('lodash');

/**
 * Create a Product
 */
exports.create = function (req, res) {
  var product = new Product(req.body);
  product.user = req.user;

  product.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(product);
    }
  });
};

/**
 * Show the current Product
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var product = req.product ? req.product.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  product.isCurrentUserOwner = req.user && product.user && product.user._id.toString() === req.user._id.toString();
  Promotion.find().sort('-created').where('product').equals(product._id).exec(function (err, promotions) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      product.promotions = promotions;
      res.jsonp(product);
    }
  });

};

/**
 * Update a Product
 */
exports.update = function (req, res) {
  var product = req.product;

  product = _.extend(product, req.body);

  product.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(product);
    }
  });
};

/**
 * Delete an Product
 */
exports.delete = function (req, res) {
  var product = req.product;

  product.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(product);
    }
  });
};

/**
 * List of Products
 */
exports.list = function (req, res) {
  if (req.user && req.user.roles[0] === 'admin') {
    Product.find().sort('-created')
      .populate('user', 'displayName')
      .exec(function (err, products) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          Promotion.find().sort('-created').exec(function (err, promotions) {
            if (err) {
              return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
              });
            } else {
              products.forEach(function (product) {

                product.promotions = [];
                //console.log(product);
                promotions.forEach(function (promotion) {
                  if (promotion.product.toString() === product._id.toString()) {
                    product.promotions.push(promotion);
                  }

                });
              });
              res.jsonp(products);
            }
          });

        }
      });
  } else {
    Product.find().sort('-created')
      .populate('user', 'displayName')
      //.where('category').equals('อาหาร') //อ่านเฉพาะรายการข้าว
      .or([{ category: 'ข้าวสาร' }, { category: 'ผลไม้' }, { category: 'ผักใบ' }, { category: 'ผักผล' }])
      .exec(function (err, products) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          Promotion.find().sort('-created').exec(function (err, promotions) {
            if (err) {
              return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
              });
            } else {
              products.forEach(function (product) {

                product.promotions = [];
                //console.log(product);
                promotions.forEach(function (promotion) {
                  if (promotion.product.toString() === product._id.toString()) {
                    product.promotions.push(promotion);
                  }

                });
              });
              res.jsonp(products);
            }
          });

        }
      });
  }

};

/**
 * Product middleware
 */
exports.productByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Product is invalid'
    });
  }

  Product.findById(id).populate('user', 'displayName').exec(function (err, product) {
    if (err) {
      return next(err);
    } else if (!product) {
      return res.status(404).send({
        message: 'No Product with that identifier has been found'
      });
    }
    req.product = product;
    next();
  });
};

/** 
 * Upload Images Product
 */
exports.changeProductPicture = function (req, res) {
  var user = req.user;
  var message = null;
  var upload = multer(config.uploads.productUpload).single('newProfilePicture');
  var profileUploadFileFilter = require(path.resolve('./config/lib/multer')).profileUploadFileFilter;

  // Filtering to upload only images
  upload.fileFilter = profileUploadFileFilter;
  if (user) {
    upload(req, res, function (uploadError) {
      if (uploadError) {
        return res.status(400).send({
          message: 'Error occurred while uploading profile picture'
        });
      } else {
        var cloudImageURL = './public/' + req.file.filename;
        cloudinary.uploader.upload(cloudImageURL, function (result) {
          var imageURL = result.url;
          res.json({ status: '000', message: 'success', imageURL: imageURL });
        });
      }
    });
  } else {
    res.status(400).send({
      message: 'User is not signed in'
    });
  }
};