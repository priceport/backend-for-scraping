const Tesseract = require('tesseract.js');

async function detectTextFromURL(imageUrl) {

   if(!imageUrl) return null;

    try {
      const { data: { text } } = await Tesseract.recognize(imageUrl);
      return text;
    } catch (error) {
      console.error('Error detecting text:', error);
      return null;
    }

}

module.exports = detectTextFromURL;