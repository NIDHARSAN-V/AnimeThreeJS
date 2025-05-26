import React, { Suspense, useState, useEffect, useRef } from "react";
import './App.css';
import AnimatedBoxes from "./components/Loader"; // loader component

const Carousel3D = React.lazy(() => import("./components/Carousel3D"));

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 5000); // simulate load
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (loaded) {
      // Create new Audio instance only once
      if (!audioRef.current) {
        audioRef.current = new Audio("primal.mp3");
      }

      audioRef.current.play()
        .then(() => {
          console.log("Audio played automatically");
        })
        .catch(err => {
          console.warn("Autoplay prevented:", err);

          const handler = () => {
            audioRef.current.play();
            window.removeEventListener("click", handler);
          };
          window.addEventListener("click", handler);
        });
    }
  }, [loaded]);

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
