import { useState } from 'react';
import { CalendarioMensual } from './components/CalendarioMensual';
import './App.css';

function App() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [mostrarSelector, setMostrarSelector] = useState(false);

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

  const cambiarMes = (mes: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(mes);
    setCurrentDate(newDate);
    setMostrarSelector(false);
  };

  const cambiarAnio = (anio: number) => {
    const newDate = new Date(currentDate);
    newDate.setFullYear(anio);
    setCurrentDate(newDate);
    setMostrarSelector(false);
  };

  const anioActual = currentDate.getFullYear();
  const anios = Array.from({ length: 9 }, (_, i) => anioActual - 3 + i);


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

        <div className="app__titulo-container">
          <h1 
            className="app__titulo"
            onClick={() => setMostrarSelector(!mostrarSelector)}
          >
            {meses[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h1>

          {mostrarSelector && (
            <div className="app__selector">
              <div className="app__selector-meses">
                {meses.map((mes, index) => (
                  <button
                    key={mes}
                    onClick={() => cambiarMes(index)}
                    className={`app__selector-btn ${currentDate.getMonth() === index ? 'app__selector-btn--active' : ''}`}
                  >
                    {mes}
                  </button>
                ))}
              </div>
              <div className="app__selector-anios">
                {anios.map(anio => (
                  <button
                    key={anio}
                    onClick={() => cambiarAnio(anio)}
                    className={`app__selector-btn ${currentDate.getFullYear() === anio ? 'app__selector-btn--active' : ''}`}
                  >
                    {anio}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

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