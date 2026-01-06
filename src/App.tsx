import { useState } from 'react';
import './App.css';
import html2canvas from 'html2canvas';

const getDaysInMonth = (year: number, month: number): Date[] => {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  
  const days: Date[] = [];
  
  // Ajustar para que la semana empiece en LUNES (día 1) en lugar de domingo (día 0)
  const firstDayOfWeek = firstDay.getDay();
  const adjustedFirstDay = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
  const prevMonthLastDay = new Date(year, month, 0).getDate();
  
  // Días del mes anterior
  for (let i = adjustedFirstDay - 1; i >= 0; i--) {
    days.push(new Date(year, month - 1, prevMonthLastDay - i));
  }
  
  // Días del mes actual
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(year, month, i));
  }
  
  // Completar solo hasta completar la semana actual
  const lastDayOfWeek = lastDay.getDay();
  const adjustedLastDay = lastDayOfWeek === 0 ? 6 : lastDayOfWeek - 1;
  const daysToAdd = adjustedLastDay === 6 ? 0 : 6 - adjustedLastDay;
  
  for (let i = 1; i <= daysToAdd; i++) {
    days.push(new Date(year, month + 1, i));
  }
  
  return days;
};

const isSameDay = (date1: Date, date2: Date): boolean => {
  return date1.getFullYear() === date2.getFullYear() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getDate() === date2.getDate();
};

function App() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [, setSelectedDate] = useState<Date | null>(null);
  const [favoriteDates, setFavoriteDates] = useState<Set<string>>(new Set());
  
  const days = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());
  const today = new Date();
  const diasSemana = ['LUN', 'MAR', 'MIE', 'JUE', 'VIE', 'SAB', 'DOM'];
  
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

  const cambiarMes = (direccion: number) => {
    setCurrentDate(prev => {
      const nuevaFecha = new Date(prev);
      nuevaFecha.setMonth(prev.getMonth() + direccion);
      return nuevaFecha;
    });
  };

  const descargarImagen = async () => {
    const elemento = document.querySelector('.calendario-descarga');
    if (!elemento) return;
    
    try {
      const canvas = await html2canvas(elemento as HTMLElement, {
        backgroundColor: '#ffffff',
        scale: 3,
        useCORS: true,
        allowTaint: true,
        logging: false,
        width: 800,
        height: 1000
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
    <>
      {/* VISTA WEB - Full screen con fondo */}
      <div className="app">
        <div className="calendario-web">
          <div className="calendario-web__navegacion">
            <button 
              onClick={() => cambiarMes(-1)}
              className="calendario-web__btn-nav"
              aria-label="Mes anterior"
            >
              ←
            </button>
            
            <div className="calendario-web__titulo-fecha">
              <h1 className="calendario-web__mes">
                {meses[currentDate.getMonth()]}
              </h1>
              <h2 className="calendario-web__anio">
                {currentDate.getFullYear()}
              </h2>
            </div>

            <button 
              onClick={() => cambiarMes(1)}
              className="calendario-web__btn-nav"
              aria-label="Mes siguiente"
            >
              →
            </button>
          </div>

          <div className="calendario-web__header">
            {diasSemana.map(dia => (
              <div key={dia} className="calendario-web__dia-semana">
                {dia}
              </div>
            ))}
          </div>

          <div className="calendario-web__grid">
            {days.map((date, index) => {
              const isToday = isSameDay(date, today);
              const inCurrentMonth = isCurrentMonth(date);
              const isFavorite = favoriteDates.has(getDateKey(date));

              return (
                <button
                  key={index}
                  onClick={(e) => {
                    if (inCurrentMonth) {
                      toggleFavorite(date, e);
                      setSelectedDate(date);
                    }
                  }}
                  className={`calendario-web__celda ${!inCurrentMonth ? 'calendario-web__celda--otro-mes' : ''}`}
                >
                  <div className={`calendario-web__numero ${isToday ? 'calendario-web__numero--hoy' : ''} ${isFavorite ? 'calendario-web__numero--favorito' : ''}`}>
                    {date.getDate()}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="calendario-web__footer">
            <p className="calendario-web__descripcion">
              Las fechas que están marcadas están RESERVADAS
            </p>
          </div>
        </div>

        <button 
          onClick={descargarImagen}
          className="btn-descargar"
          aria-label="Descargar calendario"
          title="Descargar imagen"
        >
          📥
        </button>
      </div>

      {/* VISTA PARA DESCARGA - Oculta, solo para captura */}
      <div className="calendario-descarga">
        <div className="calendario-descarga__contenedor">
          <div className="calendario-descarga__titulo">
            <span className="calendario-descarga__mes">{meses[currentDate.getMonth()]}</span>
            <span className="calendario-descarga__anio">{currentDate.getFullYear()}</span>
          </div>

          <div className="calendario-descarga__header">
            {diasSemana.map(dia => (
              <div key={dia} className="calendario-descarga__dia-semana">
                {dia}
              </div>
            ))}
          </div>

          <div className="calendario-descarga__grid">
            {days.map((date, index) => {
              const inCurrentMonth = isCurrentMonth(date);
              const isFavorite = favoriteDates.has(getDateKey(date));

              if (!inCurrentMonth) {
                return <div key={index} className="calendario-descarga__celda--vacia" />;
              }

              return (
                <div key={index} className="calendario-descarga__celda">
                  <div className={`calendario-descarga__numero ${isFavorite ? 'calendario-descarga__numero--favorito' : ''}`}>
                    {date.getDate()}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="calendario-descarga__footer">
            Las fechas que están marcadas estan RESERVADAS
          </div>
        </div>
      </div>
    </>
  );
}

export default App;