import React from 'react';
import ImageGenerator from '../components/ImageGenerator';
import StatusIndicator from '../components/StatusIndicator';

const Home: React.FC = () => {
  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h1 style={{ color: '#333', marginBottom: '10px' }}>
          🎨 HIBBI Fast Image Generator
        </h1>
        <p style={{ color: '#666', fontSize: '16px' }}>
          Generate AI images using local Stable Diffusion or demo mode
        </p>
      </div>
      
      <StatusIndicator />
      <ImageGenerator />
      
      <div style={{ 
        marginTop: '40px', 
        padding: '20px', 
        backgroundColor: '#f8f9fa', 
        borderRadius: '8px',
        border: '1px solid #e9ecef'
      }}>
        <h3 style={{ marginTop: '0', color: '#495057' }}>🚀 Getting Started</h3>
        <ul style={{ color: '#6c757d', lineHeight: '1.6' }}>
          <li><strong>Demo Mode:</strong> Works immediately with placeholder images</li>
          <li><strong>Full Mode:</strong> Install local Stable Diffusion for real AI generation</li>
          <li><strong>Advanced:</strong> Use API keys for cloud services (OpenAI, Hugging Face)</li>
        </ul>
        
        <h3 style={{ color: '#495057' }}>⚡ Features</h3>
        <ul style={{ color: '#6c757d', lineHeight: '1.6' }}>
          <li>Real-time image generation with Stable Diffusion</li>
          <li>Advanced parameter controls (steps, CFG scale, samplers)</li>
          <li>Multiple size presets and custom dimensions</li>
          <li>Negative prompts for better control</li>
          <li>Download generated images</li>
          <li>Automatic fallback to demo mode</li>
        </ul>
      </div>
    </div>
  );
};

export default Home;