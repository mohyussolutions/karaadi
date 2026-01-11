"use client";

import React from "react";
import Link from "next/link";
import { devicesLinks } from "@/app/(links)/devicesLinks/devicesLinks";

export default function Devices() {
  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-6">
        Devices Management
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {devicesLinks.map((device) => (
          <Link
            key={device.name}
            href={device.href}
            className="group border border-gray-200 rounded-lg p-6 hover:border-blue-300 hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-gray-100 rounded-lg group-hover:bg-blue-100 transition-colors">
                <device.icon className="w-6 h-6 text-gray-600 group-hover:text-blue-600 transition-colors" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800 group-hover:text-blue-700 transition-colors">
                  {device.name}
                </h3>
                <p className="text-sm text-gray-600 mt-2">
                  Manage {device.name.toLowerCase()}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
