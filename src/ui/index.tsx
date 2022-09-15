import './styles/styles.scss';

import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { Routes, Route, MemoryRouter } from 'react-router-dom';
import Home from './app/Home';
import Detail from './app/Detail';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MemoryRouter>
      <Routes>
        <Route path="" element={<Home />} />
        <Route path="events">
          <Route path=":eventId" element={<Detail />} />
        </Route>
      </Routes>
    </MemoryRouter>
  </React.StrictMode>
);
