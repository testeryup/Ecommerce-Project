import React, { useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Layout = ({ children }) => {
  useEffect(() => {
    // Force light mode - extra safety measure
    document.documentElement.classList.remove('dark');
    document.body.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Header />
      <main> {/* Add padding top to account for fixed header if needed */}
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
