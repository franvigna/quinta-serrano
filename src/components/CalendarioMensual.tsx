import { useState } from 'react';
import { getDaysInMonth, isSameDay } from '../utils/calendar';
import './CalendarioMensual.css';

interface Props {
  currentDate: Date;
  selectedDate: Date | null;
  onSelectDate: (date: Date) => void;
}

export const CalendarioMensual = ({ currentDate, selectedDate, onSelectDate }: Props) => {
  const [favoriteDates, setFavoriteDates] = useState<Set<string>>(new Set());
  const days = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());
  const today = new Date();
  const diasSemana = ['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB'];

  const isCurrentMonth = (date: Date) => date.getMonth() === currentDate.getMonth();

  const getDateKey = (date: Date) => {
    return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
  };

  const toggleFavorite = (date: Date, e: React.MouseEvent) => {
    e.stopPropagation();
    const key = getDateKey(date);
    setFavoriteDates(prev => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  };

  return (
    <div className="calendario-mensual">
      <div className="calendario-mensual__header">
        {diasSemana.map(dia => (
          <div key={dia} className="calendario-mensual__dia-semana">
            {dia}
          </div>
        ))}
      </div>

      <div className="calendario-mensual__grid">
        {days.map((date, index) => {
          const isToday = isSameDay(date, today);
          const isSelected = selectedDate && isSameDay(date, selectedDate);
          const inCurrentMonth = isCurrentMonth(date);
          const isFavorite = favoriteDates.has(getDateKey(date));

          return (
            <div
              key={index}
              onClick={(e) => {
                toggleFavorite(date, e);
                onSelectDate(date);
              }}
              className={`calendario-mensual__celda ${!inCurrentMonth ? 'calendario-mensual__celda--otro-mes' : ''} ${isSelected ? 'calendario-mensual__celda--selected' : ''}`}
            >
              <div className={`calendario-mensual__numero ${isToday ? 'calendario-mensual__numero--hoy' : ''} ${isFavorite ? 'calendario-mensual__numero--favorito' : ''}`}>
                {date.getDate()}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};