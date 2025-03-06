import React, { useRef, useState } from 'react';

function VideoPlayer({ src, teamName }) {
    const videoRef = useRef(null);
    const [duration, setDuration] = useState(null);
    // phase 表示当前点击次数：0 表示还未播放；1 播放完第一段；2 播放完第二段；3 播放完最终段
    const [phase, setPhase] = useState(0);
    const [targetTime, setTargetTime] = useState(0);
    const [isDone, setIsDone] = useState(false);

    // 获取视频总时长
    const handleLoadedMetadata = () => {
        if (videoRef.current) {
            setDuration(videoRef.current.duration);
        }
    };

    // 点击按钮控制播放区间
    const handleButtonClick = () => {
        if (!duration) return;
        if (isDone) return; // 播放完毕后不再操作

        let newPhase = phase + 1;
        let newTargetTime = 0;
        if (newPhase === 1) {
            // 第一次点击：播放前1/4
            newTargetTime = duration / 4;
        } else if (newPhase === 2) {
            // 第二次点击：播放下1/4（即前半部分）
            newTargetTime = duration / 2;
        } else if (newPhase === 3) {
            // 第三次点击：播放剩余部分直到结束
            newTargetTime = duration;
        } else {
            return;
        }
        setPhase(newPhase);
        setTargetTime(newTargetTime);
        videoRef.current.play();
    };

    // 监听播放进度，一旦达到目标时间就暂停，
    // 如果是最终播放（phase===3），则标记为完成
    const handleTimeUpdate = () => {
        if (videoRef.current && videoRef.current.currentTime >= targetTime) {
            videoRef.current.pause();
            if (phase === 3) {
                setIsDone(true);
            }
        }
    };

    // 禁止点击视频手动播放
    const handleVideoClick = (e) => {
        e.preventDefault();
    };

    const buttonText = isDone
        ? "Done"
        : phase < 2
            ? "Next Progress"
            : "Final Progress";

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
            textAlign: 'center'
        }}>
            {/* 在视频上方显示团队名称 */}
            <div style={{ marginBottom: '10px', fontWeight: 'bold', fontSize: '18px' }}>
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
                style={{ borderRadius: '8px' }}
            />
            <br />
            <button onClick={handleButtonClick} style={buttonStyle} disabled={isDone}>
                {buttonText}
            </button>
        </div>
    );
}

function App() {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh'
        }}>
            <VideoPlayer src="1.mp4" teamName="Team1" />
            <VideoPlayer src="1.mp4" teamName="Team2" />
            <VideoPlayer src="1.mp4" teamName="Team3" />
        </div>
    );
}

export default App;