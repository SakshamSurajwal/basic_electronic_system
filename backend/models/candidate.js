const mongoose=require('mongoose');
const User = require('./user');

const candidateSchema=mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    age:{
        type: Number,
        required: true
    },
    post:{
        type: String,
        required: true
    },
    aadharNum:{
        type:Number,
        required: true
    },
    voteCount:{
        type: Number,
        default: 0
    },
    isProposed:{
        type: Boolean,
        default: false
    },
    isSecondered:{
        type: Boolean,
        default: false
    }
},{
    timestamps:true
});

const Candidate=mongoose.model(`Candidate`,candidateSchema);
module.exports=Candidate;