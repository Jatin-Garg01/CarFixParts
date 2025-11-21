import React from 'react';
import { Link } from 'react-router-dom';
import { FaCar, FaTools, FaSearch, FaHeadset } from 'react-icons/fa';
import '../styles/Home.css';

const Home = () => {
  const reviews = [
    {
      id: 1,
      name: 'Rahul Sharma',
      rating: 5,
      comment: 'Great service! Found the exact part I needed for my Honda City at a reasonable price.'
    },
    {
      id: 2,
      name: 'Priya Patel',
      rating: 4,
      comment: 'Quick response time and excellent customer support. Will definitely use again!'
    },
    {
      id: 3,
      name: 'Amit Kumar',
      rating: 5,
      comment: 'Saved me a lot of time and money. Genuine parts with warranty.'
    }
  ];

  const features = [
    {
      icon: <FaSearch className="feature-icon" />,
      title: 'Easy Search',
      description: 'Quickly find the exact car part you need with our advanced search system.'
    },
    {
      icon: <FaTools className="feature-icon" />,
      title: 'Genuine Parts',
      description: 'We provide only genuine and high-quality car parts from trusted manufacturers.'
    },
    {
      icon: <FaCar className="feature-icon" />,
      title: 'All Makes & Models',
      description: 'Parts available for all major car makes and models in the market.'
    },
    {
      icon: <FaHeadset className="feature-icon" />,
      title: '24/7 Support',
      description: 'Our customer support team is always ready to assist you with any queries.'
    }
  ];

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Find Genuine Car Parts Easily</h1>
          <p>Get the right parts for your vehicle with our extensive inventory and expert support.</p>
          <div className="hero-buttons">
            <Link to="/contact" className="btn btn-primary">Request a Part</Link>
            <Link to="/about" className="btn btn-secondary">Learn More</Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2>Why Choose CarFixParts?</h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon-container">
                {feature.icon}
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Submit Request</h3>
            <p>Fill out our simple form with your car details and part requirements.</p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>Get Matched</h3>
            <p>Our system finds the best matching parts from our network of suppliers.</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>Receive Quote</h3>
            <p>Get a competitive quote for the required parts with availability details.</p>
          </div>
          <div className="step">
            <div className="step-number">4</div>
            <h3>Get It Delivered</h3>
            <p>Receive your parts at your doorstep or pick up from a nearby location.</p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials">
        <h2>What Our Customers Say</h2>
        <div className="reviews">
          {reviews.map(review => (
            <div key={review.id} className="review-card">
              <div className="rating">
                {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
              </div>
              <p className="review-comment">"{review.comment}"</p>
              <p className="reviewer">- {review.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta">
        <h2>Need Help Finding a Part?</h2>
        <p>Our experts are ready to assist you in finding the right part for your vehicle.</p>
        <Link to="/contact" className="btn btn-primary">Contact Us Now</Link>
      </section>
    </div>
  );
};

export default Home;
