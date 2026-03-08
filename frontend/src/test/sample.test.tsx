import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import React from "react";

describe("Sample Frontend Test", () => {
  it("renders a simple message", () => {
    render(<div>Hello, frontend test!</div>);
    expect(screen.getByText("Hello, frontend test!")).toBeInTheDocument();
  });
});
