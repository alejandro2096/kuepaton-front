import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

import SelectField from './components/SelectField';
import StoryDisplay from './components/StoryDisplay';
import Illustration from './components/Ilustration';

const personajes = [
  { value: 'robot curioso', label: 'Un robot curioso' },
  { value: 'princesa valiente', label: 'Una princesa valiente' },
  { value: 'gato mago',     label: 'Un gato mago' },
];
const lugares = [
  { value: 'triangulo bermudas', label: 'Triángulo de las Bermudas' },
  { value: 'luna',              label: 'La Luna' },
  { value: 'bosque encantado',  label: 'El Bosque Encantado' },
];
const objetos = [
  { value: 'copa cafam',   label: 'Una copa Cafam' },
  { value: 'mapa antiguo', label: 'Un mapa antiguo' },
  { value: 'reloj de sol', label: 'Un reloj de sol' },
];

export default function App() {
  const [personaje, setPersonaje] = useState(null);
  const [lugar, setLugar]         = useState(null);
  const [objeto, setObjeto]       = useState(null);

  const [story, setStory]             = useState('');
  const [imageUrl, setImageUrl]       = useState('');
  const [loadingStory, setLoadingStory] = useState(false);
  const [loadingImage, setLoadingImage] = useState(false);

  const handleGenerate = async () => {
    if (!personaje || !lugar || !objeto) {
      return alert('Por favor, completa los tres campos.');
    }

    setLoadingStory(true);
    setStory('');
    setImageUrl('');
    try {
      const { data: textRes } = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/generate-story`,
        {
          personaje: personaje.value,
          lugar: lugar.value,
          objeto: objeto.value,
        }
      );
      setStory(textRes.story);
      setLoadingStory(false);

      setLoadingImage(true);
      const { data: imgRes } = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/generate-image`,
        { prompt: textRes.imagePrompt }
      );
      setImageUrl(imgRes.url);
    } catch (err) {
      console.error(err);
      alert('Algo salió mal. Revisa la consola.');
    } finally {
      setLoadingStory(false);
      setLoadingImage(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      style={{
        minHeight: '100vh',
        padding: '40px 24px',
        background: 'linear-gradient(135deg, #fceef5 0%, #d6f8fa 100%)'
      }}
    >
      <motion.h1
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        style={{ textAlign: 'center', marginBottom: 32, color: '#111827' }}
      >
        Cuento Mágico
      </motion.h1>

      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        style={{
          maxWidth: 600,
          margin: '0 auto',
          background: '#fff',
          borderRadius: 12,
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          padding: 24,
          display: 'flex',
          flexDirection: 'column',
          gap: 16
        }}
      >
        <SelectField label="Personaje" options={personajes} value={personaje} onChange={setPersonaje} />
        <SelectField label="Lugar"      options={lugares}    value={lugar}     onChange={setLugar} />
        <SelectField label="Objeto"     options={objetos}    value={objeto}    onChange={setObjeto} />

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          onClick={handleGenerate}
          style={{
            width: '100%',
            padding: '14px 0',
            background: '#4f46e5',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            fontSize: 16,
            cursor: 'pointer'
          }}
        >
          Generar cuento
        </motion.button>
      </motion.div>

      <StoryDisplay story={story} loading={loadingStory} />
      <Illustration imageUrl={imageUrl} loading={loadingImage} />
    </motion.div>
  );
}
