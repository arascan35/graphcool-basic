const moongose=require('mongoose')

const Schema=moongose.Schema


const bookSchema= new Schema({
    name:String,
    authorId: String,
    genre:String
})


module.exports=moongose.model('Book',bookSchema)