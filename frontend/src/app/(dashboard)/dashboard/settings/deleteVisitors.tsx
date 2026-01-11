"use client";
import React, { useState, useEffect, JSX } from "react";

interface Visitor {
  userId: string;
  ipAddress?: string;
  visitedAt: string;
}

const API_BASE_URL: string = "http://localhost:8080/api/visitors";

interface VisitorManagerProps {
  onBack: () => void;
}

function VisitorManager({ onBack }: VisitorManagerProps): JSX.Element {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVisitors = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/all`);
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const data: { total: number; visitors: Visitor[] } =
        await response.json();
      setVisitors(data.visitors);
    } catch (err) {
      setError("Failed to fetch visitors.");
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisitors();
  }, []);

  const handleDelete = async (userId: string): Promise<void> => {
    if (
      !window.confirm(`Are you sure you want to delete visitor ID: ${userId}?`)
    )
      return;

    try {
      const response = await fetch(`${API_BASE_URL}/${userId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok)
        throw new Error(`Deletion failed with status: ${response.status}`);

      console.log(`Visitor ${userId} deleted successfully.`);
      fetchVisitors();
    } catch (err: any) {
      setError(`Failed to delete visitor: ${err.message}`);
      console.error("Delete error:", err);
    }
  };

  if (loading) return <div>Loading visitors...</div>;
  if (error) return <div style={{ color: "red" }}>Error: {error}</div>;

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h2>Unique Visitor Manager ({visitors.length} Total)</h2>
        <div>
          <button
            onClick={onBack}
            style={{
              marginRight: "10px",
              padding: "8px 15px",
              border: "1px solid #ccc",
            }}
          >
            ← Back to Settings
          </button>
          <button
            onClick={fetchVisitors}
            style={{
              padding: "8px 15px",
              backgroundColor: "#4F46E5",
              color: "white",
              border: "none",
            }}
          >
            Refresh List
          </button>
        </div>
      </div>

      <table style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr style={{ borderBottom: "2px solid #ccc" }}>
            <th style={{ padding: "8px", textAlign: "left" }}>
              Visitor ID (Total)
            </th>
            <th style={{ padding: "8px", textAlign: "left" }}>IP Address</th>
            <th style={{ padding: "8px", textAlign: "left" }}>Last Visited</th>
            <th style={{ padding: "8px", textAlign: "left" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {visitors.length === 0 ? (
            <tr>
              <td colSpan={4} style={{ textAlign: "center", padding: "10px" }}>
                No visitors found.
              </td>
            </tr>
          ) : (
            visitors.map((visitor: Visitor) => (
              <tr
                key={visitor.userId}
                style={{ borderBottom: "1px solid #eee" }}
              >
                <td style={{ padding: "8px" }}>{visitor.userId}</td>
                <td style={{ padding: "8px" }}>{visitor.ipAddress || "N/A"}</td>
                <td style={{ padding: "8px" }}>
                  {new Date(visitor.visitedAt).toLocaleString()}
                </td>
                <td style={{ padding: "8px" }}>
                  <button
                    onClick={() => handleDelete(visitor.userId)}
                    style={{
                      backgroundColor: "#dc3545",
                      color: "white",
                      border: "none",
                      padding: "5px 10px",
                      cursor: "pointer",
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default VisitorManager;
