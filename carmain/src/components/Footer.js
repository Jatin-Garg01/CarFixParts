import React from 'react';
import { Link } from 'react-router-dom';
import { FaCar, FaPhone, FaEnvelope, FaMapMarkerAlt, FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-about">
              <div className="footer-logo">
                <FaCar className="footer-logo-icon" />
                <span>CarFixParts</span>
              </div>
              <p className="footer-about-text">
                Your trusted partner for genuine car parts and exceptional service. 
                We provide high-quality auto parts with fast delivery and excellent 
                customer support.
              </p>
              <div className="footer-social">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                  <FaFacebook />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                  <FaTwitter />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <FaInstagram />
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                  <FaLinkedin />
                </a>
              </div>
            </div>

            <div className="footer-links">
              <h3 className="footer-title">Quick Links</h3>
              <ul className="footer-links-list">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/about">About Us</Link></li>
                <li><Link to="/contact">Contact</Link></li>
                <li><Link to="/privacy-policy">Privacy Policy</Link></li>
                <li><Link to="/terms">Terms of Service</Link></li>
              </ul>
            </div>

            <div className="footer-links">
              <h3 className="footer-title">Our Services</h3>
              <ul className="footer-links-list">
                <li><Link to="/services/parts">Car Parts</Link></li>
                <li><Link to="/services/maintenance">Maintenance</Link></li>
                <li><Link to="/services/accessories">Accessories</Link></li>
                <li><Link to="/services/consultation">Free Consultation</Link></li>
              </ul>
            </div>

            <div className="footer-contact">
              <h3 className="footer-title">Contact Us</h3>
              <ul className="footer-contact-list">
                <li>
                  <FaMapMarkerAlt className="footer-contact-icon" />
                  <span>123 Auto Nagar, Near Highway, Mumbai, Maharashtra 400001</span>
                </li>
                <li>
                  <FaPhone className="footer-contact-icon" />
                  <a href="tel:+919876543210">+91 98765 43210</a>
                </li>
                <li>
                  <FaEnvelope className="footer-contact-icon" />
                  <a href="mailto:info@carfixparts.com">info@carfixparts.com</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <div className="footer-bottom-content">
            <p>&copy; {new Date().getFullYear()} CarFixParts. All rights reserved.</p>
            <div className="footer-payment-methods">
              <span>We accept:</span>
              <div className="payment-icons">
                <span>Visa</span>
                <span>Mastercard</span>
                <span>UPI</span>
                <span>Net Banking</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
