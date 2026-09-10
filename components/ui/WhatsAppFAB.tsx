"use client";

import React from "react";

export default function WhatsAppFAB() {
  const phoneNumber = "918879045474";
  const message =
    "Hi Wheelo.fit, I'd like to know more about your cycling classes.";
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        position: "fixed",
        bottom: "100px", // Stacked above EnquireModalFAB which is at 30px
        right: "30px",
        background: "#25D366", // WhatsApp Green
        color: "#fff",
        border: "none",
        borderRadius: "50px",
        padding: "16px 24px",
        fontSize: "1.1rem",
        fontWeight: "bold",
        textDecoration: "none",
        cursor: "pointer",
        boxShadow: "0 10px 25px rgba(37, 211, 102, 0.4)",
        zIndex: 90,
        display: "flex",
        alignItems: "center",
        gap: "10px",
        transition: "transform 0.2s, box-shadow 0.2s",
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = "translateY(-3px)";
        e.currentTarget.style.boxShadow = "0 15px 35px rgba(37, 211, 102, 0.5)";
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 10px 25px rgba(37, 211, 102, 0.4)";
      }}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564c.173.087.289.129.332.202.043.073.043.423-.101.827z"></path>
        <path d="M12 2C6.477 2 2 6.477 2 12c0 1.764.455 3.42 1.258 4.887L2 22l5.241-1.171C8.618 21.576 10.264 22 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.232c-1.464 0-2.873-.377-4.113-1.088l-2.98.665.68-2.844A8.204 8.204 0 0 1 4.544 12c0-4.55 3.693-8.243 8.243-8.243s8.243 3.693 8.243 8.243-3.694 8.232-8.243 8.232z"></path>
      </svg>
      WhatsApp
    </a>
  );
}
