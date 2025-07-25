import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Navbar } from '@/components/layout/Navbar';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar onBookingClick={() => {}} />
      <main className="flex-grow flex items-center justify-center pt-24">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">404</h1>
          <p className="text-xl text-gray-600 mb-4">Oops! Page not found</p>
          <a href="/" className="text-blue-500 hover:text-blue-700 underline">
            Return to Home
          </a>
        </div>
      </main>
    </div>
  );
};

export default NotFound;
