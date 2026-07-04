const Product = require('../models/Product');
const fs = require('fs');

// @desc    Handle Multimodal AI Chat & Product Recommendations
// @route   POST /api/ai/chat
// @access  Public (or Private depending on needs)
const handleChat = async (req, res) => {
  try {
    const { GoogleGenAI } = await import('@google/genai');
    const ai = new GoogleGenAI({});
    
    const { message } = req.body;
    let imagePart = null;

    // Handle Image Upload if present
    if (req.file) {
      const mimeType = req.file.mimetype;
      const fileData = fs.readFileSync(req.file.path).toString('base64');
      imagePart = {
        inlineData: {
          data: fileData,
          mimeType
        }
      };
      
      // Clean up the uploaded file after reading
      fs.unlinkSync(req.file.path);
    }

    if (!message && !imagePart) {
      return res.status(400).json({ error: 'Please provide a text message or an image.' });
    }

    const systemInstruction = `
      You are the AI Shopping Assistant for "Rishabh Provision Store", an Indian grocery supermarket.
      Your job is to help customers find products, suggest recipes, and answer questions.
      
      IMPORTANT RAG INSTRUCTION:
      If the user is asking for a recipe, ingredients, or trying to buy something, you MUST output a JSON block at the very end of your response containing product search keywords.
      Format this EXACTLY like this:
      
      ___KEYWORDS___
      ["keyword1", "keyword2"]
      ___END_KEYWORDS___
      
      Example: If they want to make pasta, output:
      ___KEYWORDS___
      ["pasta", "tomato sauce", "cheese", "olive oil"]
      ___END_KEYWORDS___
      
      If the user uploads an image of a grocery item, identify it and output its name in the keywords array so we can search the store for it.
      Be polite, concise, and helpful.
    `;

    const contents = [{ role: 'user', parts: [] }];
    if (message) contents[0].parts.push({ text: message });
    if (imagePart) contents[0].parts.push(imagePart);

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      }
    });

    const aiText = response.text;

    // Extract Keywords if present
    let keywords = [];
    let cleanResponseText = aiText;
    
    const keywordMatch = aiText.match(/___KEYWORDS___\s*([\s\S]*?)\s*___END_KEYWORDS___/);
    if (keywordMatch && keywordMatch[1]) {
      try {
        keywords = JSON.parse(keywordMatch[1]);
        // Remove the keyword block from the final text shown to user
        cleanResponseText = aiText.replace(/___KEYWORDS___\s*([\s\S]*?)\s*___END_KEYWORDS___/, '').trim();
      } catch (e) {
        console.error('Failed to parse AI keywords JSON:', e);
      }
    }

    // Fetch Recommended Products from MongoDB based on keywords
    let recommendedProducts = [];
    if (keywords.length > 0) {
      // Build a regex OR query for all keywords
      const regexArray = keywords.map(kw => new RegExp(kw, 'i'));
      
      recommendedProducts = await Product.find({
        $or: [
          { name: { $in: regexArray } },
          { tags: { $in: regexArray } }
        ]
      }).limit(5).select('name mrp sellingPrice images stock');
    }

    res.json({
      text: cleanResponseText,
      recommendations: recommendedProducts
    });

  } catch (error) {
    console.error('AI Error:', error);
    res.status(500).json({ error: 'Failed to process AI request.' });
  }
};

module.exports = { handleChat };
