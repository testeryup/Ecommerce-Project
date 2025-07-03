import React from 'react';
import { useParams, useLocation } from 'react-router-dom';

const DebugRouter = () => {
  const params = useParams();
  const location = useLocation();

  return (
    <div className="fixed top-0 left-0 bg-black text-white p-4 z-50">
      <h3>Debug Router</h3>
      <p>Path: {location.pathname}</p>
      <p>Params: {JSON.stringify(params)}</p>
      <p>Search: {location.search}</p>
    </div>
  );
};

export default DebugRouter;
