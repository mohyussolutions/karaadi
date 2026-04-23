import React from 'react';
import Link from 'next/link';

export default function BusinessInfo() {
  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Contact and Information</h1>
      <p className="mb-4">Here you will find everything you need as a business customer on FINN.</p>
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Workstation</h2>
        <p className="mb-2">Read more about our products and get inspired on how to get the most out of FINN.no as a business customer.</p>
        <Link href="/business/products" className="text-blue-600 underline">Read more</Link>
      </div>
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Support</h2>
        <p className="mb-2">If you have questions about login or need help, visit our <Link href="/help" className="underline">help center</Link> or contact your customer contact at FINN.</p>
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-2">Contact us</h2>
        <p>Email: <a href="mailto:business@finn.no" className="text-blue-600 underline">business@finn.no</a></p>
        <p>Phone: <a href="tel:+4712345678" className="text-blue-600 underline">+47 12 34 56 78</a></p>
      </div>
    </div>
  );
}
