import React, { useState } from 'react';
import type { Flag } from './types';

const allFlags: Flag[] = [
  { code: 'fr', country: 'France' },
  { code: 'de', country: 'Germany' },
  { code: 'bt', country: 'Bhutan' },
  { code: 'sz', country: 'Eswatini' },
  // Add more as needed
];

export default function FlagGame() {
  const [stage, setStage] = useState<'select' | 'play'>('select');
  const [selectedFlags, setSelectedFlags] = useState<string[]>([]);

  const toggleFlag = (code: string) => {
    setSelectedFlags((prev) =>
      prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]
    );
  };

  const startGame = () => {
    if (selectedFlags.length > 0) {
      setStage('play');
    } else {
      alert('Select at least one flag to begin!');
    }
  };

  if (stage === 'select') {
    return (
      <div style={{ padding: '2rem' }}>
        <h2>Select Flags to Practice</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
          gap: '1rem',
          marginTop: '1rem'
        }}>
          {allFlags.map(flag => (
            <div key={flag.code}
                 onClick={() => toggleFlag(flag.code)}
                 style={{
                   border: selectedFlags.includes(flag.code) ? '3px solid green' : '1px solid gray',
                   padding: '0.5rem',
                   textAlign: 'center',
                   cursor: 'pointer'
                 }}>
              <img
                src={`/Flags/${flag.code}.png`}
                alt={flag.country}
                style={{ width: '80px', height: 'auto' }}
              />
              <p>{flag.country}</p>
            </div>
          ))}
        </div>
        <br />
        <button onClick={startGame}>Start Game</button>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <p>Flags selected: {selectedFlags.length}</p>
      <p>Gameplay coming in next step…</p>
    </div>
  );
}