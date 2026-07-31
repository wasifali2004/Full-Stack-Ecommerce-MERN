import mongoose from "mongoose";

const generateCustomerId = () => {
    const randomPart = Math.random().toString(36).slice(2, 8).toUpperCase();
    return `CUST-${randomPart}`;
};

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique: true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:['user','admin'],
        default:'user'
    },
    customerId:{
        type:String,
        unique:true,
        sparse:true
    },
    cartData:{
        type:Object,
        default: {}
    },
}, {minimize:false})

userSchema.pre('save', async function(next) {
    if (this.isNew && !this.customerId) {
        let customerId = generateCustomerId();
        let existingUser = await mongoose.models.user?.findOne({ customerId });

        while (existingUser) {
            customerId = generateCustomerId();
            existingUser = await mongoose.models.user?.findOne({ customerId });
        }

        this.customerId = customerId;
    }

    next();
});

const userModel = mongoose.models.user || mongoose.model("user", userSchema);

export default userModel;