'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './BookingForm.module.css';


type EventData = {
  id: string;
  title: string;
  date: Date;
  timeSlot: string;
  price?: number;
};

type BookingFormProps = {
  title: string;
  events?: EventData[];
  buttonText?: string;
};

export function BookingForm({ title, events = [], buttonText = 'Book Now' }: BookingFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string>('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const selectedEvent = events.find(ev => ev.id === selectedEventId);

  const [ticketCount, setTicketCount] = useState(1);

  async function handleSubmit(formData: FormData) {
    setPending(true);
    setError(null);
    setSuccess(null);
    
    if (!selectedEventId) {
      setError('Please select an event to register.');
      setPending(false);
      return;
    }
    formData.append('eventId', selectedEventId);
    formData.append('type', 'event');

    try {
      const response = await fetch('/api/payment/initiate', {
        method: 'POST',
        body: formData
      });
      const res = await response.json();

      if (res.error) {
        setError(res.error);
        setPending(false);
        return;
      }

      if (res.success) {
        if (res.redirectUrl) {
          if (res.redirectUrl.startsWith('http')) {
            // External redirect to PhonePe
            window.location.href = res.redirectUrl;
          } else {
            // Internal redirect
            router.push(res.redirectUrl);
          }
        } else {
          setSuccess('Booking created successfully.');
        }
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred while initiating payment.');
    }
    
    setPending(false);
  }

  if (success) {
    return (
      <div className={styles.formContainer} style={{ textAlign: 'center' }}>
        <h3 className={styles.title}>Thank You!</h3>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.1rem' }}>{success}</p>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className={styles.formContainer} style={{ textAlign: 'center' }}>
        <h3 className={styles.title}>{title}</h3>
        <p style={{ color: '#aaa', padding: '2rem 0' }}>No upcoming events scheduled right now. Check back later!</p>
      </div>
    );
  }

  return (
    <div className={styles.formContainer}>
      <h3 className={styles.title}>{title}</h3>
      <form action={handleSubmit}>
        {error && <div style={{ color: '#ff4d4d', background: 'rgba(255,77,77,0.1)', padding: '0.8rem', borderRadius: '6px', fontSize: '0.9rem', marginBottom: '1rem' }}>{error}</div>}
        
        <div className={styles.field} style={{ marginBottom: '8px' }}>
          <label className={styles.label}>Select Event / Date</label>
        </div>
        
        <div className={styles.eventDropdownContainer}>
          <div 
            className={`${styles.eventDropdownTrigger} ${selectedEvent ? styles.eventDropdownTriggerSelected : ''}`}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            {selectedEvent ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span className={styles.eventTitle}>{selectedEvent.title}</span>
                <span className={styles.eventDate}>{selectedEvent.date.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric', timeZone: 'Asia/Kolkata' })}</span>
                <span className={styles.eventTime}>{selectedEvent.timeSlot}</span>
              </div>
            ) : (
              <span style={{ color: 'rgba(255,255,255,0.7)' }}>Select an upcoming event...</span>
            )}
            <svg 
              className={`${styles.dropdownIcon} ${isDropdownOpen ? styles.dropdownIconOpen : ''}`} 
              viewBox="0 0 24 24"
            >
              <path d="M7 10l5 5 5-5z" />
            </svg>
          </div>

          {isDropdownOpen && (
            <div className={styles.eventCardList}>
              {events.map(ev => {
                const formattedDate = ev.date.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric', timeZone: 'Asia/Kolkata' });
                return (
                  <label 
                    key={ev.id} 
                    className={`${styles.eventCard} ${selectedEventId === ev.id ? styles.eventCardSelected : ''}`}
                  >
                    <input 
                      type="radio" 
                      name="eventId_dummy" 
                      value={ev.id}
                      onChange={(e) => {
                        setSelectedEventId(e.target.value);
                        setIsDropdownOpen(false);
                      }}
                      checked={selectedEventId === ev.id}
                    />
                    <span className={styles.eventTitle}>{ev.title}</span>
                    <span className={styles.eventDate}>{formattedDate}</span>
                    <span className={styles.eventTime}>{ev.timeSlot}</span>
                  </label>
                );
              })}
            </div>
          )}
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Number of Tickets</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: '#222', padding: '0.5rem', borderRadius: '8px', border: '1px solid #444', width: 'fit-content' }}>
            <button 
              type="button" 
              onClick={() => setTicketCount(Math.max(1, ticketCount - 1))}
              style={{ background: '#333', color: '#fff', border: 'none', width: '36px', height: '36px', borderRadius: '6px', fontSize: '1.2rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              -
            </button>
            <span style={{ fontSize: '1.2rem', fontWeight: 'bold', width: '30px', textAlign: 'center' }}>
              {ticketCount}
            </span>
            <button 
              type="button" 
              onClick={() => setTicketCount(Math.min(30, ticketCount + 1))}
              style={{ background: '#333', color: '#fff', border: 'none', width: '36px', height: '36px', borderRadius: '6px', fontSize: '1.2rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              +
            </button>
          </div>
          <input type="hidden" name="ticketCount" value={ticketCount} />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="name">Lead Attendee Full Name</label>
          <input className={styles.input} type="text" id="name" name="name" placeholder="John Doe" required />
        </div>

        {Array.from({ length: ticketCount - 1 }).map((_, i) => (
          <div className={styles.field} key={i}>
            <label className={styles.label} htmlFor={`additionalName_${i}`}>Attendee {i + 2} Name</label>
            <input className={styles.input} type="text" id={`additionalName_${i}`} name={`additionalName_${i}`} placeholder={`Attendee ${i + 2} Name`} required />
          </div>
        ))}

        <div className={styles.field}>
          <label className={styles.label} htmlFor="email">Email Address</label>
          <input className={styles.input} type="email" id="email" name="email" placeholder="john@example.com" required />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="phone">Phone Number</label>
          <input className={styles.input} type="tel" id="phone" name="phone" placeholder="+1 234 567 8900" required />
        </div>

        <button type="submit" disabled={pending} className={styles.submitBtn}>
          {pending 
            ? 'Submitting...' 
            : selectedEvent && selectedEvent.price
              ? `${buttonText} • ₹${selectedEvent.price * ticketCount}`
              : buttonText
          }
        </button>
      </form>
    </div>
  );
}
