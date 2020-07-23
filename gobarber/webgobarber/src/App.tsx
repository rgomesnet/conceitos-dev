import React from 'react';
import Globalstyle from './styles/global';
import AppProvider from './hooks/';
import Routes from './routes';
import { BrowserRouter } from 'react-router-dom';

const App: React.FC = () => (
    <BrowserRouter>
        <AppProvider>
            <Routes />
        </AppProvider>
        <Globalstyle />
    </BrowserRouter>
);

export default App;
