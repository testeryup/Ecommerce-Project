import React from 'react';
import Header from './Header';
import HeroSection from './HeroSection';
import ProductGrid from './ProductGrid';
import Footer from './Footer';

export default function HomeStep1() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <HeroSection />
            <ProductGrid />
            <Footer />
        </div>
    );
}
