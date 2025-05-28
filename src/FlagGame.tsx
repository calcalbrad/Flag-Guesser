import React, { useState } from 'react';
import type { Flag } from './types';

const allFlags: Flag[] = [
    { code: 'fr', country: 'France' },
    { code: 'de', country: 'Germany' },
    { code: 'bt', country: 'Bhutan' },
    { code: 'sz', country: 'Eswatini' },
    // Add more flags here
];

export default function FlagGame() {
    const [stage, setStage] = useState<'select' | 'play'>('select');
    const [selectedFlags, setSelectedFlags] = useState<string[]>([]);
    const [missedFlags, setMissedFlags] = useState<{ code: string; correct: string; guess: string }[]>([]);

    // Game state — must be outside any if-blocks
    const [currentIndex, setCurrentIndex] = useState(0);
    const [guess, setGuess] = useState('');
    const [feedback, setFeedback] = useState('');
    const [score, setScore] = useState(0);

    const selectedFlagObjects = allFlags.filter(flag =>
        selectedFlags.includes(flag.code)
    );

    const startGame = () => {
        if (selectedFlags.length === 0) {
            alert('Select at least one flag to begin!');
            return;
        }
        setStage('play');
        setCurrentIndex(0);
        setScore(0);
        setGuess('');
        setFeedback('');
    };

    const toggleFlag = (code: string) => {
        setSelectedFlags((prev) =>
            prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]
        );
    };

    const handleSubmit = () => {
        const currentFlag = selectedFlagObjects[currentIndex];
        const normalizedGuess = guess.trim().toLowerCase();
        const normalizedAnswer = currentFlag.country.toLowerCase();

        if (normalizedGuess === normalizedAnswer) {
            setScore(prev => prev + 1);
            setFeedback('✅ Correct!');
        } else {
            setFeedback(`❌ Incorrect. It was ${currentFlag.country}.`);
            setMissedFlags(prev => [...prev, {
                code: currentFlag.code,
                correct: currentFlag.country,
                guess: guess.trim()
            }]);
        }

        setTimeout(() => {
            setFeedback('');
            setGuess('');
            setCurrentIndex(prev => prev + 1);
        }, 1500);
    };

    // Stage 1: Select flags
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
                            src={`/flags/${flag.code}.png`}
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

    // Stage 2: Play game
    if (stage === 'play') {
        if (currentIndex >= selectedFlagObjects.length) {
            return (
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                    <h2>Game Over</h2>
                    <p>Your score: {score} / {selectedFlagObjects.length}</p>
                    
                    {missedFlags.length > 0 && (
                        <div style={{ marginTop: '2rem' }}>
                            <h3>Incorrect Answers</h3>
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                            {missedFlags.map((flag, index) => (
                                <li key={index} style={{ marginBottom: '1rem' }}>
                                <img
                                    src={`/flags/${flag.code}.png`}
                                    alt={flag.correct}
                                    style={{ width: '60px', verticalAlign: 'middle', marginRight: '1rem' }}
                                />
                                <strong>{flag.correct}</strong> (you guessed: <em>{flag.guess || 'blank'}</em>)
                                </li>
                            ))}
                            </ul>
                        </div>
                    )}

                    <button onClick={() => {
                        setStage('select');
                        setSelectedFlags([]);
                        setMissedFlags([]);
                    }}>
                        Play Again
                    </button>
                </div>
            );
        }

        const currentFlag = selectedFlagObjects[currentIndex];

        return (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
                <h2>Guess the Flag</h2>
                <img
                    src={`/flags/${currentFlag.code}.png`}
                    alt="Flag"
                    style={{ width: '200px', height: 'auto', marginBottom: '1rem' }}
                />
                <div>
                    <input
                        type="text"
                        value={guess}
                        onChange={(e) => setGuess(e.target.value)}
                        placeholder="Enter country name"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleSubmit();
                            }
                        }}
                    />
                    <button onClick={handleSubmit}>Submit</button>
                </div>
                <p>{feedback}</p>
                <p>Score: {score}</p>
                <p>Flag {currentIndex + 1} of {selectedFlagObjects.length}</p>
            </div>
        );
    }

    return null;
}
