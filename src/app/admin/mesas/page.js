'use client';

import { useState } from 'react';
import { generateTableQR } from '@/utils/qrGenerador';

export default function MesasPage(){
    const [mesaId, setMesaId] = useState('');
    const [qrCode, setQrCode] = useState('');
  
    const handleGenerate = async () => {
        if (!mesaId) return;
        
        const qrDataUrl = await generateTableQR(mesaId);
        if (qrDataUrl) {
        setQrCode(qrDataUrl);
        }
    };
    
    return (
        <div className="p-4 border rounded">
        <h2 className="text-xl mb-4">Generador de Códigos QR para Mesas</h2>
        
        <div className="mb-4">
            <label className="block mb-1">Número de Mesa</label>
            <input
            id="mesaId"
            type="text"
            value={mesaId}
            onChange={(e) => setMesaId(e.target.value)}
            className="border p-2 rounded w-full"
            placeholder="Ej: 15"
            />
        </div>
        
        <button
            onClick={handleGenerate}
            className="bg-blue-500 text-white px-4 py-2 rounded"
        >
            Generar QR
        </button>
        
        {qrCode && (
            <div className="mt-4">
            <h3 className="mb-2">QR para Mesa #{mesaId}</h3>
            <img src={qrCode} alt={`QR para Mesa ${mesaId}`} />
            <a 
                href={qrCode} 
                download={`qr-mesa-${mesaId}.png`}
                className="block mt-2 text-blue-500"
            >
                Descargar QR
            </a>
            </div>
        )}
        </div>
    );
}