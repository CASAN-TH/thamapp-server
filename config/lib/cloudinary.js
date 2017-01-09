'use strict';
var cloudinary = require('cloudinary');

cloudinary.config({
    cloud_name: 'hrpqiager',
    api_key: '576311539598718',
    api_secret: 'RlDrF-JO1HdapFkN2zHwtUBCerE'
});

module.exports.cloudinary = cloudinary;

