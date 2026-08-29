import React from 'react';
import { OptimizedImage as Image } from '@/components/ui/OptimizedImage';

export default function Testimonials() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '3rem', padding: '2rem', background: 'var(--surface)', borderRadius: '16px' }}>
      <h3 style={{ fontSize: '2rem', marginBottom: '2rem', color: '#fff', fontWeight: 'bold' }}>Testimonials</h3>
      
      <div style={{ width: '150px', height: '150px', borderRadius: '50%', overflow: 'hidden', marginBottom: '1.5rem', border: '4px solid #333', position: 'relative' }}>
        <Image 
          src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=300&auto=format&fit=crop" 
          alt="Testimonial"
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          style={{ objectFit: 'cover' }}
        />
      </div>

      <div style={{ textAlign: 'center', maxWidth: '600px' }}>
        <p style={{ fontStyle: 'italic', color: '#ccc', lineHeight: '1.8', fontSize: '1rem' }}>
          It can be difficult deciding to get a coach for someone who is an adult and doesn&apos;t know how to cycle. After training with them I haven&apos;t looked back. I feel more confident and <strong>I have actually begun to cycle and enjoy it.</strong> They provide very clear structure and always know the right things to say to <strong>keep you on track and motivated.</strong> They are genuinely interested and care about coaching.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '2rem' }}>
        {[1, 2, 3, 4, 5].map((item, index) => (
          <div 
            key={item} 
            style={{ 
              width: '10px', 
              height: '10px', 
              borderRadius: '50%', 
              background: index === 2 ? 'var(--primary)' : 'transparent',
              border: '2px solid var(--primary)',
              cursor: 'pointer'
            }} 
          />
        ))}
      </div>
    </div>
  );
}
