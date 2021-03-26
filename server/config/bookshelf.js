let Bookshelf = require("bookshelf");
const bookshelfUuid = require("bookshelf-uuid");
const knex = require("./knex");

const bookshelf = Bookshelf(knex).plugin(bookshelfUuid);
module.exports = bookshelf;
