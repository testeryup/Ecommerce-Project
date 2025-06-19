import React from 'react';
import Header from './Header';
import HeroSection from './HeroSection';
import ProductGrid from './ProductGrid';
import Footer from './Footer';

const Home = () => {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
            <Header />
            <HeroSection />
            <ProductGrid />
            <Footer />
        </div>
    );
};

export default Home;