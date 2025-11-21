import React, { useState } from 'react';
import { FaPaperPlane, FaPhone, FaEnvelope, FaMapMarkerAlt, FaCar, FaUser, FaInfoCircle, FaTools } from 'react-icons/fa';
import '../styles/Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    carMake: '',
    carModel: '',
    carYear: '',
    partName: '',
    partNumber: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ success: null, message: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('http://localhost:5001/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setSubmitStatus({ 
          success: true, 
          message: 'Your request has been sent successfully! We will contact you soon.' 
        });
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          carMake: '',
          carModel: '',
          carYear: '',
          partName: '',
          partNumber: '',
          message: ''
        });
      } else {
        throw new Error(data.message || 'Something went wrong');
      }
    } catch (error) {
      console.error('Error:', error);
      setSubmitStatus({ 
        success: false, 
        message: error.message || 'Failed to send request. Please try again later.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-page">
      <section className="contact-hero">
        <div className="container">
          <h1>Need a Car Part?</h1>
          <p>Fill out the form below and we'll help you find the exact part you need.</p>
        </div>
      </section>

      <div className="contact-container">
        <div className="contact-info">
          <h2>Get In Touch</h2>
          <p>Have questions about car parts or need assistance? Our team is here to help you find the right parts for your vehicle.</p>
          
          <div className="info-item">
            <div className="info-icon">
              <FaPhone />
            </div>
            <div>
              <h3>Phone</h3>
              <p>+91 98765 43210</p>
            </div>
          </div>
          
          <div className="info-item">
            <div className="info-icon">
              <FaEnvelope />
            </div>
            <div>
              <h3>Email</h3>
              <p>info@carfixparts.com</p>
            </div>
          </div>
          
          <div className="info-item">
            <div className="info-icon">
              <FaMapMarkerAlt />
            </div>
            <div>
              <h3>Address</h3>
              <p>123 Auto Nagar, Near Highway,<br />Mumbai, Maharashtra 400001</p>
            </div>
          </div>
          
          <div className="business-hours">
            <h3>Business Hours</h3>
            <p>Monday - Friday: 9:00 AM - 8:00 PM</p>
            <p>Saturday: 10:00 AM - 6:00 PM</p>
            <p>Sunday: Closed</p>
          </div>
        </div>

        <div className="contact-form-container">
          <h2>Request a Part</h2>
          
          {submitStatus.message && (
            <div className={`alert ${submitStatus.success ? 'alert-success' : 'alert-error'}`}>
              {submitStatus.message}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-group">
              <label htmlFor="name">
                <FaUser className="input-icon" /> Full Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter your full name"
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email">
                  <FaEnvelope className="input-icon" /> Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="your@email.com"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="phone">
                  <FaPhone className="input-icon" /> Phone *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>
            
            <div className="form-section">
              <h3><FaCar /> Vehicle Information</h3>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="carMake">Make *</label>
                  <input
                    type="text"
                    id="carMake"
                    name="carMake"
                    value={formData.carMake}
                    onChange={handleChange}
                    required
                    placeholder="e.g., Maruti, Hyundai"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="carModel">Model *</label>
                  <input
                    type="text"
                    id="carModel"
                    name="carModel"
                    value={formData.carModel}
                    onChange={handleChange}
                    required
                    placeholder="e.g., Swift, i20"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="carYear">Year *</label>
                  <input
                    type="number"
                    id="carYear"
                    name="carYear"
                    min="1980"
                    max={new Date().getFullYear() + 1}
                    value={formData.carYear}
                    onChange={handleChange}
                    required
                    placeholder="e.g., 2020"
                  />
                </div>
              </div>
            </div>
            
            <div className="form-section">
              <h3><FaTools /> Part Information</h3>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="partName">Part Name *</label>
                  <input
                    type="text"
                    id="partName"
                    name="partName"
                    value={formData.partName}
                    onChange={handleChange}
                    required
                    placeholder="e.g., Brake Pads, Alternator"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="partNumber">Part Number (if known)</label>
                  <input
                    type="text"
                    id="partNumber"
                    name="partNumber"
                    value={formData.partNumber}
                    onChange={handleChange}
                    placeholder="e.g., BP12345"
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="message">
                  <FaInfoCircle className="input-icon" /> Additional Details
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows="4"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Please provide any additional details about the part you need..."
                ></textarea>
              </div>
              
              <div className="form-note">
                <p><span>*</span> Required fields</p>
              </div>
              
              <button 
                type="submit" 
                className="submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : (
                  <>
                    <FaPaperPlane /> Send Request
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
