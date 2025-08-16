import React, { useState, useEffect } from 'react';
import { checkStableDiffusionAvailability } from '../utils/fallbackImageService';

const StatusIndicator: React.FC = () => {
    const [isConnected, setIsConnected] = useState<boolean | null>(null);
    const [isChecking, setIsChecking] = useState(false);

    const checkConnection = async () => {
        setIsChecking(true);
        try {
            const available = await checkStableDiffusionAvailability();
            setIsConnected(available);
        } catch (error) {
            setIsConnected(false);
        } finally {
            setIsChecking(false);
        }
    };

    useEffect(() => {
        checkConnection();
        // Check connection every 30 seconds
        const interval = setInterval(checkConnection, 30000);
        return () => clearInterval(interval);
    }, []);

    const getStatusColor = () => {
        if (isChecking) return '#ffa500'; // Orange
        if (isConnected === null) return '#gray';
        return isConnected ? '#4caf50' : '#f44336'; // Green or Red
    };

    const getStatusText = () => {
        if (isChecking) return 'Checking...';
        if (isConnected === null) return 'Unknown';
        return isConnected ? 'Connected to Stable Diffusion' : 'Using Demo Mode';
    };

    const getStatusDescription = () => {
        if (isConnected) {
            return 'Local Stable Diffusion is running and ready to generate images.';
        } else {
            return 'Stable Diffusion not detected. Using placeholder generator. See setup guide for installation.';
        }
    };

    return (
        <div style={{
            padding: '10px',
            margin: '10px 0',
            border: '1px solid #ddd',
            borderRadius: '4px',
            backgroundColor: '#f9f9f9'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                <div
                    style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        backgroundColor: getStatusColor(),
                        marginRight: '8px',
                        animation: isChecking ? 'pulse 1s infinite' : 'none'
                    }}
                />
                <strong>{getStatusText()}</strong>
                <button
                    onClick={checkConnection}
                    disabled={isChecking}
                    style={{
                        marginLeft: 'auto',
                        padding: '4px 8px',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        background: 'white',
                        cursor: isChecking ? 'not-allowed' : 'pointer',
                        fontSize: '12px'
                    }}
                >
                    {isChecking ? 'Checking...' : 'Refresh'}
                </button>
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>
                {getStatusDescription()}
            </div>
            {!isConnected && (
                <div style={{ fontSize: '12px', marginTop: '5px' }}>
                    <a 
                        href="/setup-stable-diffusion.md" 
                        target="_blank" 
                        style={{ color: '#007bff', textDecoration: 'none' }}
                    >
                        📖 View Setup Guide
                    </a>
                </div>
            )}
            
            <style jsx>{`
                @keyframes pulse {
                    0% { opacity: 1; }
                    50% { opacity: 0.5; }
                    100% { opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default StatusIndicator;