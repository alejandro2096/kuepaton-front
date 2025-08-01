import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import logo from './assets/imagiArte-logo.png';

import SelectField from './components/SelectField';
import StoryDisplay from './components/StoryDisplay';
import Illustration from './components/Ilustration';
import { GoogleGenAI } from '@google/genai';

const personajes = [
	{ value: 'robot curioso', label: 'Un robot curioso' },
	{ value: 'princesa valiente', label: 'Una princesa valiente' },
	{ value: 'gato mago', label: 'Un gato mago' },
	{ value: 'dragón risueño', label: 'Un dragón risueño' },
	{ value: 'astronauta intrépido', label: 'Un astronauta intrépido' },
	{ value: 'sirena aventurera', label: 'Una sirena aventurera' },
	{ value: 'unicornios sabio', label: 'Un unicornio sabio' },
	{ value: 'pirata bromista', label: 'Un pirata bromista' },
	{ value: 'duende travieso', label: 'Un duende travieso' },
	{ value: 'explorador del tiempo', label: 'Un explorador del tiempo' },
];

const lugares = [
	{ value: 'triangulo bermudas', label: 'Triángulo de las Bermudas' },
	{ value: 'luna', label: 'La Luna' },
	{ value: 'bosque encantado', label: 'El Bosque Encantado' },
	{ value: 'castillo flotante', label: 'El Castillo Flotante' },
	{ value: 'ciudad submarina', label: 'La Ciudad Submarina' },
	{ value: 'desierto de cristal', label: 'El Desierto de Cristal' },
	{ value: 'volcan misterioso', label: 'El Volcán Misterioso' },
	{ value: 'isla arcoíris', label: 'La Isla Arcoíris' },
	{ value: 'valle de las nubes', label: 'El Valle de las Nubes' },
	{ value: 'montaña arco', label: 'La Montaña Arco' },
];

const objetos = [
	{ value: 'copa cafam', label: 'Una copa Cafam' },
	{ value: 'mapa antiguo', label: 'Un mapa antiguo' },
	{ value: 'reloj de sol', label: 'Un reloj de sol' },
	{ value: 'varita estelar', label: 'Una varita estelar' },
	{ value: 'espejo mágico', label: 'Un espejo mágico' },
	{ value: 'llave dorada', label: 'Una llave dorada' },
	{ value: 'libro encantado', label: 'Un libro encantado' },
	{ value: 'medallón antiguo', label: 'Un medallón antiguo' },
	{ value: 'corona de perlas', label: 'Una corona de perlas' },
	{ value: 'bolsa sin fondo', label: 'Una bolsa sin fondo' },
];

