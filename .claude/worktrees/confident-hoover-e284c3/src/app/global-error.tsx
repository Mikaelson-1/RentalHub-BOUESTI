"use client";

import * as Sentry from "@sentry/nextjs";
import Error from "next/error";
import Link from "next/link";
import { useEffect } from "react";

export default function GlobalError({ error }: { error: Error }) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html>
      <body>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            padding: "20px",
            fontFamily: "system-ui, -apple-system, sans-serif",
            backgroundColor: "#f5f5f5",
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "40px",
              borderRadius: "8px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              maxWidth: "500px",
              textAlign: "center",
            }}
          >
            <h1 style={{ color: "#d32f2f", marginBottom: "16px" }}>
              Oops! Something went wrong
            </h1>
            <p style={{ color: "#666", marginBottom: "24px" }}>
              We&apos;ve been notified about this issue. Our team is working to fix it.
            </p>
            <Link
              href="/"
              style={{
                backgroundColor: "#2196f3",
                color: "white",
                border: "none",
                padding: "12px 24px",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: "500",
                textDecoration: "none",
                display: "inline-block",
              }}
            >
              Go Back Home
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
