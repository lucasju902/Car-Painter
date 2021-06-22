let Bookshelf = require("bookshelf");
const bookshelfUuid = require("bookshelf-uuid");
const cascadeDelete = require("bookshelf-cascade-delete");
const knex = require("./knex");

const bookshelf = Bookshelf(knex).plugin(bookshelfUuid, cascadeDelete);
module.exports = bookshelf;
