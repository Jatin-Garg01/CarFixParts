import React from 'react';
import { FaCar, FaTools, FaUsers, FaShieldAlt } from 'react-icons/fa';
import '../styles/About.css';

const About = () => {
  return (
    <div className="about-page">
      <section className="about-hero">
        <div className="container">
          <h1>About CarFixParts</h1>
          <p>Your trusted partner for genuine car parts and exceptional service</p>
        </div>
      </section>

      <section className="about-section">
        <div className="container">
          <div className="about-content">
            <div className="about-text">
              <h2>Our Story</h2>
              <p>
                Founded in 2020, CarFixParts has grown from a small local shop to a leading provider of genuine car parts across India. 
                Our mission is to make car maintenance simple, affordable, and reliable for everyone.
              </p>
              <p>
                We understand the importance of quality when it comes to vehicle maintenance. That's why we source only genuine 
                parts from trusted manufacturers to ensure your vehicle performs at its best.
              </p>
            </div>
            <div className="about-image">
              <img 
                src="https://images.unsplash.com/photo-1551836026-10b9f18a16e2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" 
                alt="Our Workshop" 
              />
            </div>
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="container">
          <h2>Why Choose Us</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <FaCar />
              </div>
              <h3>Wide Selection</h3>
              <p>Extensive inventory of genuine parts for all major car makes and models.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <FaTools />
              </div>
              <h3>Expert Technicians</h3>
              <p>Our team of certified professionals ensures you get the right part every time.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <FaShieldAlt />
              </div>
              <h3>Quality Guarantee</h3>
              <p>All our parts come with a warranty for your peace of mind.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <FaUsers />
              </div>
              <h3>Customer Support</h3>
              <p>24/7 support to assist you with all your car part needs.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mission-section">
        <div className="container">
          <h2>Our Mission</h2>
          <p className="mission-statement">
            To provide high-quality, genuine car parts with exceptional customer service, making car maintenance 
            hassle-free and reliable for every vehicle owner in India.
          </p>
        </div>
      </section>
    </div>
  );
};

export default About;
