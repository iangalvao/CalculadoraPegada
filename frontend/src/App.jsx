import React from 'react';
import { Routes, Route, Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { CalculatorProvider } from './context/CalculatorContext';

/* -------------  LAYOUT (wrapper used by every route) ------------- */
function Layout() {
  const { pathname } = useLocation();
  const showBar = pathname !== '/' && !pathname.startsWith('/results');
  return (
    <div className="flex flex-col h-full">
      <main className="flex-1 flex items-center justify-center p-4">
        <Outlet />
      </main>
      {showBar && <BottomBar />}
    </div>
  );
}

/* -------------  SHARED BOTTOM NAV BAR ------------- */
function BottomBar() {
  const nav = useNavigate();
  const routes = ['', 'state', 'transport', 'appliances', 'food', 'flights', 'results'];
  const idx = routes.indexOf(useLocation().pathname.slice(1));

  return (
    <div className="bg-white text-primary flex justify-between px-4 py-2">
      <button onClick={() => nav(idx <= 1 ? '/' : `/${routes[idx - 1]}`)}>VOLTAR</button>
      <button onClick={() => nav(idx >= routes.length - 1 ? '/results' : `/${routes[idx + 1]}`)}>
        {idx >= routes.length - 2 ? 'CONFIRMAR' : 'PULAR'}
      </button>
    </div>
  );
}

const Intro          = React.lazy(() => import('./pages/Intro'));
const StateSelect    = React.lazy(() => import('./pages/StateSelect'));
/* -------------  APP ROUTES ------------- */
export default function App() {
  return (
    <CalculatorProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Intro />} />
          <Route path="state"      element={<StateSelect />}   />
          <Route path="transport"  element={<TransportScan />} />
          {/* <Route path="appliances" element={<ApplianceScan />} />
          <Route path="food"       element={<FoodScan />}      />
          <Route path="flights"    element={<AirTravel />}     />
          <Route path="results"    element={<Results />}       />
          <Route path="*" element={<Navigate to="/" replace />} /> */}
        </Route>
      </Routes>
    </CalculatorProvider>
  );
}

/* -------------  LAZY‑LOADED PAGES ------------- */
const TransportScan  = React.lazy(() => import('./pages/TransportScan'));
// const ApplianceScan  = React.lazy(() => import('./pages/ApplianceScan'));
// const FoodScan       = React.lazy(() => import('./pages/FoodScan'));
// const AirTravel      = React.lazy(() => import('./pages/AirTravel'));
// const Results        = React.lazy(() => import('./pages/Results'));
