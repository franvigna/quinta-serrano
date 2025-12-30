import { useState } from 'react';
import { CalendarioMensual } from './components/CalendarioMensual';
import './App.css';

function App() {
  const [currentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  return (
    <div className="app">
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