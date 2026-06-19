'use client';

import { useState, useEffect } from 'react';

type OfferType = 'day' | 'week';

export default function CountdownTimer({ offerType }: { offerType: OfferType }) {
  const [timeLeft, setTimeLeft] = useState({ 
    days: 0, 
    hours: 0, 
    minutes: 0, 
    seconds: 0 
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const calculateTimeLeft = () => {
        const now = new Date();
        let target = new Date();

        if (offerType === 'day') {
          // Próxima medianoche
          target = new Date(now);
          target.setHours(24, 0, 0, 0);
        } else {
          // Próximo domingo a medianoche
          const dayOfWeek = now.getDay();
          const daysUntilSunday = dayOfWeek === 0 ? 7 : 7 - dayOfWeek;
          target = new Date(now);
          target.setDate(now.getDate() + daysUntilSunday);
          target.setHours(24, 0, 0, 0);
        }

        const difference = target.getTime() - now.getTime();

        if (difference > 0) {
          setTimeLeft({
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / 1000 / 60) % 60),
            seconds: Math.floor((difference / 1000) % 60),
          });
        } else {
          setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        }
      };

      calculateTimeLeft();
      const timer = setInterval(calculateTimeLeft, 1000);
      
      return () => clearInterval(timer);
    } catch (err) {
      console.error('Error en CountdownTimer:', err);
      setError('Error al cargar');
    }
  }, [offerType]);

  const formatTime = (time: number) => String(time).padStart(2, '0');

  if (error) {
    return null;
  }

  const isDayOffer = offerType === 'day';
  const timeUnits = isDayOffer 
    ? [timeLeft.hours, timeLeft.minutes, timeLeft.seconds]
    : [timeLeft.days, timeLeft.hours, timeLeft.minutes, timeLeft.seconds];

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.25rem',
      marginTop: '0.5rem',
      background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
      padding: '0.35rem 0.5rem',
      borderRadius: '0.5rem',
      boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)',
    }}>
      <span style={{ color: '#9ca3af', fontSize: '0.65rem', fontWeight: 'bold', marginRight: '0.25rem' }}>
        {isDayOffer ? 'Termina hoy:' : 'Termina en:'}
      </span>
      {timeUnits.map((time, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.15rem' }}>
          <span style={{
            background: '#000',
            color: (isDayOffer ? '#10b981' : (i === 0 ? '#f59e0b' : '#10b981')),
            padding: '0.15rem 0.3rem',
            borderRadius: '0.25rem',
            fontSize: '0.75rem',
            fontWeight: 'bold',
            fontFamily: 'monospace',
            minWidth: '1.5rem',
            textAlign: 'center',
            boxShadow: '0 1px 2px rgba(0,0,0,0.5)',
          }}>
            {formatTime(time)}
          </span>
          {i < timeUnits.length - 1 && (
            <span style={{ color: '#10b981', fontSize: '0.75rem', fontWeight: 'bold' }}>:</span>
          )}
        </div>
      ))}
    </div>
  );
}