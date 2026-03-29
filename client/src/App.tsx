import React, { useState } from 'react';
import './App.css';

interface HistoryItem {
  original: string;
  refined: string;
  template: string;
  time: string;
}

const App: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [refined, setRefined] = useState('');
  const [template, setTemplate] = useState('creative');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const [showHistory, setShowHistory] = useState(false);

  const templates = [
    { id: 'creative', icon: '✨', label: 'Creative' },
    { id: 'technical', icon: '⚙️', label: 'Technical' },
    { id: 'professional', icon: '💼', label: 'Professional' },
    { id: 'scientific', icon: '🔬', label: 'Scientific' },
    { id: 'business', icon: '📊', label: 'Business' }
  ];

  const handleRefine = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError('');
    setRefined('');

    try {
      const response = await fetch('/api/refine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, template })
      });

      if (!response.ok) throw new Error(`Error ${response.status}`);
      const data = await response.json();
      if (data.error) throw new Error(data.error);

      setRefined(data.refined);
      setHistory(prev => [
        { original: prompt, refined: data.refined, template, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
        ...prev.slice(0, 9)
      ]);
    } catch (err: any) {
      setError(err.message || 'Failed to refine.');
    }
    setLoading(false);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(refined);
    } catch {
      const t = document.createElement('textarea');
      t.value = refined;
      document.body.appendChild(t);
      t.select();
      document.execCommand('copy');
      document.body.removeChild(t);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleRefine();
  };

  return (
    <div className="widget">
      {/* Header */}
      <div className="header">
        <span className="title">🚀 NumPrompt</span>
        {history.length > 0 && (
          <button className="history-toggle" onClick={() => setShowHistory(!showHistory)}>
            📜 {history.length}
          </button>
        )}
      </div>

      {/* Template pills */}
      <div className="pills">
        {templates.map(t => (
          <button
            key={t.id}
            className={`pill ${template === t.id ? 'active' : ''}`}
            onClick={() => setTemplate(t.id)}
            title={t.label}
          >
            {t.icon}
          </button>
        ))}
      </div>

      {/* Input */}
      <textarea
        id="prompt-input"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Your rough prompt... (Ctrl+Enter)"
        className="input"
        rows={3}
      />

      {/* Refine button */}
      <button
        id="refine-button"
        onClick={handleRefine}
        disabled={loading || !prompt.trim()}
        className="refine-btn"
      >
        {loading ? <><span className="spinner" /> Refining...</> : '✨ Refine'}
      </button>

      {/* Error */}
      {error && <div className="error">⚠️ {error}</div>}

      {/* Output */}
      {refined && (
        <div className="output">
          <div className="output-bar">
            <span className="output-label">Refined</span>
            <button className="copy-btn" onClick={copyToClipboard}>
              {copied ? '✅' : '📋'}
            </button>
          </div>
          <div className="output-text">{refined}</div>
        </div>
      )}

      {/* History drawer */}
      {showHistory && (
        <div className="history">
          <div className="history-title">Recent</div>
          {history.map((item, idx) => (
            <div
              key={idx}
              className="history-item"
              onClick={() => { setPrompt(item.original); setTemplate(item.template); setShowHistory(false); }}
            >
              <span className="history-time">{item.time}</span>
              <span className="history-text">
                {item.original.length > 50 ? item.original.substring(0, 50) + '…' : item.original}
              </span>
            </div>
          ))}
        </div>
      )}

      <div className="footer">Powered by Groq AI</div>
    </div>
  );
};

export default App;
