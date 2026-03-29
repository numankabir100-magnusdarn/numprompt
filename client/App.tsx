import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [prompt, setPrompt] = useState('');
  const [refined, setRefined] = useState('');
  const [template, setTemplate] = useState('creative');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  const templates = [
    { id: 'creative', name: '✨ Creative' },
    { id: 'technical', name: '⚙️ Technical' },
    { id: 'professional', name: '💼 Professional' },
    { id: 'scientific', name: '🔬 Scientific' },
    { id: 'business', name: '📊 Business' }
  ];

  const handleRefine = async () => {
    if (!prompt.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch('/.netlify/functions/refine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, template })
      });
      
      const data = await response.json();
      setRefined(data.refined);
      setHistory([{ original: prompt, refined: data.refined, template, time: new Date().toLocaleTimeString() }, ...history.slice(0, 4)]);
    } catch (error) {
      console.error('Error:', error);
      setRefined('Error refining prompt. Check console.');
    }
    setLoading(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(refined);
    alert('Copied to clipboard!');
  };

  return (
    <div className="app">
      <div className="container">
        <h1>🚀 Numprompt</h1>
        <p className="subtitle">Refine your prompts with AI power</p>

        <div className="input-section">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your rough prompt here..."
            className="prompt-input"
          />
          
          <div className="template-selector">
            <label>Choose Template:</label>
            <select value={template} onChange={(e) => setTemplate(e.target.value)} className="select">
              {templates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>

          <button onClick={handleRefine} disabled={loading} className="refine-btn">
            {loading ? '⏳ Refining...' : '✨ Refine Prompt'}
          </button>
        </div>

        {refined && (
          <div className="output-section">
            <h2>✨ Refined Prompt:</h2>
            <div className="refined-text">{refined}</div>
            <button onClick={copyToClipboard} className="copy-btn">📋 Copy</button>
          </div>
        )}

        {history.length > 0 && (
          <div className="history-section">
            <h3>📜 Recent:</h3>
            <ul className="history-list">
              {history.map((item, idx) => (
                <li key={idx}>
                  <small>{item.time}</small>
                  <p><strong>{item.template}</strong></p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
