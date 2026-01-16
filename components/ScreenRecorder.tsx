import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ScreenRecorderProps {
    audioRef: React.RefObject<HTMLAudioElement>;
}

export const ScreenRecorder: React.FC<ScreenRecorderProps> = ({ audioRef }) => {
    const [status, setStatus] = useState<'idle' | 'recording' | 'saving' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<BlobPart[]>([]);




    const startRecording = async () => {
        try {
            setErrorMessage('');

            // Explicitly checking for API support
            if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
                throw new Error("Seu navegador não suporta gravação de tela.");
            }

            // 1. Capture internal audio from the music player
            let audioStream: MediaStream | null = null;
            if (audioRef.current) {
                try {
                    // @ts-ignore - captureStream might be prefixed or experimental
                    const captureStream = audioRef.current.captureStream || audioRef.current.mozCaptureStream;
                    if (captureStream) {
                        audioStream = captureStream.call(audioRef.current);
                    }
                } catch (e) {
                    console.warn("Could not capture internal audio:", e);
                }
            }

            // 2. Capture Screen (Video Only)
            const screenStream = await navigator.mediaDevices.getDisplayMedia({
                video: { displaySurface: 'browser' },
                audio: false, // We use internal audio!
                selfBrowserSurface: "include"
            } as DisplayMediaStreamOptions & { selfBrowserSurface?: string });

            // 3. Combine tracks
            const tracks = [
                ...screenStream.getVideoTracks(),
                ...(audioStream ? audioStream.getAudioTracks() : [])
            ];
            const combinedStream = new MediaStream(tracks);

            // Determine MimeType
            let mimeType = 'video/webm'; // Fallback safer
            if (MediaRecorder.isTypeSupported('video/mp4')) {
                mimeType = 'video/mp4';
            } else if (MediaRecorder.isTypeSupported('video/webm;codecs=vp9')) {
                mimeType = 'video/webm;codecs=vp9';
            }

            const mediaRecorder = new MediaRecorder(combinedStream, { mimeType });
            mediaRecorderRef.current = mediaRecorder;
            chunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    chunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = () => {
                setStatus('saving');
                setTimeout(() => {
                    try {
                        const blob = new Blob(chunksRef.current, { type: mimeType });

                        if (blob.size === 0) {
                            throw new Error("Gravação vazia.");
                        }

                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        const ext = mimeType.includes('mp4') ? 'mp4' : 'webm';
                        a.download = `maura-journey-${new Date().toISOString().slice(0, 10)}.${ext}`;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                    } catch (e) {
                        console.error("Save error:", e);
                        setStatus('error');
                        setErrorMessage("Erro ao salvar o arquivo.");
                        setTimeout(() => setStatus('idle'), 3000);
                        return;
                    }

                    // Cleanup tracks
                    combinedStream.getTracks().forEach(track => track.stop());
                    screenStream.getTracks().forEach(track => track.stop());

                    setStatus('idle');
                }, 1000); // Small delay to show "Saving" state
            };

            mediaRecorder.start();
            setStatus('recording');

            // Handle native stop button
            screenStream.getVideoTracks()[0].onended = () => {
                if (mediaRecorder.state !== 'inactive') {
                    mediaRecorder.stop();
                }
            };

        } catch (err: any) {
            console.error("Error starting recording:", err);
            setStatus('error');

            let message = "Erro ao iniciar gravação.";

            if (err.name === 'NotAllowedError' || err.message === 'Permission denied') {
                message = "Permissão negada. Você precisa selecionar uma tela para compartilhar.";
            } else if (err.name === 'NotFoundError') {
                message = "Nenhum dispositivo de gravação encontrado.";
            } else if (err.name === 'NotReadableError') {
                message = "Erro de hardware ou permissão de sistema.";
            } else {
                // DEBUG: Show actual error
                message = `Erro: ${err.name} - ${err.message}`;
            }

            setErrorMessage(message);
            setTimeout(() => setStatus('idle'), 10000); // Longer timeout to read error
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            mediaRecorderRef.current.stop();
        }
    };

    return (
        <>
            {/* Main Button */}
            <div className="relative group z-[9999]">
                <button
                    onClick={status === 'recording' ? stopRecording : startRecording}
                    disabled={status === 'saving'}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-sm ${status === 'recording'
                        ? 'bg-red-500 text-white animate-pulse'
                        : status === 'saving'
                            ? 'bg-yellow-500 text-white cursor-wait'
                            : status === 'error'
                                ? 'bg-red-600 text-white'
                                : 'bg-white/80 dark:bg-black/40 backdrop-blur-sm border border-gray-200 dark:border-gray-700 hover:bg-white text-primary-dark dark:text-white group-hover:scale-105'
                        }`}
                    title={status === 'recording' ? "Parar e Salvar Vídeo" : "Gravar Vídeo"}
                >
                    <span className="material-symbols-outlined text-xl">
                        {status === 'recording' ? 'save'
                            : status === 'saving' ? 'hourglass_empty'
                                : status === 'error' ? 'error'
                                    : 'videocam'}
                    </span>
                </button>
            </div>



            {/* Status Messages / Toasts */}
            <AnimatePresence>
                {(status === 'saving' || status === 'error') && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, x: '-50%' }}
                        animate={{ opacity: 1, y: 0, x: '-50%' }}
                        exit={{ opacity: 0, y: 20, x: '-50%' }}
                        className={`fixed bottom-10 left-1/2 z-[10000] px-6 py-3 rounded-lg shadow-2xl backdrop-blur-md flex items-center gap-3 ${status === 'error' ? 'bg-red-500/90 text-white' : 'bg-zinc-900/90 text-white'
                            }`}
                    >
                        {status === 'saving' && (
                            <>
                                <span className="material-symbols-outlined animate-spin text-xl">progress_activity</span>
                                <span className="font-medium">Processando e Salvando Vídeo...</span>
                            </>
                        )}
                        {status === 'error' && (
                            <>
                                <span className="material-symbols-outlined text-xl">warning</span>
                                <span className="font-medium">{errorMessage}</span>
                            </>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};
