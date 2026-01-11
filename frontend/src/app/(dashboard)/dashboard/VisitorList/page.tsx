"use client";

import { useEffect, useState } from "react";
import { FaTrash, FaPaperPlane } from "react-icons/fa";

export default function VisitorList() {
  const [visitors, setVisitors] = useState<any[]>([]);

  const loadVisitors = () => {
    fetch("http://localhost:8080/api/visitors/all")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setVisitors(data);
        else if (Array.isArray(data.visitors)) setVisitors(data.visitors);
        else setVisitors([]);
      });
  };

  useEffect(() => {
    loadVisitors();
  }, []);

  const deleteVisitor = async (id: number) => {
    await fetch(`http://localhost:8080/api/visitors/${id}`, {
      method: "DELETE",
    });
    loadVisitors();
  };

  return (
    <div className="p-4 bg-white rounded-xl shadow-md border">
      <h2 className="text-xl font-semibold mb-4">Visitors</h2>

      <div className="space-y-3">
        {visitors.map((v, i) => (
          <div
            key={v.id ?? `${v.userId}-${i}`}
            className="flex items-center justify-between p-3 border rounded-lg bg-gray-50"
          >
            <div>
              <div className="font-medium">{v.userId || "Unknown"}</div>
              <div className="text-gray-500 text-sm">
                {new Date(v.visitedAt).toLocaleString()}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => deleteVisitor(v.id)}
                className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
