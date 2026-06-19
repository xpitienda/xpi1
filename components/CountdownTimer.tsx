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

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      let target = new Date();

      if (offerType === 'day') {
        // Próxima medianoche
        target.setHours(24, 0, 0, 0);
      } else {
        // Próximo domingo a medianoche
        const dayOfWeek = now.getDay();
        const daysUntilSunday = dayOfWeek === 0 ? 7 : 7 - dayOfWeek;
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
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [offerType]);

  const formatTime = (time: number) => String(time).padStart(2, '0');

  // Si es oferta del día, mostrar solo horas:minutos:segundos
  if (offerType === 'day') {
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
          Termina en:
        </span>
        {[timeLeft.hours, timeLeft.minutes, timeLeft.seconds].map((time, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.15rem' }}>
            <span style={{
              background: '#000',
              color: '#10b981',
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
            {i < 2 && <span style={{ color: '#10b981', fontSize: '0.75rem', fontWeight: 'bold' }}>:</span>}
          </div>
        ))}
      </div>
    );
  }

  // Si es oferta de la semana, mostrar días:horas:minutos:segundos
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
        Termina en:
      </span>
      {[timeLeft.days, timeLeft.hours, timeLeft.minutes, timeLeft.seconds].map((time, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.15rem' }}>
          <span style={{
            background: '#000',
            color: i === 0 ? '#f59e0b' : '#10b981',
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
          {i < 3 && <span style={{ color: '#10b981', fontSize: '0.75rem', fontWeight: 'bold' }}>:</span>}
        </div>
      ))}
    </div>
  );
}