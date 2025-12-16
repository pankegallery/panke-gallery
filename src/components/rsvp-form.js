import React, { useState } from 'react';

const RsvpForm = ({ eventId, eventTitle, capacity, slug }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    comment: '',
    honeypot: '' // Anti-spam field
  });
  
  const [status, setStatus] = useState('idle'); // idle, submitting, success, error
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    try {
      const response = await fetch('/.netlify/functions/rsvp-submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          comment: formData.comment,
          eventId: eventId,
          eventTitle: eventTitle,
          capacity: capacity,
          honeypot: formData.honeypot
        })
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setFormData({
          name: '',
          email: '',
          comment: '',
          honeypot: ''
        });
      } else {
        setStatus('error');
        setErrorMessage(data.error || 'Failed to submit registration');
      }
    } catch (error) {
      setStatus('error');
      setErrorMessage('Network error. Please try again.');
      console.error('RSVP submission error:', error);
    }
  };

  if (status === 'success') {
    return (
      <div className="rsvp-success">
        <h3>Registration Successful!</h3>
        <p>Thank you for registering for this event. We’ve saved your request and will be in touch if anything changes.</p>
      </div>
    );
  }

  return (
    <div className="rsvp-form-container">
      <p>As capacity is limited, we kindly ask you to register for this event.</p>
      <form onSubmit={handleSubmit} className="rsvp-form">
        <div className="form-group">
          <label htmlFor="name">
            Name <span className="required">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            disabled={status === 'submitting'}
            placeholder="Your name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">
            Email <span className="required">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={status === 'submitting'}
            placeholder="your.email@example.com"
          />
        </div>

        <div className="form-group">
          <label htmlFor="comment">
            Comment (optional)
          </label>
          <textarea
            id="comment"
            name="comment"
            value={formData.comment}
            onChange={handleChange}
            disabled={status === 'submitting'}
            placeholder="Any additional information..."
            rows="4"
          />
        </div>

        {/* Honeypot field - hidden from users */}
        <div className="honeypot-field" style={{ display: 'none' }}>
          <label htmlFor="honeypot">Leave this field empty</label>
          <input
            type="text"
            id="honeypot"
            name="honeypot"
            value={formData.honeypot}
            onChange={handleChange}
            tabIndex="-1"
            autoComplete="off"
          />
        </div>

        {status === 'error' && (
          <div className="rsvp-error">
            {errorMessage}
          </div>
        )}

        <button 
          type="submit" 
          className="rsvp-submit-button"
          disabled={status === 'submitting'}
        >
          {status === 'submitting' ? 'Submitting...' : 'Register'}
        </button>
      </form>
    </div>
  );
};

export default RsvpForm;
