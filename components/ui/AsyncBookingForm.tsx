"use client";

import dynamic from "next/dynamic";
import React from "react";

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

// Dynamically import the heavy form so it doesn't block the main thread
const BookingForm = dynamic(
  () => import("./BookingForm").then((mod) => mod.BookingForm),
  { ssr: false },
);

export function AsyncBookingForm(props: BookingFormProps) {
  return <BookingForm {...props} />;
}