export default function App() {
	const [personaje, setPersonaje] = useState(null);
	const [lugar, setLugar] = useState(null);
	const [objeto, setObjeto] = useState(null);

	const [story, setStory] = useState('');
	const [imageUrl, setImageUrl] = useState('');
	const [loadingStory, setLoadingStory] = useState(false);
	const [loadingImage, setLoadingImage] = useState(false);
	const [video, setVideo] = useState(undefined);

	const BASE = 'https://olurxu-ip-201-232-170-125.tunnelmole.net';

	const handleGenerate = async () => {
		if (!personaje || !lugar || !objeto) {
			return alert('Por favor, completa los tres campos.');
		}

		setLoadingStory(true);
		setLoadingImage(true);
		setStory('');
		setImageUrl('');
		setVideo;

		try {
			const { data: textRes } = await axios.get(`${BASE}/api/ia/create-story`, {
				params: {
					character: personaje.value,
					place: lugar.value,
					object: objeto.value,
				},
			});
			generateVideo({ prompt: textRes.story_resume });
			console.log({ textRes });
			setStory(textRes.story);
			setLoadingStory(false);

			const { data: imgRes } = await axios.post(`${BASE}/api/ia/create-imagen`, { story: textRes.story_resume });
			console.log({ imgRes });
			setImageUrl(imgRes.imagenUrl);
			setLoadingImage(false);
		} catch (err) {
			console.error(err);
			alert('Algo salió mal. Revisa la consola.');
			setLoadingStory(false);
			setLoadingImage(false);
		}
	};

	const generateVideo = async (params) => {
		// const uri = "https://generativelanguage.googleapis.com/v1beta/files/pd9pcqztfwg9:download?alt=media"
		const apiKey = 'AIzaSyA8kcCIAlEt8BWKFExN3oS91RgsKRTAxV4'; // ¡IMPORTANTE! Pon tu API Key aquí
		try {
			const ai = new GoogleGenAI({ apiKey });
			let operation = await ai.models.generateVideos({
				model: 'veo-3.0-fast-generate-preview',
				prompt: params?.prompt,
			});
			while (!operation.done) {
				console.log('Generando...');
				await new Promise((resolve) => setTimeout(resolve, 10000));
				operation = await ai.operations.getVideosOperation({
					operation: operation,
				});
			}
			let uri = operation.response.generatedVideos[0].video.uri;
			const response = await fetch(uri, {
				headers: {
					'x-goog-api-key': apiKey,
				},
			});
			if (!response.ok) {
				const errorBody = await response.json().catch(() => ({}));
				throw new Error(`Error en la petición: ${response.status} ${response.statusText}. Detalles: ${JSON.stringify(errorBody)}`);
			}
			const videoBlob = await response.blob();
			const blobUrl = window.URL.createObjectURL(videoBlob);

			setVideo(blobUrl);
		} catch (error) {
			console.error('Falló la obtención del video:', error);
			return null;
		}
	};

	const handleReset = () => {
		setPersonaje(null);
		setLugar(null);
		setObjeto(null);
		setStory('');
		setImageUrl('');
		setVideo('');
		setLoadingStory(false);
		setLoadingImage(false);
	};

	console.log({ video });

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.6 }}
			style={{
				minHeight: '100vh',
				padding: '40px 24px',
				background: 'linear-gradient(135deg, #fceef5 0%, #d6f8fa 100%)',
			}}
		>
			<motion.div
				initial={{ y: -30, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				transition={{ duration: 0.6 }}
				style={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					gap: 12,
					marginBottom: 32,
				}}
			>
				<motion.img
					src={logo}
					alt='Logo ImaginArte'
					initial={{ scale: 0 }}
					animate={{ scale: 1 }}
					transition={{ type: 'spring', stiffness: 300, damping: 20 }}
					style={{ width: 250, height: 250 }}
				/>
				{/* <motion.h1
					initial={{ scale: 0.8, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					transition={{ duration: 0.6, delay: 0.3 }}
					style={{ color: '#111827', margin: 0 }}
				>
					Cuento Mágico
				</motion.h1> */}
			</motion.div>

			{/* Botón Volver */}
			{story && (
				<motion.button
					whileHover={{ scale: 1.03 }}
					whileTap={{ scale: 0.97 }}
					transition={{ type: 'spring', stiffness: 300, damping: 20 }}
					onClick={handleReset}
					style={{
						marginBottom: 24,
						background: 'transparent',
						border: '2px solid #4f46e5',
						color: '#4f46e5',
						padding: '8px 16px',
						borderRadius: 6,
						cursor: 'pointer',
					}}
				>
					← Volver
				</motion.button>
			)}

			{!story && (
				<>
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
							gap: 16,
						}}
					>
						<SelectField label='Personaje' options={personajes} value={personaje} onChange={setPersonaje} />
						<SelectField label='Lugar' options={lugares} value={lugar} onChange={setLugar} />
						<SelectField label='Objeto' options={objetos} value={objeto} onChange={setObjeto} />

						<motion.button
							whileHover={{ scale: 1.03 }}
							whileTap={{ scale: 0.97 }}
							transition={{ type: 'spring', stiffness: 300, damping: 20 }}
							onClick={handleGenerate}
							disabled={loadingStory || loadingImage}
							style={{
								width: '100%',
								padding: '14px 0',
								background: loadingStory ? 'gray' : '#4f46e5',
								color: '#fff',
								border: 'none',
								borderRadius: 6,
								fontSize: 16,
								cursor: 'pointer',
							}}
						>
							{loadingStory ? 'Generando...' : 'Generar Cuento'}
						</motion.button>
					</motion.div>
				</>
			)}

			{story && (
				<>
					<StoryDisplay story={story} loading={loadingStory} />
					<Illustration imageUrl={imageUrl} loading={loadingImage} />

					{video && (
						<motion.div
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.2 }}
							style={{ marginTop: 24, maxWidth: 600, margin: '24px auto', textAlign: 'center' }}
						>
							<h2>Video:</h2>
							<video
								src={video}
								controls
								style={{
									width: '100%',
									borderRadius: 8,
									boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
								}}
							/>
						</motion.div>
					)}
				</>
			)}
		</motion.div>
	);
}
