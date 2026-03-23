import mongoose from "mongoose";


const projectSchema=new mongoose.Schema({
    name:{
        type:String,
        lowercase:true,
        required:true,
        trim:true,
        unique:[true,'Project name must be unique'],
    },
    users:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'user'
        }
    ],
    fileTree: {
        type: Object,
        default: {}
    },
    messages: [
        {
            sender: {
                _id: String,
                email: String,
            },
            message: String,
        }
    ],
})

const Project=mongoose.model('project',projectSchema);

export default Project;