import React, { useEffect, useRef } from 'react';
import SimplexNoise from 'simplex-noise';

const LightningCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Lightning implementation
    window.requestAnimationFrame = (function() {
      return window.requestAnimationFrame ||
             window.webkitRequestAnimationFrame ||
             window.mozRequestAnimationFrame ||
             window.oRequestAnimationFrame ||
             window.msRequestAnimationFrame ||
             function(callback) { window.setTimeout(callback, 1000 / 60); };
    })();

    // Lightning class implementation
    class Lightning {
      constructor(segmentsNum) {
        this.points = [];
        this.children = [];
        this._params = [];
        this._offsets = [];
        
        // Default properties
        this.color = [255, 255, 255];
        this.colorType = 'rgb';
        this.blur = 50;
        this.maxAlpha = 1;
        this.minAlpha = 0.75;
        this.maxLineWidth = 5;
        this.minLineWidth = 0.5;
      }

      // Add all the Lightning methods here...
      // (Copy all the methods from the original LightningAbstract and Lightning classes)
    }

    // Point class implementation
    class Point {
      constructor(x, y, color, colorType) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.colorType = colorType;
        this.vx = Math.random() * (3 + 3) - 3;
        this.vy = Math.random() * (3 + 3) - 3;
        this._latest = { x: this.x, y: this.y };
      }

      // Add all the Point methods here...
      // (Copy all the methods from the original Point class)
    }

    // Set up the lightning effect
    const DRAG_POINT_NUM = 4;
    const DRAG_POINT_MAX_NUM = 8;
    const CHILD_NUM = 2;
    const LIHTNING_COLOR = [195, 100, 50]; // HSL
    const BACKGROUND_COLOR = 'rgba(0, 15, 20, 0.8)';

    let points = [];
    let mouse = { x: 0, y: 0 };
    let lightning;
    let grad;

    // Initialize
    const canvasMinSize = Math.min(canvas.width, canvas.height);
    const centerX = canvas.width * 0.5;
    const centerY = canvas.height * 0.5;

    Point.setField(0, 0, canvas.width, canvas.height);

    grad = context.createLinearGradient(0, 0, 0, canvas.height);
    grad.addColorStop(0, 'hsla(195, 100%, 50%, 0.08)');
    grad.addColorStop(0.5, 'hsla(195, 100%, 50%, 0)');
    grad.addColorStop(1, 'hsla(195, 100%, 50%, 0.08)');

    // Create initial points
    for (let i = 0; i < DRAG_POINT_NUM; i++) {
      points.push(new Point(
        Math.random() * canvasMinSize + centerX - canvasMinSize * 0.5, 
        Math.random() * canvasMinSize + centerY - canvasMinSize * 0.5,
        [...LIHTNING_COLOR], 
        'hsl'
      ));
    }

    // Initialize lightning
    lightning = new Lightning();
    lightning.addParam(8, 10, 0.7, 0.01);
    lightning.addParam(16, 60, 0.5, 0.03);
    lightning.colorType = 'hsl';
    lightning.color = [...LIHTNING_COLOR];
    for (let i = 0; i < CHILD_NUM; i++) {
      lightning.createChild(80, 0.5, 0.06);
    }

    // Animation loop
    const loop = function() {
      const controls = [];

      context.save();
      context.globalCompositeOperation = 'source-over';
      context.fillStyle = BACKGROUND_COLOR;
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.fillStyle = grad;
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.restore();

      context.globalCompositeOperation = 'lighter';
      for (let i = 0, len = points.length; i < len; i++) {
        const p = points[i];
        p.update();
        p.alpha = p.hitTest(mouse) ? 0.75 : 0.2;
        p.draw(context);
        if (p.dead) {
          points.splice(i, 1);
          i--;
          len--;
          continue;
        }
        if (!p.dying) controls.push(p);
      }

      // Sort by distance from origin
      controls.sort((p1, p2) => p1.lengthSq() - p2.lengthSq());

      lightning.render(context, controls);
      lightning.color[2] = Math.random() * (100 - 35) + 35;

      requestAnimationFrame(loop);
    };

    loop();

    // Event listeners
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      Point.setField(0, 0, canvas.width, canvas.height);
    };

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      
      const hit = points.some(p => p.hitTest(mouse));
      document.body.style.cursor = hit ? 'pointer' : 'default';
    };

    const handleMouseDown = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;

      for (let i = 0, len = points.length; i < len; i++) {
        if (points[i].dragStart(mouse)) return;
      }

      for (let i = 0; i < len; i++) {
        if (points[i].hitTest(mouse)) {
          if (len > 1) points.splice(i, 1);
          return;
        }
      }

      if (len < DRAG_POINT_MAX_NUM) {
        points.push(new Point(e.clientX, e.clientY, [...LIHTNING_COLOR], 'hsl'));
      } else {
        for (let i = 0; i < len - 2; i++) {
          points[i].kill();
        }
      }
    };

    const handleMouseUp = () => {
      points.forEach(p => p.dragEnd());
    };

    const handleDoubleClick = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      
      const len = points.length;
      if (len < 3) return;
      
      for (let i = 0; i < len; i++) {
        if (points[i].hitTest(mouse)) {
          points[i].kill();
          return;
        }
      }
    };

    window.addEventListener('resize', handleResize);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('dblclick', handleDoubleClick);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('dblclick', handleDoubleClick);
    };
  }, []);

  return <canvas ref={canvasRef} style={{
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 0,
    width: '100%',
    height: '100%'
  }} />;
};

export default LightningCanvas;