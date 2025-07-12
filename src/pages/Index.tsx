import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';

const Index = () => {
  // Redirect to the default salon
  return <Navigate to="/bloom-beauty" replace />;
};

export default Index;
