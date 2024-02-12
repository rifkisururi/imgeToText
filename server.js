import {express} from require('express');
import {multer} from require('multer');
import { createWorker } from 'tesseract.js';


const app = express();
const PORT = process.env.PORT || 3000;

// Set up Multer for file uploads
const upload = multer({ dest: 'uploads/' });

const worker = createWorker();

// Route to handle file upload and text extraction
app.post('/upload', upload.single('image'), async (req, res) => {
    try {
        // Load the image using Tesseract
        await worker.load();
        await worker.loadLanguage('eng');
        await worker.initialize('eng');
        const { data: { text } } = await worker.recognize(req.file.path);
        
        // Send the extracted text as response
        res.json({ text });
    } catch (error) {
        console.error('Error extracting text:', error);
        res.status(500).json({ error: 'Error extracting text from the image' });
    } finally {
        // Terminate the Tesseract worker
        await worker.terminate();
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
