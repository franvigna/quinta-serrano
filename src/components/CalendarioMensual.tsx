import { useState } from 'react';
import { getDaysInMonth, isSameDay } from '../utils/calendar';
import './CalendarioMensual.css';
import html2canvas from 'html2canvas';

interface Props {
  currentDate: Date;
  selectedDate: Date | null;
  onSelectDate: (date: Date) => void;
}

export const CalendarioMensual = ({ 
  currentDate, 
  selectedDate, 
  onSelectDate
}: Props) => {
  const [favoriteDates, setFavoriteDates] = useState<Set<string>>(new Set());
  const days = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());
  const today = new Date();
  const diasSemana = ['DOM','LUN', 'MAR', 'MIE', 'JUE', 'VIE', 'SAB'];
  
  const meses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

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

  const descargarImagen = async () => {
    const elemento = document.querySelector('.calendario-mensual');
    if (!elemento) return;
    
    try {
      const canvas = await html2canvas(elemento as HTMLElement, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false
      });
      
      const link = document.createElement('a');
      const mesNombre = meses[currentDate.getMonth()];
      const anio = currentDate.getFullYear();
      link.download = `Quinta-Serrano-${mesNombre}-${anio}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Error al descargar imagen:', error);
    }
  };

  return (
    <div className="calendario-mensual">
      {/* Título con Mes y Año */}
      <div className="calendario-mensual__titulo-fecha">
        <h1 className="calendario-mensual__mes">
          {meses[currentDate.getMonth()]}
        </h1>
        <h2 className="calendario-mensual__anio">
          {currentDate.getFullYear()}
        </h2>
      </div>

      {/* Días de la semana */}
      <div className="calendario-mensual__header">
        {diasSemana.map(dia => (
          <div key={dia} className="calendario-mensual__dia-semana">
            {dia}
          </div>
        ))}
      </div>

      {/* Contenedor del calendario */}
      <div className="calendario-mensual__contenedor">
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
                  if (inCurrentMonth) {
                    toggleFavorite(date, e);
                    onSelectDate(date);
                  }
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

        {/* Footer dentro del contenedor */}
        <div className="calendario-mensual__footer">
          <p className="calendario-mensual__descripcion">
            Las fechas que están marcadas están RESERVADAS
          </p>
        </div>
      </div>

      {/* Botón flotante para descargar */}
      <button 
        onClick={descargarImagen}
        className="calendario-mensual__btn-descargar"
        aria-label="Descargar calendario"
        title="Descargar imagen"
      >
        📥
      </button>
    </div>
  );
};