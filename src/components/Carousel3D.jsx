import React, { useState, useEffect } from "react";
import styles from "./Carousel3D.module.css";
import PrimalModel from "./PrimalModel";
import GPrimalModel from "./Gprimal";
import Typewriter from 'typewriter-effect';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const cards = [
  {
    title: "Dragon 1",
    img: "images/dragon_1.jpg",
    description: "This dragon breathes fire and flies through the clouds.",
  },
  {
    title: "Dragon 2",
    img: "images/dragon_2.jpg",
    description: "Swift and fierce, known for its icy powers.",
  },
  {
    title: "Dragon 3",
    img: "images/dragon_3.jpg",
    description: "A mysterious guardian of ancient treasures.",
  },
  {
    title: "Dragon 4",
    img: "images/dragon_4.jpg",
    description: "Lives in volcanoes, controls molten lava.",
  },
  {
    title: "Dragon 5",
    img: "images/dragon_5.jpg",
    description: "Stealthy and silent, master of shadows.",
  },
  {
    title: "Dragon 6",
    img: "images/dragon_6.jpg",
    description: "Controls the winds, soars higher than any bird.",
  },
  {
    title: "Dragon 7",
    img: "images/dragon_7.jpg",
    description: "Glows in the dark, a symbol of hope.",
  },
  {
    title: "Dragon 8",
    img: "images/dragon_8.jpg",
    description: "Protector of the mountain temple.",
  },
  {
    title: "Dragon 9",
    img: "images/dragon_9.jpg",
    description: "Legend says it can speak ancient languages.",
  },
  {
    title: "Dragon 10",
    img: "images/dragon_10.jpg",
    description: "The ultimate mythical dragon with cosmic power.",
  },
];

const Carousel3D = () => {
  const [isHovering, setIsHovering] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);
  const [roar, setRoar] = useState(false);
  const [rotationZ, setRotationZ] = useState(0);
   const [animationSpeed, setAnimationSpeed] = useState(13); 

  const handleRoar = (index) => {
  setRoar(true);
  setActiveIndex(index);
    const slider = document.querySelector(`.${styles.slider}`);

    console.log(slider.style , "Slider")

  const audio = new Audio("dragonroar.mp3");
  audio.play();
  setIsHovering(true);
  setAnimationSpeed(0.5)

  setTimeout(() => {
    setIsHovering(false);
    setRoar(false);
    setActiveIndex(null);
    setAnimationSpeed(13)
    console.log(index, "index");
}, 8000);


  //navigate
};

  useEffect(() => {
    let proxy = { rot: 0 };

    gsap.to(proxy, {
      rot: Math.PI * 2,
      ease: "none",
      scrollTrigger: {
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: () => setRotationZ(proxy.rot),
      },
    });

    return () => {
      ScrollTrigger.killAll();
    };
  }, []);

  return (
    <div className={styles.banner}>
      {isHovering ? (
        <div className={styles.model}>
          <GPrimalModel roar={roar} />
        </div>
      ) : (
        <div className={styles.model}>
          <PrimalModel paused={isHovering} rotationZ={rotationZ} />
        </div>
      )}
  <div
        className={styles.slider}
       style={{
  "--quantity": cards.length,
  "--animation-duration": `${animationSpeed}s`, // ✅ inject this variable
}}

        onMouseEnter={() => {
          if (!roar) setIsHovering(true);
        }}
        onMouseLeave={() => {
          if (!roar) setIsHovering(false);
        }}
      >
        {cards.map((card, index) => (
          <div
            key={index}
            className={`${styles.item} ${activeIndex === index ? styles.fire : ""}`}
            style={{ "--position": index + 1 }}
            onClick={() => handleRoar(index)}
          >
            <div className={styles.card}>
              <div className={styles.front}>
                <img src={card.img} alt={card.title} />
              </div>
              <div className={styles.back}>
                <div className={styles.img}>
                  <img src={card.img} alt={card.title} />
                </div>
                <div className={styles.text}>
                  <h4>{card.title}</h4>
                  <p>{card.description}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.content}>
        <p className={styles.Blazing}>
          @Designed by{" "}
          <span className={styles.Blazing}>
            <Typewriter
              options={{
                strings: ["VIPER_RKO"],
                autoStart: true,
                loop: true,
              }}
            />
          </span>
        </p>
      </div>
    </div>
  );
};

export default Carousel3D;
