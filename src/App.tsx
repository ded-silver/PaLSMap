import React, { useState } from 'react';
import './App.css';
import { Header, Main, Sidebar } from './components/layouts';

function App() {
  const [isSidebarOpen, setSidebarOpen] = useState<boolean>(false);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };
  return (
    <div>
      <Header toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={isSidebarOpen} />
      <Main />
    </div>
  );
}

export default App;
