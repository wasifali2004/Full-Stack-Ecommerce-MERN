import express from 'express'
import jwt from 'jsonwebtoken'
import noteModel from '../models/note.model.js'
import userModel from '../models/userModel.js'
import adminAuth from '../middleware/adminAuth.js'

const noteRoute = express.Router()

noteRoute.post('/add', adminAuth, async (req, res) => {
    try {
        const { text } = req.body

        if (!text || !String(text).trim()) {
            return res.status(400).json({ success: false, message: 'Note text is required' })
        }

        const token = req.headers.token || req.headers.authorization?.split(' ')[1]
        let adminName = 'Admin'

        if (token) {
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET)
                if (decoded?.id) {
                    const admin = await userModel.findById(decoded.id)
                    adminName = admin?.name || admin?.email || 'Admin'
                }
            } catch {
                adminName = 'Admin'
            }
        }

        const note = await noteModel.create({ text: String(text).trim(), adminName })
        res.status(201).json({ success: true, note })
    } catch (error) {
        console.error(error)
        res.status(500).json({ success: false, message: error.message })
    }
})

noteRoute.post('/delete', adminAuth, async (req, res) => {
    try {
        const { noteId } = req.body

        if (!noteId) {
            return res.status(400).json({ success: false, message: 'Note id is required' })
        }

        const deleted = await noteModel.findByIdAndDelete(noteId)
        if (!deleted) {
            return res.status(404).json({ success: false, message: 'Note not found' })
        }

        res.json({ success: true, message: 'Note deleted' })
    } catch (error) {
        console.error(error)
        res.status(500).json({ success: false, message: error.message })
    }
})

export default noteRoute
