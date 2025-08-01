import React from 'react';
import Lottie from 'lottie-react';
import { motion } from 'framer-motion';
import loaderAnimation from '../animations/loader.json'; 
export default function Illustration({ imageUrl, loading }) {
  if (loading) {
    return (
      <div style={{ textAlign: 'center', marginTop: 24 }}>
        <Lottie
          animationData={loaderAnimation}
          loop={true}
          style={{ width: 150, height: 150, margin: '0 auto' }}
        />
      </div>
    );
  }

  if (!imageUrl) return null;

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.3 }}
      style={{ textAlign: 'center', marginTop: 24 }}
    >
      <motion.img
        src={imageUrl}
        alt="Ilustración del cuento"
        style={{
          maxWidth: '100%',
          borderRadius: 8,
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}
      />
    </motion.div>
  );
}
