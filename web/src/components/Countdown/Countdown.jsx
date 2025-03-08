import { useState } from 'react';
import './Countdown.css';

import moment from "moment";



import { useEffect } from 'react';

export default function Countdown({date}) {


  const calculateTimeLeft = () => {
    const now = moment();
    const duration = moment.duration(date.diff(now)); // Difference

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
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer); // Cleanup on unmount
  }, []);

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