import { useState, useEffect } from 'react'
import './App.css'
import TypingTest from './components/TypingTest'
import Keyboard from './components/Keyboard'

interface TestStats {
  wpm: number;
  accuracy: number;
  errors: number;
}

function App() {
  const [activeView, setActiveView] = useState<'keyboard' | 'basic' | 'advanced' | 'custom'>('keyboard');
  const [testConfig, setTestConfig] = useState({ type: 'basic', duration: 60 });
  const [titleText, setTitleText] = useState('');

  useEffect(() => {
    const text = 'TYPEFEST';
    let currentIndex = 0;
    let isDeleting = false;
    let typingSpeed = 150;

    const typeText = () => {
      if (isDeleting) {
        setTitleText(text.substring(0, currentIndex - 1));
        currentIndex--;
        typingSpeed = 50;
      } else {
        setTitleText(text.substring(0, currentIndex + 1));
        currentIndex++;
        typingSpeed = 150;
      }

      if (!isDeleting && currentIndex === text.length) {
        typingSpeed = 2000;
        isDeleting = true;
      } else if (isDeleting && currentIndex === 0) {
        isDeleting = false;
        typingSpeed = 500;
      }

      setTimeout(typeText, typingSpeed);
    };

    typeText();
  }, []);

  const handleTestComplete = (stats: TestStats) => {
    console.log('Test completed:', stats);
  };

  const renderContent = () => {
    switch (activeView) {
      case 'keyboard':
        return (
          <div className="keyboard-animation">
            <h2>Welcome to TypeFest</h2>
            <p>Select a test mode to begin typing!</p>
            <Keyboard />
          </div>
        );
      
      case 'basic':
        return (
          <div className="test-area">
            <h2>BASIC TYPING TEST</h2>
            <TypingTest 
              duration={60} 
              onComplete={handleTestComplete}
              difficulty="basic"
            />
          </div>
        );
      
      case 'advanced':
        return (
          <div className="test-area">
            <h2>ADVANCED TYPING TEST</h2>
            <TypingTest 
              duration={60} 
              onComplete={handleTestComplete}
              difficulty="advanced"
            />
          </div>
        );
      
      case 'custom':
        return (
          <div className="test-area">
            <h2>CUSTOM TYPING TEST</h2>
            <div className="test-config">
              <div className="config-option">
                <label>Test Type:</label>
                <select 
                  value={testConfig.type}
                  onChange={(e) => setTestConfig(prev => ({...prev, type: e.target.value as 'basic' | 'advanced'}))}
                >
                  <option value="basic">Basic</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
              <div className="config-option">
                <label>Duration:</label>
                <select 
                  value={testConfig.duration}
                  onChange={(e) => setTestConfig(prev => ({...prev, duration: Number(e.target.value)}))}
                >
                  <option value={30}>30 Seconds</option>
                  <option value={60}>1 Minute</option>
                  <option value={120}>2 Minutes</option>
                </select>
              </div>
            </div>
            <TypingTest 
              duration={testConfig.duration} 
              onComplete={handleTestComplete}
              difficulty={testConfig.type as 'basic' | 'advanced'}
            />
          </div>
        );
    }
  };

  return (
    <div className="app-container">
      <div className="sidebar">
        <h2 className="typing-title">{titleText}</h2>
        <nav>
          <button 
            className={activeView === 'keyboard' ? 'active' : ''} 
            onClick={() => setActiveView('keyboard')}
          >
            HOME
          </button>
          <button 
            className={activeView === 'basic' ? 'active' : ''} 
            onClick={() => setActiveView('basic')}
          >
            BASIC TYPING TEST
          </button>
          <button 
            className={activeView === 'advanced' ? 'active' : ''} 
            onClick={() => setActiveView('advanced')}
          >
            ADVANCED TYPING TEST
          </button>
          <button 
            className={activeView === 'custom' ? 'active' : ''} 
            onClick={() => setActiveView('custom')}
          >
            CUSTOM TYPING TEST
          </button>
        </nav>
      </div>
      <div className="main-content">
        {renderContent()}
      </div>
    </div>
  )
}

export default App
