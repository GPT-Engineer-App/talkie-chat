# talkie-chat

Objective:
Develop a push-to-talk chat interface in a React.js application using the Gemini 1.5 Pro model that allows users to record audio by holding the spacebar, uploads the recorded audio to the Gemini API, and provides responses using text-to-speech (TTS). The system should handle errors gracefully and consider the tone, mood, and sentiment in both the user's audio input and the TTS responses to match the user's empathy.

Requirements:
Audio Recording and Upload:

Pressing the spacebar starts recording audio.
Releasing the spacebar stops recording and uploads the audio to the Gemini API.
Implement verbose error handling for recording and uploading processes.
Response Handling:

Convert the text response from Gemini API to TTS.
Ensure the TTS response matches the user's tone, mood, and sentiment.
API Integration:

Use the Gemini API key stored in a .env file.
Configure the API to handle both the recording upload and response generation.
Implementation Steps:
Step 1: Environment Setup
Install required packages:
bash
Copy code
npm install @google-generative-ai google-text-to-speech react-mic axios dotenv
Step 2: Create a .env File
Create a .env file in the project root and add the API key:
makefile
Copy code
REACT_APP_GEMINI_API_KEY=AIzaSyAVeG_1TO1z23Ow3Ag2iIzNq8F13Z7IoKQ
Step 3: Audio Recording Component
Implement an audio recording component using react-mic.
Step 4: Uploading Audio to Gemini API
Use axios to handle the audio file upload.
Implement verbose error handling to manage possible upload issues.
Step 5: Generating and Handling Responses
Send the audio file to the Gemini API and receive a text response.
Use TTS to convert the text response to audio.
Adjust the TTS output to match the user's tone and sentiment.
Example Code:
1. Load Environment Variables
Create a setupProxy.js file to use the .env variables in the React app:

javascript
Copy code
const { createProxyMiddleware } = require('http-proxy-middleware');
require('dotenv').config();

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://api.google.com',
      changeOrigin: true,
      pathRewrite: {
        '^/api': '',
      },
    })
  );
};
2. Audio Recording Component
Create a component AudioRecorder.js:

javascript
Copy code
import React, { useState } from 'react';
import { ReactMic } from 'react-mic';

const AudioRecorder = ({ onStop }) => {
  const [record, setRecord] = useState(false);

  const startRecording = () => {
    setRecord(true);
  };

  const stopRecording = () => {
    setRecord(false);
  };

  return (
    <div>
      <button
        onMouseDown={startRecording}
        onMouseUp={stopRecording}
      >
        Hold Spacebar to Record
      </button>
      <ReactMic
        record={record}
        className="sound-wave"
        onStop={onStop}
        mimeType="audio/wav"
        strokeColor="#000000"
        backgroundColor="#FF4081"
      />
    </div>
  );
};

export default AudioRecorder;
3. Uploading Audio and Handling Errors
Create a file api.js for API interactions:

javascript
Copy code
import axios from 'axios';

const uploadAudio = async (blob) => {
  const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
  const formData = new FormData();
  formData.append('file', blob, 'audio.wav');

  try {
    const response = await axios.post('/api/gemini/v1/upload', formData, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading audio:', error);
    throw error;
  }
};

export { uploadAudio };
4. Generating TTS Response
Create a file tts.js for TTS functionality:

javascript
Copy code
import googleTTS from 'google-tts-api';

const getTTS = async (text) => {
  try {
    const url = googleTTS.getAudioUrl(text, {
      lang: 'en',
      slow: false,
      host: 'https://translate.google.com',
    });
    const audio = new Audio(url);
    audio.play();
  } catch (error) {
    console.error('Error generating TTS:', error);
  }
};

export { getTTS };
5. Main App Component
Integrate everything in the App.js:

javascript
Copy code
import React from 'react';
import AudioRecorder from './AudioRecorder';
import { uploadAudio } from './api';
import { getTTS } from './tts';

const App = () => {
  const handleStop = async (recordedBlob) => {
    try {
      const response = await uploadAudio(recordedBlob.blob);
      const textResponse = response.text;  // Assuming the response contains a text field
      getTTS(textResponse);
    } catch (error) {
      console.error('Error handling the response:', error);
    }
  };

  return (
    <div className="App">
      <h1>Push-to-Talk Chat Interface</h1>
      <AudioRecorder onStop={handleStop} />
    </div>
  );
};

export default App;
Testing and Validation:
Ensure audio is recorded and uploaded correctly.
Verify text responses are generated accurately.
Validate TTS output for correct empathy matching.

## Collaborate with GPT Engineer

This is a [gptengineer.app](https://gptengineer.app)-synced repository 🌟🤖

Changes made via gptengineer.app will be committed to this repo.

If you clone this repo and push changes, you will have them reflected in the GPT Engineer UI.

## Tech stack

This project is built with React and Chakra UI.

- Vite
- React
- Chakra UI

## Setup

```sh
git clone https://github.com/GPT-Engineer-App/talkie-chat.git
cd talkie-chat
npm i
```

```sh
npm run dev
```

This will run a dev server with auto reloading and an instant preview.

## Requirements

- Node.js & npm - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
