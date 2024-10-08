import mongoose, {Schema} from "mongoose"
import { JsonWebTokenError } from "jsonwebtoken"
import bcrpyt from "bcrpyt"

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true
        },

        email:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true
        },

        fullname:{
            type:String,
            trim:true,
            index:true
        },

        avatar:{
            type:String,
            required:true,
        },

        coverImage:{
            type:String
        },

        watchHistory:{
            type: mongoose.Schema.Types.ObjectId,
            ref:"Video"
        },

        password:{
            type:String,
            required: [true, "Password is required"],
            unique: true,
        },

        refreshToken:{
            type: String
        }
    },
    {
        timestamps:true
    }
)

userSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next()

    this.password = bcrpyt.hash(this.password, 10)
    next()
})

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrpyt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function(){
    return JsonWebTokenError.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefresToken = async function(){
    return JsonWebTokenError.sign(
        {
            _id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User", userSchema)