const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const Groq = require('groq-sdk');
const Scheme = require('../models/Schem');




/*Each scheme object is converted into text.
Frontend → user types message
Backend Route → receives message
Database → gives scheme details
Groq AI → thinks and generates answer
Frontend → shows reply

*/




router.post('/', auth(['user', 'admin']), async (req, res) => {
    try {
        console.log("Using API Key:", process.env.GROQ_API_KEY ? process.env.GROQ_API_KEY.substring(0, 10) + "..." : "UNDEFINED");
        const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
        
        
        // Log incoming message and previous messages for debugging
        /*{
  "message": "Tell me schemes for students",
  "previousMessages": [
    { "role": "user", "content": "Hi" },
    { "role": "assistant", "content": "Hello!" }
  ]
}*/
        const { message, previousMessages } = req.body;


        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        // Fetch scheme context from DB
        let schemeContext = '';
        try {
            const schemes = await Scheme.findAll({ limit: 50 });
            schemeContext = schemes
                .map(s => `${s.scheme_name}: ${s.description || ''}`)
                .join('\n')
                .substring(0, 3000);
        } catch (dbErr) {
            console.warn('Could not fetch schemes:', dbErr.message);
        }

        const systemPrompt = `You are a helpful Indian Government Schemes AI Assistant. 
Answer concisely and accurately about Indian government welfare schemes, eligibility, and benefits.
${schemeContext ? `\nAvailable schemes for context:\n${schemeContext}` : ''}`;

        // Build message history
        //Each scheme object is converted into text.
        const msgs = [
            { role: 'system', content: systemPrompt },
            ...(previousMessages || []).filter(m => m.role === 'user' || m.role === 'assistant'),
            { role: 'user', content: message }
        ];

        const completion = await groq.chat.completions.create({
            messages: msgs,
            model: 'llama-3.3-70b-versatile',
            temperature: 0.3,
            max_tokens: 1000
        });

        const reply = completion.choices[0]?.message?.content || 'I am unable to assist at the moment.';
        res.json({ reply });

    } catch (error) {
        const errMsg = error?.message || 'Unknown error';
        console.error('Chat error:', errMsg);
        res.status(500).json({ error: 'Failed to generate reply: ' + errMsg });
    }
});

module.exports = router;
/*1) Database knowledge

From this:

const schemes = await Scheme.findAll({ limit: 50 });

This gives your own stored schemes.

2) LLM built-in knowledge

From this:

const completion = await groq.chat.completions.create(...)

This gives model’s general learned knowledge*/