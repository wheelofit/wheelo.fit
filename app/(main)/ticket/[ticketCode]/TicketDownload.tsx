"use client";

import React, { useRef, useState, useEffect } from "react";
import { toPng } from "html-to-image";
import QRCode from "react-qr-code";
import styles from "./TicketDownload.module.css";

type TicketData = {
  ticketCode: string;
  name: string;
  email: string;
  eventName: string;
  eventDate: string;
  eventTime: string;
  ticketCount: number;
  additionalNames: string[];
};

export default function TicketDownload({ ticket }: { ticket: TicketData }) {
  const ticketRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);
  const [origin, setOrigin] = useState("");
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    Promise.resolve().then(() => setOrigin(window.location.origin));
  }, []);

  const qrUrl = origin ? `${origin}/ticket/${ticket.ticketCode}` : "";

  const handleDownload = async () => {
    if (ticketRef.current === null) {
      return;
    }
    try {
      setDownloading(true);
      const dataUrl = await toPng(ticketRef.current, {
        cacheBust: true,
        pixelRatio: 2,
      });
      const link = document.createElement("a");
      link.download = `Wheelo_Ticket_${ticket.ticketCode}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Failed to download ticket", err);
    } finally {
      setDownloading(false);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ticketRef.current) return;
    const rect = ticketRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    let rotateX = ((y - centerY) / centerY) * -10;
    let rotateY = ((x - centerX) / centerX) * 10;

    // Clamp values to prevent abrupt flips
    rotateX = Math.max(-15, Math.min(15, rotateX));
    rotateY = Math.max(-15, Math.min(15, rotateY));

    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  const renderTicketContent = (isFixed?: boolean) => (
    <>
      <div className={styles.ticketInner}>
        <div className={styles.circleTopRight}></div>
        <div className={styles.circleBottomLeft}></div>

        <h2 className={styles.header}>Wheelo Pass</h2>

        <div className={styles.section}>
          <p className={styles.label}>Event</p>
          <p className={styles.valueLarge}>{ticket.eventName}</p>
        </div>

        <div className={styles.row}>
          <div>
            <p className={styles.label}>Date</p>
            <p className={styles.value}>{ticket.eventDate}</p>
          </div>
          <div className={styles.alignRight}>
            <p className={styles.label}>Time</p>
            <p className={styles.value}>{ticket.eventTime}</p>
          </div>
        </div>

        <div className={styles.attendeesRow}>
          <div>
            <p className={styles.label}>Attendees ({ticket.ticketCount})</p>
            <p className={styles.valueLarge}>{ticket.name} (Lead)</p>
            {ticket.additionalNames.length > 0 && (
              <p
                style={{
                  fontSize: "0.9rem",
                  color: "rgba(255,255,255,0.8)",
                  marginTop: "4px",
                }}
              >
                + {ticket.additionalNames.join(", ")}
              </p>
            )}
          </div>
          <div className={styles.admitBadge}>
            <p className={styles.label} style={{ marginBottom: "4px" }}>
              Admit
            </p>
            <p className={styles.admitNumber}>{ticket.ticketCount}</p>
          </div>
        </div>
      </div>

      <div className={styles.footer}>
        <div className={styles.ticketCodeContainer}>
          <p
            className={styles.label}
            style={{ letterSpacing: "2px", fontWeight: "bold" }}
          >
            Ticket Code
          </p>
          <p className={styles.ticketCodeValue}>{ticket.ticketCode}</p>
        </div>
        {qrUrl && (
          <div className={styles.qrContainer}>
            <QRCode value={qrUrl} size={isFixed ? 100 : 80} level="M" />
          </div>
        )}
      </div>
    </>
  );

  return (
    <div className={styles.container}>
      {/* Hidden fixed template for downloading */}
      <div style={{ position: "absolute", top: "-9999px", left: "-9999px" }}>
        <div ref={ticketRef} className={styles.ticketFixed}>
          {renderTicketContent(true)}
        </div>
      </div>

      {/* Visible responsive ticket */}
      <div
        className={styles.responsiveWrapper}
        style={{ width: "100%", display: "flex", justifyContent: "center" }}
      >
        <div
          className={styles.ticket}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          }}
        >
          {renderTicketContent(false)}
        </div>
      </div>

      <button
        onClick={handleDownload}
        disabled={downloading}
        className={styles.downloadBtn}
      >
        {downloading ? "Preparing Download..." : "Download Ticket Image"}
      </button>
    </div>
  );
}
