// import { createWorker } from 'tesseract.js';

// (async () => {
//   const worker = await createWorker('eng');
//   const ret = await worker.recognize('https://tesseract.projectnaptha.com/img/eng_bw.png');
//   console.log(ret.data.text);
//   await worker.terminate();
// })();

// Import required modules
import express from 'express';
import { createWorker } from 'tesseract.js';

// Create an Express application
const app = express();
const port = 3000;
app.use(express.json());

// Define a route for OCR processing
app.post('/ocr', async (req, res) => {
  try {
    // Create a Tesseract worker
    const worker = await createWorker('eng');
    // console.log(req);
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
        // imageUrl64 = "data:image/jpeg;base64,"+imageUrl64;
        strtImg = imageUrl64;
    }

    console.log('strtImg ', strtImg);
    const ret = await worker.recognize(strtImg);
    console.log(ret.data.text);
    await worker.terminate();
    // Send the extracted text as the HTTP response
    res.send(ret.data.text);

    // Terminate the worker after processing
    await worker.terminate();
  } catch (error) {
    // Handle errors
    console.error('Error extracting text:', error.message);
    res.status(500).send('Error extracting text');
  }
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
