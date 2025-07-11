import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-16"> {/* Add padding top to account for fixed header if needed */}
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
