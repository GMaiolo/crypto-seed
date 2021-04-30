import { useEffect, useRef } from "react";
import { frag } from "./frag";
import { vert } from "./vert";

const createRegl = require("regl");
const createPrimitive = require("primitive-icosphere");
const createCamera = require("perspective-camera");
const hexRgb = require("hex-rgb");

// Utility to convert hex string to [ r, g, b] floats
const hexToRGB = (hex) => {
  const rgba = hexRgb(hex, { format: "array" });
  return rgba.slice(0, 3).map((n) => n / 255);
};

export const Dither = ({ width, height }) => {
  const canvasRef = useRef();

  useEffect(() => {
    const color = "#ffff";
    const foregroundRGB = hexToRGB(color);

    const regl = createRegl(canvasRef.current);

    const sphere = createPrimitive(1, { subdivisions: 5 });

    const camera = createCamera({
      fov: (35 * Math.PI) / 180,
    });

    camera.translate([0, 0, 6]);
    camera.lookAt([0, 0, 0]);
    camera.update();

    const drawMesh = regl({
      // Fragment & Vertex shaders
      frag,
      vert,
      uniforms: {
        projectionMatrix: regl.prop("projectionMatrix"),
        modelViewMatrix: regl.prop("modelViewMatrix"),
        color: foregroundRGB,
        resolution: [200, 200],
        time: regl.prop("time"),
      },
      attributes: {
        position: regl.buffer(sphere.positions),
        normal: regl.buffer(sphere.normals),
      },
      elements: regl.elements(sphere.cells),
    });

    const draw = (time) => {
      // On each tick, update regl timers and sizes
      // regl.poll();
      // Clear backbuffer with black
      // regl.clear({
      //  color: backgroundRGBA,
      //  depth: 1,
      //  stencil: 0,
      // });

      // camera.viewport = [0, 0, viewportWidth, viewportHeight];
      // camera.update();

      drawMesh({
        projectionMatrix: camera.projection,
        modelViewMatrix: camera.view,
        time: time / 600,
      });
      requestAnimationFrame(draw);
    };
    requestAnimationFrame(draw);
  }, []);

  return <canvas width={width} height={height} ref={canvasRef}></canvas>;
};
