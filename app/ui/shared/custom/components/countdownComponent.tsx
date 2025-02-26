import { Box, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'

type CountdownComponentProps = {
  title: string;
  endDate: Date; 
}

const CountdownComponent:React.FC<CountdownComponentProps> = (
  { title, endDate }
) => {
  const [timeRemaining, setTimeRemaining] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);

  const calculateTimeRemaining = () => {
    const now = new Date().getTime();
    const target = endDate.getTime();
    const diff = target - now;

    if (diff <= 0) {
      return null;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds };
  };

  useEffect(() => {
    const updateCountdown = () => {
      const timeLeft = calculateTimeRemaining();
      setTimeRemaining(timeLeft);
    };

    updateCountdown(); // Initialize countdown
    const intervalId = setInterval(updateCountdown, 1000); // Update every second

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [endDate]);

  if (!timeRemaining) {
    return <div>Time`&apos;`s up!</div>
  }

  const { days, hours, minutes, seconds } = timeRemaining;

  return (
    <Box component={'div'} 
      sx={{ 
        gap: 2,
        padding: 2,
        margin: 2,
        borderRadius: 5,
        boxShadow: 1,
        backgroundColor: 'white',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Typography variant="h6" component="h4" fontWeight={700} fontSize={18}>
        {title}
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>    
        <CountdownBoxComponent value={days.toString()} text='Días' />
        <CountdownBoxComponent value={hours.toString()} text='Horas' />
        <CountdownBoxComponent value={minutes.toString()} text='Minutos' />
        <CountdownBoxComponent value={seconds.toString()} text='Segundos' />
      </Box>
    </Box>
  );
};

export default CountdownComponent


type CountdownBoxComponentProps = {
  value: string;
  text: string;
};

const CountdownBoxComponent: React.FC<CountdownBoxComponentProps> = ({ value, text }) => {
  return (
    <Box
        sx={{
          width: '100%',
          backgroundColor: '#8BDCA7',
          borderRadius: 5,
          padding: 2,
        }}
      >
          <Typography textAlign={'center'} variant="body1" component="p" fontWeight={800} fontSize={{xs: 20, md: 26}} color='white'>
            {value}
          </Typography>
          <Typography textAlign={'center'} variant="body1" component="p" fontWeight={800} fontSize={{xs: 12, md: 16}} color='white'>
            {text}
          </Typography>
      </Box>
  );
}