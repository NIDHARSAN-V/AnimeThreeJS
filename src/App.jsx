import React from "react";
import Carousel3D from "./components/Carousel3D";
import './App.css';
export default function App() {
  return (
  <div className="fire-wrapper">
  <div className="fire-background"></div>
  <div className="fire-content">
    <Carousel3D />
    <h1>Fire animation on this container</h1>
  </div>
</div>

  );
}
