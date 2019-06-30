const graphql = require('graphql');
const _ = require('lodash');

const { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLID, GraphQLInt, GraphQLList } = graphql;

// dummy data
var books = [
    { name: 'Nutuk', genre: 'Histroy', id: '1',authorId:'1' },
    { name: 'Sherlock Holmes', genre: 'Detective', id: '2',authorId:'1' },
    { name: 'The Long Earth', genre: 'Sci-Fi', id: '3',authorId:'1' },
    { name: 'Beyaz Geceler', genre: 'Sci-Fi', id: '4',authorId:'1' },
    { name: 'Deneme', genre: 'Sci-Fi', id: '5',authorId:'1' },
];

var authors = [
    { name: 'Can', age: '23', id: '1' },
    { name: 'Aras', age: '22', id: '2' },
    { name: 'Ahmet', age: '21', id: '3' },  
    { name: 'Mehmet', age: '20', id: '4' },  
    { name: 'universlit', age: '4', id: '5' },  
];

const BookType = new GraphQLObjectType({
    name: 'Book',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        genre: { type: GraphQLString },
        author:{
            type: AuthorType,
            resolve(parent,args){
                // parent - >{ name: 'Nutuk', genre: 'Histroy', id: '1', author: '1' }
                // book(id:1){
                //     name
                //     id
                //     author{
                //       name
                //       age
                //     }
                //   }
                return _.find(authors,{id :parent.id})
            }
        }
    })
});


const AuthorType= new GraphQLObjectType({
    name:'Author',
    fields: ()=>({
        id:{type:GraphQLID},
        name:{type:GraphQLString},
        age :{type: GraphQLInt},
        book:{
            type: new GraphQLList(BookType),
            resolve(parent,args){
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
                return _.filter(books,{authorId:parent.id})
            }
        }
    })
})


// In front-end using like this
// book(id:"1"){
//     name
//     genre
//     id
//  }
const RootQuery = new GraphQLObjectType({
    
    name: 'RootQueryType',
    fields: {

        // get book info
        book: {
            type: BookType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args){
                // get data from db 
                return _.find(books, { id: args.id });
            }
        },
        // get author info
        author: {
            type: AuthorType,
            args: {id: {type:GraphQLID}},
            resolve(parent,args){
                return _.find(authors,{id: args.id})
            }
        },

        //get all books info
        books: {
            type: new GraphQLList(BookType),
            resolve(parent,args){
                return books
            }
        },
        //get all author info
        // authors{
        //     name
        //     book{
        //       name
        //     }
        //   }
        authors:{
            type: new GraphQLList(AuthorType),
            resolve(parent,args){
                return authors
            }
        }


    }
});


module.exports = new GraphQLSchema({
    query: RootQuery
});