const express = require('express');
const path = require('path');
const cors = require('cors');
const { NlpManager } = require('node-nlp');
const { knowledgeBase, findResponse, addToKnowledgeBase } = require('./knowledgeBase');
const fs = require('fs');

const app = express();
const manager = new NlpManager({ languages: ['en', 'fr', 'es'] });

app.use(express.json());
app.use(cors());
const logsDirectory = path.join(__dirname, 'logs');

const port = 4000;

// Function to train the NLP manager for all languages
async function trainNLPManager() {
    try {
        for (const lang of manager.settings.languages) {
            knowledgeBase.forEach(entry => {
                manager.addDocument(lang, entry.examples.join(' '), entry.intent);
            });
        }
        await manager.train();

        console.log('NLP manager trained successfully for all languages.');
    } catch (error) {
        console.error('Error training NLP manager:', error);
    }
}

// Route to add data to knowledge base
app.post('/add-to-knowledge-base', (req, res) => {
    try {
        const { intent, examples, response } = req.body;
        if (!intent || !examples || !response) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        addToKnowledgeBase(intent, examples, response, manager);
        return res.status(200).json({ message: 'Data added to knowledge base successfully' });
    } catch (error) {
        console.error('Error adding data to knowledge base:', error);
        return res.status(500).json({ error: 'Failed to add data to knowledge base' });
    }
});

// Route to process user input
app.post('/process-input', (req, res) => {
    try {
        const { userInput } = req.body;
        if (!userInput) {
            return res.status(400).json({ error: 'User input is required' });
        }
        const foundResponse = findResponse(userInput)
        manager.process('en', userInput)
            .then(result => {
                return res.status(200).json({ foundResponse });
            })
            .catch(error => {
                console.error('Error processing user input:', error);
                return res.status(500).json({ error: 'Failed to process user input' });
            });
    } catch (error) {
        console.error('Error processing user input:', error);
        return res.status(500).json({ error: 'Failed to process user input' });
    }
});

// Route to process transcription and train NLP manager
app.post('/process-transcription', async (req, res) => {
    try {
        const { transcript } = req.body;
        if (!transcript) { 
            return res.status(400).json({ error: 'Transcript data is required' });
        }

        await trainNLPManager();
        manager.addDocument('en', transcript, 'voiceData');
        // await manager.train();
        await manager.save();

        res.status(200).json({ message: 'NLP model trained successfully with voice data' });
    } catch (error) {
        console.error('Error processing transcription:', error);
        res.status(500).json({ error: 'Failed to process transcription' });
    }
});

// Route to retrieve the knowledge base
app.get('/knowledge-base', (req, res) => {
    return res.status(200).json({ knowledgeBase });
});

// Route for parsing JSON objects to raw log files
app.post('/parse-json-to-log', (req, res) => {
    try {
        const jsonData = req.body;

        if (!jsonData) {
            return res.status(400).json({ error: 'No JSON data provided' });
        }

        const fileName = `log_${Date.now()}.txt`;

        fs.writeFile(path.join(logsDirectory, fileName), JSON.stringify(jsonData, null, 2), err => {
            if (err) {
                console.error('Error writing to log file:', err);
                return res.status(500).json({ error: 'Failed to write to log file' });
            }
            console.log('JSON data written to log file:', fileName);
            return res.status(200).json({ message: 'JSON data written to log file successfully', fileName });
        });
    } catch (error) {
        console.error('Error parsing JSON to log:', error);
        res.status(500).json({ error: 'Failed to parse JSON to log' });
    }
});

// Create logs directory if it doesn't exist
if (!fs.existsSync(logsDirectory)) {
    fs.mkdirSync(logsDirectory);
}

// Start the server
app.listen(port, async () => {
    console.log('SERVER RUNNING AT PORT:', port);
});
