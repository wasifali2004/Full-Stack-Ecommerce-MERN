import mongoose from 'mongoose'

const noteSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
        trim: true,
    },
    adminName: {
        type: String,
        default: 'Admin',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
})

const noteModel = mongoose.models.note || mongoose.model('note', noteSchema)

export default noteModel
