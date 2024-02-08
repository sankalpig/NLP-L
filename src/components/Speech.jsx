import axios from 'axios';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'


const App = () => {

    const startListening = () => SpeechRecognition.startListening({ continuous: true });
    const { transcript, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();

    if (!browserSupportsSpeechRecognition) {
        return null
    }

    const submitTranscript = async () => {
        // console.log(transcript)
        const postData = { transcript };
        await axios.post('http://localhost:4000/process-transcription', postData)
        .then(response => {
            console.log('Voice Data Submitted Sucessfully', response);
        })
        .catch(error => {
            console.error('Error posting data:', error);
        });
    }

    return (
        <>
            <div>
                <h2>Speech to Text Converter</h2>
                <br/>

                <div>
                    <button onClick={startListening}>Start Listening</button>
                    <button onClick={SpeechRecognition.stopListening}>Stop Listening</button>
                    <button onClick={resetTranscript}>Reset</button>
                    <button onClick={submitTranscript}>Submit</button>
                </div>

                <div id='value'>
                    {transcript}
                </div>

            </div>

        </>
    );
};

export default App;