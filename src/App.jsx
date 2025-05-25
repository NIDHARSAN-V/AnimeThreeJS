import React, { Suspense, useState, useEffect } from "react";
import './App.css';
import AnimatedBoxes from "./components/Loader"; // loader component

const Carousel3D = React.lazy(() => import("./components/Carousel3D"));

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [audioPlayed, setAudioPlayed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 5000); // simulate load
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (loaded && !audioPlayed) {
      const audio = new Audio("primal.mp3");
      audio.play().then(() => {
        setAudioPlayed(true);
      }).catch(err => {
        console.warn("Autoplay prevented:", err);
        // Optional: Wait for user interaction to play manually
        const handler = () => {
          audio.play();
          setAudioPlayed(true);
          window.removeEventListener("click", handler);
        };
        window.addEventListener("click", handler);
      });
    }
  }, [loaded, audioPlayed]);

  if (!loaded) {
    return <AnimatedBoxes />;
  }

  return (
    <Suspense fallback={<AnimatedBoxes />}>
      <div className="fire-wrapper">
        <div className="fire-background"></div>
        <div className="fire-content">
          <Carousel3D />
          <h1>Fire animation on this container</h1>
        </div>
      </div>
    </Suspense>
  );
}
