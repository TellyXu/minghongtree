import React, { useRef, useState } from 'react';
import SakuraCanvas from './SakuraCanvas';

function VideoPlayer({ src, teamName, resetTrigger }) {
    const videoRef = useRef(null);
    const [duration, setDuration] = useState(null);
    const [phase, setPhase] = useState(0);
    const [targetTime, setTargetTime] = useState(0);
    const [isDone, setIsDone] = useState(false);

    React.useEffect(() => {
        if (resetTrigger) {
            setPhase(0);
            setTargetTime(0);
            setIsDone(false);
            if (videoRef.current) {
                videoRef.current.currentTime = 0;
                videoRef.current.pause();
            }
        }
    }, [resetTrigger]);

    const handleLoadedMetadata = () => {
        if (videoRef.current) {
            setDuration(videoRef.current.duration);
        }
    };

    const handleButtonClick = () => {
        if (!duration) return;
        if (isDone) return;

        let newPhase = phase + 1;
        let newTargetTime = 0;
        if (newPhase === 1) {
            newTargetTime = duration / 4;
        } else if (newPhase === 2) {
            newTargetTime = duration / 2;
        } else if (newPhase === 3) {
            newTargetTime = duration;
        } else {
            return;
        }
        setPhase(newPhase);
        setTargetTime(newTargetTime);
        videoRef.current.play();
    };

    const handleTimeUpdate = () => {
        if (videoRef.current && videoRef.current.currentTime >= targetTime) {
            videoRef.current.pause();
            if (phase === 3) {
                setIsDone(true);
            }
        }
    };

    const handleVideoClick = (e) => {
        e.preventDefault();
    };

    const buttonText = isDone
        ? "Blossom!"
        : phase < 2
            ? "Bloom"
            : "Bloom";

    const buttonStyle = {
        marginTop: '10px',
        padding: '8px 16px',
        border: 'none',
        borderRadius: '4px',
        background: isDone ? 'gray' : '#007bff',
        color: '#fff',
        cursor: isDone ? 'default' : 'pointer'
    };

    return (
        <div style={{
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            padding: '10px',
            margin: '10px',
            width: '340px',
            textAlign: 'center',
            position: 'relative'
        }}>
            {/* 改进的团队名称标题样式 */}
            <div style={{
                position: 'absolute',
                top: '-15px',
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: '#f8f9fa',
                padding: '5px 15px',
                borderRadius: '20px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                fontWeight: 'bold',
                fontSize: '16px',
                color: '#2c3e50',
                zIndex: 1,
                border: '1px solid #e9ecef'
            }}>
                {teamName}
            </div>
            <video
                ref={videoRef}
                src={src}
                onLoadedMetadata={handleLoadedMetadata}
                onTimeUpdate={handleTimeUpdate}
                onClick={handleVideoClick}
                width="320"
                height="240"
                style={{ borderRadius: '8px', marginTop: '15px' }}
            />
            <br />
            <button onClick={handleButtonClick} style={buttonStyle} disabled={isDone}>
                {buttonText}
            </button>
        </div>
    );
}

function App() {
    const [resetCounter, setResetCounter] = useState(0);

    const handleResetAll = () => {
        setResetCounter(prev => prev + 1);
    };

    const resetButtonStyle = {
        padding: '10px 20px',
        margin: '20px',
        backgroundColor: '#e74c3c',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontWeight: 'bold'
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh'
        }}>
            <SakuraCanvas />
            <div style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <VideoPlayer src="1.mp4" teamName="Team1" resetTrigger={resetCounter} />
                <VideoPlayer src="1.mp4" teamName="Team2" resetTrigger={resetCounter} />
                <VideoPlayer src="1.mp4" teamName="Team3" resetTrigger={resetCounter} />
            </div>
            <button onClick={handleResetAll} style={resetButtonStyle}>
                Reset All
            </button>
        </div>
    );
}

export default App;