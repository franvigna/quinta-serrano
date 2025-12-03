import { useState } from 'react';
import { CalendarioMensual } from './components/CalendarioMensual';
import './App.css';

function App() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const meses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const mesAnterior = () => {
    const newDate = new Date(currentDate);
     newDate.setMonth(newDate.getMonth() - 1);
    
    setCurrentDate(newDate);
  };

  const mesSiguiente = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setCurrentDate(newDate);
  };

  const irHoy = () => {
    setCurrentDate(new Date());
  };

  return (
    <div className="app">
      <div className="app__header">
        <button onClick={irHoy} className="app__btn-hoy">
          Hoy
        </button>

        <div className="app__navegacion">
          <button onClick={mesAnterior} className="app__btn-nav">
            ‹
          </button>
          <button onClick={mesSiguiente} className="app__btn-nav">
            ›
          </button>
        </div>

        <h1 className="app__titulo">
          {meses[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h1>

        <div className="app__spacer"></div>

      </div>

      <div className="app__calendario">
          <CalendarioMensual 
            currentDate={currentDate}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
          />

      </div>
    </div>
  );
}

export default App;