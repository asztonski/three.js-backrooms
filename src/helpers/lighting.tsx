import { useEffect } from 'react';
import { RectAreaLightTexturesLib } from 'three/examples/jsm/lights/RectAreaLightTexturesLib.js';

export function LightingInit() {
  useEffect(() => {
    RectAreaLightTexturesLib.init();
  }, []);
  return null;
}
