import multer from 'multer'
import os from 'node:os'
import path from 'node:path'
import crypto from 'node:crypto'

const storage = multer.diskStorage({
    destination: os.tmpdir(),
    filename: function(req,file,callback) {
        const extension = path.extname(file.originalname)
        callback(null, `${crypto.randomUUID()}${extension}`)
    }
})

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (_req, file, callback) => {
        callback(null, file.mimetype.startsWith('image/'))
    },
})

export default upload;
