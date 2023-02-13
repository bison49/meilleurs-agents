import { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Home from './Pages/Home';

function App() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 800 ? true : false);

  const handleResize = () => {
    if (window.innerWidth < 800) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  };

  // create an event listener
  useEffect(() => {
    window.addEventListener('resize', handleResize);
  });

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home isMobile={isMobile} />} />
        <Route path="realtors/:idRealtor" element={<Home isMobile={isMobile} />} />
        <Route
          path="realtors/:idRealtor/messages/:idMessage"
          element={<Home isMobile={isMobile} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
