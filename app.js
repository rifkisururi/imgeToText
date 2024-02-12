// Import required modules
import express from 'express';
import { createWorker } from 'tesseract.js';
import bodyParser from 'body-parser';

// Create an Express application
const app = express();
const port = 3000;

// Middleware to parse JSON and URL-encoded bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Define a route for OCR processing
app.post('/ocr', async (req, res) => {
  try {
    console.log(req.body);
    const imageUrl = req.body.urlImage;
    console.log('imageUrl ', imageUrl);
    var imageUrl64 = req.body.url64;
    console.log('imageUrl64 ', imageUrl64);

    var strtImg;

    if(imageUrl == undefined){
        res.send("image not found");
    }else{
        strtImg = imageUrl;
    }
    
    if(imageUrl64 == undefined){
        res.send("image not found");
    }else{
        strtImg = imageUrl64;
    }
    console.log('strtImg ', strtImg);

    const worker = await createWorker('eng');
    const ret = await worker.recognize(strtImg);
    await worker.terminate();
    console.log(ret.data.text);
    await worker.terminate();
    res.send(ret.data.text);
  } catch (error) {
    console.error('Error extracting text:', error.message);
    res.status(500).send('Error extracting text');
  }
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
