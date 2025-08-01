import React from 'react';
import Lottie from 'lottie-react';
import animationData from '../animations/loader.json';

export default function Loader({ size = 150 }) {
  return (
    <div style={{ textAlign: 'center', marginTop: 24 }}>
      <Lottie
        animationData={animationData}
        loop
        autoplay
        style={{ width: size, height: size, margin: '0 auto' }}
      />
    </div>
  );
}
