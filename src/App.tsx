import React, { useState } from 'react';
import './App.css';
import { Header, Sidebar } from './components/layouts';
import Main from './components/layouts/Main/Main';
import { DnDSidebar } from './components/layouts/DnDSidebar/DnDSidebar';
import { ReactFlowProvider } from '@xyflow/react';
import { DnDProvider } from './hooks/DnDContext';

function App() {
  const [isSidebarOpen, setSidebarOpen] = useState<boolean>(false);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <ReactFlowProvider>
      <div className="app-layout">
        <Header toggleSidebar={toggleSidebar} />
        <div className="content-layout">
          <Sidebar isOpen={isSidebarOpen} />
          <div style={{ flexGrow: 1 }}>
            <Main />
          </div>
        </div>
      </div>
    </ReactFlowProvider>
  );
}

export default App;
