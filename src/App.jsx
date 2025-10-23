import { useState, useCallback } from 'react';
import Tesseract from 'tesseract.js';
import './App.css';

export default function App() {
  const [text, setText] = useState('');
  const [processing, setProcessing] = useState(false);

  const processImage = useCallback((file) => {
    if (!file) return;
    setProcessing(true);
    setText('Processing...');
    Tesseract.recognize(file, 'eng')
      .then(({ data: { text } }) => setText(text))
      .catch(err => setText('Error: ' + err.message))
      .finally(() => setProcessing(false));
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    if (e.dataTransfer.files.length) processImage(e.dataTransfer.files[0]);
  }, [processImage]);

  const handlePaste = useCallback((e) => {
    const items = e.clipboardData.items;
    for (let item of items) {
      if (item.type.indexOf('image') !== -1) {
        processImage(item.getAsFile());
        break;
      }
    }
  }, [processImage]);

  return (
    <div
      onPaste={handlePaste}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem' }}
    >
      <h1>Image to Text</h1>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => processImage(e.target.files[0])}
        style={{ margin: '1rem' }}
      />

      <div
        style={{
          width: '80%',
          maxWidth: '600px',
          border: '2px dashed gray',
          borderRadius: '10px',
          padding: '2rem',
          color: 'gray',
          textAlign: 'center',
        }}
      >
        Drop or paste image here
      </div>

      <div
        style={{
          marginTop: '1rem',
          width: '90vw',
          maxWidth: '800px',
          border: '1px solid #ccc',
          borderRadius: '5px',
          padding: '2rem',
          minHeight: '300px',
          whiteSpace: 'pre-wrap',
          textAlign: 'left',
          fontSize: '1.1rem',
          backgroundColor: '#fafafa',
        }}
      >
        {processing ? 'Processing...' : text || 'Text will appear here'}
      </div>
    </div>
  );
}
