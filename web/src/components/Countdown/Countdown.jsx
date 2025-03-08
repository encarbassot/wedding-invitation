import { useState, useEffect } from 'react';
import './Countdown.css';
import moment from "moment";

export default function Countdown({ date }) {
  const calculateTimeLeft = () => {
    const now = moment();
    const duration = moment.duration(date.diff(now)); // Difference

    if (duration.asSeconds() <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 }; // Stop at zero
    }

    return {
      days: Math.floor(duration.asDays()),
      hours: duration.hours(),
      minutes: duration.minutes(),
      seconds: duration.seconds(),
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);

      if (
        newTimeLeft.days === 0 &&
        newTimeLeft.hours === 0 &&
        newTimeLeft.minutes === 0 &&
        newTimeLeft.seconds === 0
      ) {
        clearInterval(timer); // Stop countdown when it reaches zero
      }
    }, 1000);

    return () => clearInterval(timer); // Cleanup on unmount
  }, [date]);

  return (
    <div className='Countdown'>
      <article>
        <h2>{timeLeft.days}</h2>
        <h3>dies</h3>
      </article>

      <article>
        <h2>{timeLeft.hours}</h2>
        <h3>hores</h3>
      </article>

      <article>
        <h2>{timeLeft.minutes}</h2>
        <h3>minuts</h3>
      </article>

      <article>
        <h2>{timeLeft.seconds}</h2>
        <h3>segons</h3>
      </article>
    </div>
  );
}
