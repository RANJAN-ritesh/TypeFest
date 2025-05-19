import React, { useState, useEffect, useRef } from 'react';

interface TypingTestProps {
  duration?: number;
  onComplete?: (stats: TestStats) => void;
  difficulty?: 'basic' | 'advanced';
}

interface TestStats {
  wpm: number;
  accuracy: number;
  errors: number;
}

const TypingTest: React.FC<TypingTestProps> = ({ 
  duration = 60, 
  onComplete,
  difficulty = 'basic'
}) => {
  const [text, setText] = useState<string>('');
  const [typedText, setTypedText] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState<number>(duration);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [wpm, setWpm] = useState<number>(0);
  const [accuracy, setAccuracy] = useState<number>(100);
  const [errors, setErrors] = useState<number>(0);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [showResults, setShowResults] = useState<boolean>(false);
  const textDisplayRef = useRef<HTMLDivElement>(null);

  const basicTexts = [
    `The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs. The rain in Spain stays mainly in the plain. Every good boy deserves fudge. The early bird catches the worm.`,
    `Hello world! This is a simple typing test. Practice makes perfect. Keep typing to improve your speed and accuracy. Consistency is the key to mastery.`,
    `The sun is bright today. Birds are singing in the trees. It's a beautiful day to learn something new. Take a deep breath and enjoy the moment.`,
    `I love to read books. Reading helps me learn new things every day. Stories can take you to magical places. Never stop exploring the world of words.`,
    `My favorite color is blue. The sky is blue and so is the ocean. Blue is calming and peaceful. It reminds me of summer days and clear skies.`,
    `Cats and dogs are popular pets. They make great companions. Pets bring joy and comfort to our lives. Take good care of your furry friends.`,
    `The weather is nice today. Let's go for a walk in the park. Fresh air and sunshine are good for health. Enjoy the beauty of nature around you.`,
    `I enjoy playing games with friends. It's fun to spend time together. Laughter and teamwork make every game better. Cherish these happy moments.`,
  ];

  const advancedTexts = [
    `Programming is the art of telling another human what one wants the computer to do. The best way to predict the future is to implement it yourself. Debugging is twice as hard as writing the code in the first place. Therefore, write code as simply as possible.`,
    `The Internet is not just one thing, it's a collection of things - of numerous communications networks that all speak the same digital language. Security and privacy are essential in the digital age. Always be mindful of your online presence.`,
    `Artificial intelligence is the simulation of human intelligence processes by machines, especially computer systems. Machine learning enables computers to learn from data and improve over time. The possibilities are vast and ever-expanding.`,
    `The only way to do great work is to love what you do. If you haven't found it yet, keep looking. Don't settle. Passion and perseverance are the keys to success in any field.`,
    `Quantum computing represents a fundamental shift in how we process information, leveraging quantum mechanics to perform calculations. This technology could revolutionize industries from cryptography to pharmaceuticals.`,
    `The blockchain revolution has transformed how we think about trust and verification in digital transactions. Decentralized systems offer new opportunities and challenges for innovation.`,
    `Machine learning algorithms can identify patterns in data that humans might miss, leading to breakthrough discoveries. Data-driven decision making is shaping the future of business and science.`,
    `The future of technology lies in the intersection of artificial intelligence, quantum computing, and sustainable energy solutions. Collaboration and creativity will drive the next wave of innovation.`,
  ];

  // Only pick a new article on mount, difficulty change, or restart
  useEffect(() => {
    const texts = difficulty === 'basic' ? basicTexts : advancedTexts;
    setText(texts[Math.floor(Math.random() * texts.length)]);
    setIsActive(false);
    setTimeLeft(duration);
    setTypedText('');
    setCurrentIndex(0);
    setShowResults(false);
    setErrors(0);
    setAccuracy(100);
    setWpm(0);
  }, [difficulty]);

  // If text is empty on first mount, pick an article
  useEffect(() => {
    if (!text) {
      const texts = difficulty === 'basic' ? basicTexts : advancedTexts;
      setText(texts[Math.floor(Math.random() * texts.length)]);
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      endTest();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  useEffect(() => {
    if (isActive) {
      calculateWPM();
      calculateAccuracy();
      if (currentIndex === text.length) {
        endTest();
      }
    }
  }, [typedText, timeLeft, currentIndex, text.length]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (showResults) return;
      if (!isActive) {
        startTest();
      }
      if (e.key === 'Backspace') {
        if (currentIndex > 0) {
          setCurrentIndex(prev => prev - 1);
          setTypedText(prev => prev.slice(0, -1));
        }
      } else if (e.key.length === 1) {
        setCurrentIndex(prev => prev + 1);
        setTypedText(prev => prev + e.key);
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isActive, currentIndex, showResults]);

  const startTest = () => {
    setIsActive(true);
    setTimeLeft(duration);
    setTypedText('');
    setCurrentIndex(0);
    setShowResults(false);
    setErrors(0);
    setAccuracy(100);
    setWpm(0);
  };

  const endTest = () => {
    setIsActive(false);
    calculateFinalStats();
    setShowResults(true);
    const stats: TestStats = {
      wpm,
      accuracy,
      errors
    };
    onComplete?.(stats);
  };

  const calculateWPM = () => {
    // Only count fully correct words
    const originalWords = text.split(/\s+/);
    const typedWords = typedText.trim().split(/\s+/);
    let correctWordCount = 0;
    for (let i = 0; i < typedWords.length; i++) {
      if (originalWords[i] && typedWords[i] === originalWords[i]) {
        correctWordCount++;
      } else {
        break; // Only count up to the first incorrect word
      }
    }
    const minutes = (duration - timeLeft) / 60;
    const currentWpm = Math.round(correctWordCount / (minutes || 1/60));
    setWpm(currentWpm);
  };

  const calculateAccuracy = () => {
    let correct = 0;
    let errorCount = 0;
    typedText.split('').forEach((char, index) => {
      if (char === text[index]) {
        correct++;
      } else {
        errorCount++;
      }
    });
    setErrors(errorCount);
    setAccuracy(typedText.length > 0 ? Math.round((correct / typedText.length) * 100) : 100);
  };

  const calculateFinalStats = () => {
    calculateWPM();
    calculateAccuracy();
  };

  const renderText = () => {
    return text.split('').map((char, index) => {
      let className = '';
      if (index < currentIndex) {
        className = typedText[index] === char ? 'correct' : 'incorrect';
      } else if (index === currentIndex) {
        className = 'current';
      }
      return (
        <span key={index} className={className}>
          {char}
        </span>
      );
    });
  };

  // Water height for timer
  const waterHeight = (timeLeft / duration) * 100;

  // Remove resetTest, and instead use the effect above for restart
  const handleRestart = () => {
    const texts = difficulty === 'basic' ? basicTexts : advancedTexts;
    setText(texts[Math.floor(Math.random() * texts.length)]);
    setIsActive(false);
    setTimeLeft(duration);
    setTypedText('');
    setCurrentIndex(0);
    setShowResults(false);
    setErrors(0);
    setAccuracy(100);
    setWpm(0);
  };

  return (
    <div className="test-glass-card">
      <div className="timer-wpm-group">
        <div className="timer-tap-group">
          {/* Water Tank Timer */}
          <div className="timer-tank">
            <div className="water-tank-bg"></div>
            <div className="water-tank-fill" style={{ height: `${waterHeight}%`, transition: 'height 2.2s cubic-bezier(.77,0,.18,1)' }}></div>
            <div className="timer-tank-text">{timeLeft}s</div>
          </div>
        </div>
        <div className="wpm-glow">{wpm} WPM</div>
        <button 
          className="superb-btn"
          onClick={handleRestart}
        >
          Restart Test
        </button>
      </div>
      {!showResults && (
        <div 
          ref={textDisplayRef}
          className="superb-textbox"
          tabIndex={0}
          onFocus={() => !isActive && startTest()}
        >
          {renderText()}
        </div>
      )}
      {showResults && (
        <div className="results superb-results">
          <h2>Test Results</h2>
          <p>WPM: {wpm}</p>
          <p>Accuracy: {accuracy}%</p>
          <p>Errors: {errors}</p>
          <button className="superb-btn" onClick={handleRestart}>Try Again</button>
        </div>
      )}
    </div>
  );
};

export default TypingTest; 