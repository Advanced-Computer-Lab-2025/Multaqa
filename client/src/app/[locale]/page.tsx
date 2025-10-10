/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { api } from "../../api";

const CallApiButton: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleCallApi = async () => {
    setLoading(true);
    setError(null);
    setResponse([]);
    try {
      // TODO: Replace with your API route
      const res = await api.get("/events");
      setResponse(res.data);
    } catch (err: any) {
      setError(err?.message || "API call failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minHeight: "100vh",
        background: "#f9fafb",
      }}
    >
      <button
        onClick={handleCallApi}
        disabled={loading}
        style={{
          padding: "16px 32px",
          fontSize: "1.25rem",
          fontWeight: 600,
          borderRadius: "12px",
          backgroundColor: "#7851da",
          color: "#fff",
          border: "none",
          cursor: loading ? "not-allowed" : "pointer",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          margin: "32px 0",
        }}
      >
        {loading ? "Calling API..." : "Call API"}
      </button>
      {error && (
        <div style={{ color: "red", marginBottom: "24px" }}>{error}</div>
      )}
      <div
        style={{
          width: "100%",
          maxWidth: 800,
          display: "flex",
          flexDirection: "column",
          gap: 24,
        }}
      >
        {Array.isArray(response) &&
          response.length > 0 &&
          response.map((event: any) => (
            <div
              key={event._id}
              style={{
                background: "#fff",
                borderRadius: "16px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                padding: "24px",
                marginBottom: "8px",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              <h2
                style={{
                  fontSize: "1.5rem",
                  fontWeight: 700,
                  color: "#7851da",
                  margin: 0,
                }}
              >
                {event.event_name}
              </h2>
              <div style={{ color: "#374151", fontWeight: 500 }}>
                {event.type.toUpperCase()}
              </div>
              <div style={{ color: "#6b7280" }}>{event.location}</div>
              <div style={{ color: "#6b7280" }}>
                Start: {new Date(event.event_start_date).toLocaleString()}
              </div>
              <div style={{ color: "#6b7280" }}>
                End: {new Date(event.event_end_date).toLocaleString()}
              </div>
              <div style={{ color: "#6b7280" }}>
                Price: {event.price ? `$${event.price}` : "Free"}
              </div>
              <div style={{ color: "#6b7280" }}>
                Description: {event.description}
              </div>
              {event.vendors &&
                Array.isArray(event.vendors) &&
                event.vendors.length > 0 && (
                  <div style={{ marginTop: 8 }}>
                    <strong>Vendors:</strong>
                    <ul style={{ margin: 0, paddingLeft: 16 }}>
                      {event.vendors.map((v: any) => (
                        <li key={v._id}>
                          Vendor ID: {v.vendor}
                          <br />
                          Booth Size:{" "}
                          {v.RequestData?.value?.boothSize ||
                            v.RequestData?.data?.value?.boothSize ||
                            "N/A"}
                          <br />
                          Attendees:{" "}
                          {Array.isArray(v.RequestData?.value?.bazaarAttendees)
                            ? v.RequestData.value.bazaarAttendees
                                .map((a: any) => a.name)
                                .join(", ")
                            : "N/A"}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
            </div>
          ))}
      </div>
    </div>
  );
};

export default CallApiButton;
