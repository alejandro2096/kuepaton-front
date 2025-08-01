import React from 'react';
import { motion } from 'framer-motion';
import Loader from './Loader'; 

export default function StoryDisplay({ story, loading }) {
  if (loading) {
    return <Loader size={150} />;
  }
  if (!story) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      style={{ marginTop: 24, maxWidth: 600, margin: '24px auto' }}
    >
      <h2>Tu cuento</h2>
      <p style={{ whiteSpace: 'pre-line', background: '#fff', padding: 16, borderRadius: 8 }}>
        {story}
      </p>
    </motion.div>
  );
}
