import React, { useState, useEffect } from 'react';
import './Clock.css';

interface ClockProps {
    format?: 'time' | 'datetime';
    className?: string;
}

export const Clock: React.FC<ClockProps> = ({
                                                format = 'time',
                                                className = ''
                                            }) => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const formattedTime = time.toLocaleTimeString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit',
        ...(format === 'datetime' && {
            day: '2-digit',
            month: '2-digit'
        })
    });

    return (
        <div className={`clock ${className}`}>
            <span className="clock-icon">🕐</span>
            <span className="clock-time">{formattedTime}</span>
        </div>
    );
};

export type { ClockProps };