import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcryptjs from 'bcryptjs';

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        maxLength: [50, 'Email must be at most 50 characters long'],
        minLength: [6, 'Email must be at least 6 characters long'],
    },
    password: {
        type: String,
        select: false,
    }
});

// Static method to hash password
userSchema.statics.hashPassword = async function (password) {
    return await bcryptjs.hash(password, 10);
};
// Instance method to compare passwords
userSchema.methods.isValidPassword = async function (password) {
    return await bcryptjs.compare(password, this.password);
};
// Instance method to generate JWT token
userSchema.methods.generateJWT = function () {
    return jwt.sign(
        { _id: this._id, email: this.email },
         process.env.JWT_SECRET,
         {expiresIn:'24h'}
        );
};

// Create and export the User model
const User = mongoose.model('user', userSchema);
export default User;
