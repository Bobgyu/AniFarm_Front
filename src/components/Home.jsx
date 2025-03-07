import React, { useState } from 'react';
import Test6 from './test/Test6';
import Test7 from './test/Test7';

const Home = () => {
  const [currentView, setCurrentView] = useState('test6');

  const handleTest6Timeout = () => {
    setCurrentView('test7');
  };

  const handleTest7Timeout = () => {
    setCurrentView('home');
  };

  return (
    <div>
      {currentView === 'test6' && <Test6 onTimeout={handleTest6Timeout} />}
      {currentView === 'test7' && <Test7 onTimeout={handleTest7Timeout} />}
      {currentView === 'home' && <div>Home</div>}
    </div>
  );
};

export default Home;
