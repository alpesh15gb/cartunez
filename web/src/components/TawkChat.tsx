'use client';

import { useEffect } from 'react';

export default function TawkChat() {
  useEffect(() => {
    // Tawk.to Script Integration
    // IMPORTANT: Replace the IDs below with your actual Tawk.to Property ID and Widget ID
    const propertyId = 'YOUR_PROPERTY_ID'; 
    const widgetId = 'YOUR_WIDGET_ID';

    if (propertyId === 'YOUR_PROPERTY_ID') return;

    var Tawk_API = (window as any).Tawk_API || {}, Tawk_LoadStart = new Date();
    (function() {
      var s1 = document.createElement("script"), s0 = document.getElementsByTagName("script")[0];
      s1.async = true;
      s1.src = `https://embed.tawk.to/${propertyId}/${widgetId}`;
      s1.charset = 'UTF-8';
      s1.setAttribute('crossorigin', '*');
      if (s0 && s0.parentNode) {
        s0.parentNode.insertBefore(s1, s0);
      }
    })();
  }, []);

  return null; // This component doesn't render any UI
}
