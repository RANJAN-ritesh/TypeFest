import React, { useState, useEffect, useRef } from 'react';

const Keyboard: React.FC = () => {
  const [activeKeys, setActiveKeys] = useState<Set<string>>(new Set());
  const [floatingLetters, setFloatingLetters] = useState<Array<{id: number, key: string, x: number, y: number}>>([]);
  const keyboardRef = useRef<HTMLDivElement>(null);

  const getRandomKey = () => {
    const allKeys = [
      'Esc', 'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12',
      '`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace',
      'Tab', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '[', ']', '\\',
      'Caps', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';', "'", 'Enter',
      'Shift', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '/', 'Shift',
      'Ctrl', 'Fn', 'Cmd', 'Alt', 'Space', 'Alt', 'Cmd', 'Ctrl'
    ];
    return allKeys[Math.floor(Math.random() * allKeys.length)];
  };

  const createFloatingLetter = (key: string, x: number, y: number) => {
    const id = Date.now();
    setFloatingLetters(prev => [...prev, { id, key, x, y }]);
    setTimeout(() => {
      setFloatingLetters(prev => prev.filter(letter => letter.id !== id));
    }, 2500);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const randomKey = getRandomKey();
      setActiveKeys(prev => {
        const newSet = new Set(prev);
        newSet.add(randomKey);
        return newSet;
      });

      // Get key element position
      const keyElement = document.querySelector(`.key.${randomKey.toLowerCase().replace(/\s+/g, '')}`);
      if (keyElement) {
        const rect = keyElement.getBoundingClientRect();
        const keyboardRect = keyboardRef.current?.getBoundingClientRect();
        if (keyboardRect) {
          const x = rect.left - keyboardRect.left + rect.width / 2;
          const y = rect.top - keyboardRect.top;
          createFloatingLetter(randomKey, x, y);
        }
      }

      setTimeout(() => {
        setActiveKeys(prev => {
          const newSet = new Set(prev);
          newSet.delete(randomKey);
          return newSet;
        });
      }, 800);
    }, 400);

    return () => clearInterval(interval);
  }, []);

  const renderKeyboard = () => {
    const keys = [
      // Function keys
      ['Esc', 'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12'],
      // Number row
      ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace'],
      // Q row
      ['Tab', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '[', ']', '\\'],
      // A row
      ['Caps', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';', "'", 'Enter'],
      // Z row
      ['Shift', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '/', 'Shift'],
      // Bottom row
      ['Ctrl', 'Fn', 'Cmd', 'Alt', 'Space', 'Alt', 'Cmd', 'Ctrl']
    ];

    return (
      <div className="keyboard-container" ref={keyboardRef}>
        <div className="keyboard">
          {keys.map((row, rowIndex) => (
            <div key={rowIndex} className="keyboard-row">
              {row.map((key) => {
                const keyClass = key.toLowerCase().replace(/\s+/g, '');
                return (
                  <div 
                    key={key} 
                    className={`key ${keyClass} ${activeKeys.has(key) ? 'active' : ''}`}
                  >
                    {key}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        {floatingLetters.map(({ id, key, x, y }) => (
          <div
            key={id}
            className="floating-letter"
            style={{
              left: `${x}px`,
              top: `${y}px`,
              transform: 'translate(-50%, -50%)'
            }}
          >
            {key}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="keyboard-animation">
      {renderKeyboard()}
    </div>
  );
};

export default Keyboard; 