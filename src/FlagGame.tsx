import React, { useState, useEffect } from 'react';
import { flags as allFlags } from "./data/flags";
import type { Flag } from "./data/flags";

function shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

export default function FlagGame() {
    const [stage, setStage] = useState<'select' | 'play'>('select');
    const [missedFlags, setMissedFlags] = useState<{ code: string; correct: string; guess: string }[]>([]);
    const [selectedFlags, setSelectedFlags] = useState<string[]>(() => {
        const stored = localStorage.getItem('selectedFlags');
        return stored ? JSON.parse(stored) : allFlags.map(flag => flag.code);;
    });
    const [shuffledFlags, setShuffledFlags] = useState<Flag[]>([]);

    useEffect(() => {
        localStorage.setItem('selectedFlags', JSON.stringify(selectedFlags));
    }, [selectedFlags]);

    const [currentIndex, setCurrentIndex] = useState(0);
    const [guess, setGuess] = useState('');
    const [feedback, setFeedback] = useState('');
    const [score, setScore] = useState(0);

    const startGame = () => {
        if (selectedFlags.length === 0) {
            alert('Select at least one flag to begin!');
            return;
        }

        const selectedObjects = allFlags.filter(flag => selectedFlags.includes(flag.code));
        const shuffled = shuffleArray(selectedObjects);

        setShuffledFlags(shuffled);
        setStage('play');
        setCurrentIndex(0);
        setScore(0);
        setGuess('');
        setFeedback('');
        setMissedFlags([]);
    };

    const toggleFlag = (code: string) => {
        setSelectedFlags((prev) =>
            prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]
        );
    };

    const handleSubmit = () => {
        const currentFlag = shuffledFlags[currentIndex];
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
                <div style={{ marginTop: '1.5rem' }}>
                    <button onClick={startGame} style={{ marginRight: '1rem' }}>
                        Start Game
                    </button>
                    <button
                        onClick={() => setSelectedFlags(allFlags.map(flag => flag.code))}
                        style={{ backgroundColor: '#f44336', color: 'white' }}
                    >
                        Clear Progress
                    </button>
                </div>
            </div>
        );
    }

    if (stage === 'play') {
        if (currentIndex >= shuffledFlags.length) {
        return (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
                <h2>Game Over</h2>
                <p>Your score: {score} / {shuffledFlags.length}</p>

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
                    setMissedFlags([]);
                }}>
                    Play Again
                </button>
            </div>
        );
        }

        const currentFlag = shuffledFlags[currentIndex];

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
                <p>Flag {currentIndex + 1} of {shuffledFlags.length}</p>
            </div>
        );
    }

  return null;
}
