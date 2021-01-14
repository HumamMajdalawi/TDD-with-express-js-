import mongoose from "mongoose"
import bcrypt from "bcrypt"

const userSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password:{
        type: String,
        required: true,
    },

    settings:{
        theme:{
            type: String,
            required: true,
            default: "dark"
        },
        notifications:{
            type: Boolean,
            required: true,
            default: true
        },
        compactMode:{
            type: Boolean,
            requried: true,
            default: false
        }
    }
})

userSchema.pre("save", function(next){
    if(! this.isModified("password")){
        return next()
    }

    bcrypt.hash(this.password,8,(err,hash) => {
        if(err)
            return next(err)

        this.password = hash
        next()
    })
})

userSchema.methods.checkPassword = function(password){
    const passwordHash = this.password
    return new Promise((resolver, reject)=> {
        bcrypt.compare(password,passwordHash,(err,same)=>{
            if(err)
                return reject(err)
            resolver(same)
        })
    })   
}

export const user = mongoose.model("user",userSchema)