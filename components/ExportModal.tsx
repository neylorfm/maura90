import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ExportModalProps {
    isOpen: boolean;
    onClose: () => void;
    code: string;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, code }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy', err);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 md:p-8"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    className="bg-white dark:bg-zinc-900 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden border border-zinc-200 dark:border-zinc-800"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center bg-zinc-50 dark:bg-zinc-900/50">
                        <div>
                            <h2 className="text-2xl font-bold font-display text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">save</span>
                                Salvar Configuração
                            </h2>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                                Para tornar suas alterações permanentes, copie o código abaixo e substitua o conteúdo do arquivo <code className="bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-xs font-mono text-primary-dark dark:text-primary">constants.ts</code>.
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-full transition-colors"
                        >
                            <span className="material-symbols-outlined text-zinc-500">close</span>
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-hidden relative">
                        <div className="absolute top-4 right-8 z-10">
                            <button
                                onClick={handleCopy}
                                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg shadow-lg transition-all text-sm font-medium
                  ${copied
                                        ? 'bg-green-500 text-white'
                                        : 'bg-primary text-primary-dark hover:bg-primary/90'}
                `}
                            >
                                <span className="material-symbols-outlined text-lg">
                                    {copied ? 'check' : 'content_copy'}
                                </span>
                                {copied ? 'Copiado!' : 'Copiar Código'}
                            </button>
                        </div>
                        <pre className="w-full h-full p-6 overflow-auto text-sm font-mono bg-zinc-50 dark:bg-[#1e1e1e] text-zinc-800 dark:text-zinc-300 pointer-events-auto select-all">
                            <code>{code}</code>
                        </pre>
                    </div>

                    {/* Footer */}
                    <div className="p-6 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 flex justify-end gap-3">
                        <button
                            onClick={onClose}
                            className="px-6 py-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition-colors font-medium"
                        >
                            Fechar
                        </button>
                        <button
                            onClick={handleCopy}
                            className="px-6 py-2.5 rounded-lg bg-primary text-primary-dark font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
                        >
                            {copied ? 'Copiado para Área de Transferência' : 'Copiar Código'}
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};
