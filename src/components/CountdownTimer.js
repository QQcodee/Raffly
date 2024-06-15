import React, { useState, useEffect } from "react";

//css
import "../css/CountdownTimer.css";

const CountdownTimer = ({ targetDate, fecha, color }) => {
  const calculateTimeLeft = () => {
    const targetDate = new Date(fecha).getTime();
    const difference = +new Date(targetDate) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
      };
    } else {
      timeLeft = {
        days: 0,
        hours: 0,
        minutes: 0,
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 60000); // Update every minute instead of every second

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="countdown-timer" style={{ backgroundColor: color }}>
      <div className="time-section">
        <div className="time">{timeLeft.days}</div>
        <div className="label">Dias</div>
      </div>
      <div className="time-section">
        <div className="time">{timeLeft.hours}</div>
        <div className="label">Hrs</div>
      </div>
      <div className="time-section">
        <div className="time">{timeLeft.minutes}</div>
        <div className="label">Min</div>
      </div>
    </div>
  );
};

export default CountdownTimer;
