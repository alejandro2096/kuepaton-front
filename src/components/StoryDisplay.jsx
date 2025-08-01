import React from 'react';
import { motion } from 'framer-motion';

export default function StoryDisplay({ story, loading }) {
  if (loading) return <p>Cargando historia…</p>;
  if (!story) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      style={{ marginTop: 24 }}
    >
      <h2>Tu cuento</h2>
      <p style={{ whiteSpace: 'pre-line' }}>{story}</p>
    </motion.div>
  );
}
