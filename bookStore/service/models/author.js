const moongose=require('mongoose')

const Schema=moongose.Schema


const authorSchema= new Schema({
    name:String,
    age:Number
})


module.exports=moongose.model('Author',authorSchema)