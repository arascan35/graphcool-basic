const graphql = require("graphql");
const _ = require("lodash");
const Book = require("../models/book");
const Author = require("../models/author");
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull
} = graphql;

// dummy data
// var books = [
//     { name: 'Nutuk', genre: 'Histroy', id: '1',authorId:'1' },
//     { name: 'Sherlock Holmes', genre: 'Detective', id: '2',authorId:'1' },
//     { name: 'The Long Earth', genre: 'Sci-Fi', id: '3',authorId:'1' },
//     { name: 'Beyaz Geceler', genre: 'Sci-Fi', id: '4',authorId:'1' },
//     { name: 'Deneme', genre: 'Sci-Fi', id: '5',authorId:'1' },
// ];

// var authors = [
//     { name: 'Can', age: '23', id: '1' },
//     { name: 'Aras', age: '22', id: '2' },
//     { name: 'Ahmet', age: '21', id: '3' },
//     { name: 'Mehmet', age: '20', id: '4' },
//     { name: 'universlit', age: '4', id: '5' },
// ];

const BookType = new GraphQLObjectType({
  name: "Book",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: new GraphQLNonNull(GraphQLString) },
    genre: { type: GraphQLString },
    author: {
      type: AuthorType,
      resolve(parent, args) {
        // DUMMY DATA OPERATIONS
        // parent - >{ name: 'Nutuk', genre: 'Histroy', id: '1', author: '1' }
        // book(id:1){
        //     name
        //     id
        //     author{
        //       name
        //       age
        //     }
        //   }
        // return _.find(authors,{id :parent.id})
        return Author.findById(parent.authorId)
      }
    }
  })
});

const AuthorType = new GraphQLObjectType({
  name: "Author",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
    book: {
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        // DUMMY DATA OPERATIONS
        // parent -> { name: 'universlit', age: '4', id: '3' }
        // author(id:3){
        //     name
        //     age
        //     book{
        //       name
        //       id
        //     }
        //   }
        // books arrayi içindeki authotId ile authors arrayi içindeki id'si eşit olanlar
        //return _.filter(books,{authorId:parent.id})
        return Book.find({authorId:parent.id})
      }
    }
  })
});

// In front-end using like this
// book(id:"1"){
//     name
//     genre
//     id
//  }
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    // get book info
    book: {
      type: BookType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        // DUMMY DATA OPERATIONS
        // get data from db
        //return _.find(books, { id: args.id });

        return Book.findById(args.id)
      }
    },
    // get author info
    author: {
      type: AuthorType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        // DUMMY DATA OPERATIONS
        //return _.find(authors,{id: args.id})
        return Author.findById(args.id)
      }
    },

    //get all books info
    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        // DUMMY DATA OPERATIONS
        //return books
        return Book.find({})
      }
    },


    // authors{
    //     name
    //     book{
    //       name
    //     }
    // }
    authors: {
      type: new GraphQLList(AuthorType),
      resolve(parent, args) {
        // DUMMY DATA OPERATIONS
        //return authors
        return Author.find({})
      }
    }
  }
});

// mutation {
//     addBook(name: "Beyaz Diş", genre: "asdad", type: "qweew") {
//       id
//     }
//   }

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addAuthor: {
      type: AuthorType,
      args: {
        name: { type: GraphQLString },
        age: { type: GraphQLInt }
      },
      resolve(parent, args) {
        let author = new Author({
          name: args.name,
          age: args.age
        });
        return author.save();
      }
    },

    // addBook(name:"Book2",genre:"Genre2",authorId:"5d18a1fb6e84d962bf2a5eb2"){
    //     id
    //   }
    addBook: {
      type: BookType,
      args: {
        name: { type: GraphQLString },
        genre: { type: GraphQLString },
        authorId:{type:GraphQLID},
      },
      resolve(parent, args) {
        let book = new Book({
          name: args.name,
          authorId:args.authorId,
          genre: args.genre
        });
        return book.save();
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});
