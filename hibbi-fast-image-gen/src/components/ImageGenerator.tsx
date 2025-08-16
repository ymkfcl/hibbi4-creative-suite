import React, { useState } from 'react';

interface GenerationParams {
    prompt: string;
    negative_prompt: string;
    width: number;
    height: number;
    steps: number;
    cfg_scale: number;
    sampler_name: string;
}

const ImageGenerator: React.FC = () => {
    const [params, setParams] = useState<GenerationParams>({
        prompt: '',
        negative_prompt: 'blurry, bad quality, distorted, ugly, deformed',
        width: 512,
        height: 512,
        steps: 20,
        cfg_scale: 7,
        sampler_name: 'Euler a'
    });
    const [imageUrl, setImageUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showAdvanced, setShowAdvanced] = useState(false);

    const samplers = [
        'Euler a', 'Euler', 'LMS', 'Heun', 'DPM2', 'DPM2 a', 
        'DPM++ 2S a', 'DPM++ 2M', 'DPM++ SDE', 'DPM fast', 'DPM adaptive'
    ];

    const presetSizes = [
        { name: 'Square', width: 512, height: 512 },
        { name: 'Portrait', width: 512, height: 768 },
        { name: 'Landscape', width: 768, height: 512 },
        { name: 'HD Portrait', width: 768, height: 1024 },
        { name: 'HD Landscape', width: 1024, height: 768 }
    ];

    const handleGenerateImage = async () => {
        if (!params.prompt.trim()) {
            setError('Please enter a prompt');
            return;
        }

        setLoading(true);
        setError('');
        setImageUrl('');

        try {
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(params),
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.details || data.error || 'Generation failed');
            }

            if (data.success && data.imageUrl) {
                setImageUrl(data.imageUrl);
            } else {
                throw new Error('No image received from server');
            }
        } catch (error) {
            console.error('Error generating image:', error);
            setError(error instanceof Error ? error.message : 'Unknown error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleParamChange = (key: keyof GenerationParams, value: string | number) => {
        setParams(prev => ({ ...prev, [key]: value }));
    };

    const handleSizePreset = (width: number, height: number) => {
        setParams(prev => ({ ...prev, width, height }));
    };

    const downloadImage = () => {
        if (!imageUrl) return;
        
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = `generated-image-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                {/* Left Panel - Controls */}
                <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
                    <h2>Image Generation Controls</h2>
                    
                    {/* Prompt */}
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                            Prompt *
                        </label>
                        <textarea
                            value={params.prompt}
                            onChange={(e) => handleParamChange('prompt', e.target.value)}
                            placeholder="Describe the image you want to generate..."
                            style={{ 
                                width: '100%', 
                                height: '80px', 
                                padding: '8px', 
                                border: '1px solid #ccc', 
                                borderRadius: '4px',
                                resize: 'vertical'
                            }}
                        />
                    </div>

                    {/* Size Presets */}
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                            Size Presets
                        </label>
                        <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                            {presetSizes.map((preset) => (
                                <button
                                    key={preset.name}
                                    onClick={() => handleSizePreset(preset.width, preset.height)}
                                    style={{
                                        padding: '5px 10px',
                                        border: '1px solid #ccc',
                                        borderRadius: '4px',
                                        background: params.width === preset.width && params.height === preset.height ? '#007bff' : 'white',
                                        color: params.width === preset.width && params.height === preset.height ? 'white' : 'black',
                                        cursor: 'pointer',
                                        fontSize: '12px'
                                    }}
                                >
                                    {preset.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Advanced Settings Toggle */}
                    <button
                        onClick={() => setShowAdvanced(!showAdvanced)}
                        style={{
                            marginBottom: '15px',
                            padding: '8px 16px',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                            background: 'white',
                            cursor: 'pointer'
                        }}
                    >
                        {showAdvanced ? 'Hide' : 'Show'} Advanced Settings
                    </button>

                    {/* Advanced Settings */}
                    {showAdvanced && (
                        <div style={{ border: '1px solid #eee', padding: '15px', borderRadius: '4px', marginBottom: '15px' }}>
                            {/* Negative Prompt */}
                            <div style={{ marginBottom: '10px' }}>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                                    Negative Prompt
                                </label>
                                <textarea
                                    value={params.negative_prompt}
                                    onChange={(e) => handleParamChange('negative_prompt', e.target.value)}
                                    placeholder="What you don't want in the image..."
                                    style={{ 
                                        width: '100%', 
                                        height: '60px', 
                                        padding: '8px', 
                                        border: '1px solid #ccc', 
                                        borderRadius: '4px',
                                        resize: 'vertical'
                                    }}
                                />
                            </div>

                            {/* Dimensions */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                                        Width
                                    </label>
                                    <input
                                        type="number"
                                        value={params.width}
                                        onChange={(e) => handleParamChange('width', parseInt(e.target.value) || 512)}
                                        min="64"
                                        max="2048"
                                        step="64"
                                        style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                                        Height
                                    </label>
                                    <input
                                        type="number"
                                        value={params.height}
                                        onChange={(e) => handleParamChange('height', parseInt(e.target.value) || 512)}
                                        min="64"
                                        max="2048"
                                        step="64"
                                        style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                                    />
                                </div>
                            </div>

                            {/* Steps and CFG Scale */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                                        Steps ({params.steps})
                                    </label>
                                    <input
                                        type="range"
                                        value={params.steps}
                                        onChange={(e) => handleParamChange('steps', parseInt(e.target.value))}
                                        min="1"
                                        max="150"
                                        style={{ width: '100%' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                                        CFG Scale ({params.cfg_scale})
                                    </label>
                                    <input
                                        type="range"
                                        value={params.cfg_scale}
                                        onChange={(e) => handleParamChange('cfg_scale', parseFloat(e.target.value))}
                                        min="1"
                                        max="30"
                                        step="0.5"
                                        style={{ width: '100%' }}
                                    />
                                </div>
                            </div>

                            {/* Sampler */}
                            <div>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                                    Sampler
                                </label>
                                <select
                                    value={params.sampler_name}
                                    onChange={(e) => handleParamChange('sampler_name', e.target.value)}
                                    style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                                >
                                    {samplers.map(sampler => (
                                        <option key={sampler} value={sampler}>{sampler}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    )}

                    {/* Generate Button */}
                    <button
                        onClick={handleGenerateImage}
                        disabled={loading || !params.prompt.trim()}
                        style={{
                            width: '100%',
                            padding: '12px',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            border: 'none',
                            borderRadius: '4px',
                            background: loading || !params.prompt.trim() ? '#ccc' : '#007bff',
                            color: 'white',
                            cursor: loading || !params.prompt.trim() ? 'not-allowed' : 'pointer',
                            marginBottom: '10px'
                        }}
                    >
                        {loading ? 'Generating...' : 'Generate Image'}
                    </button>

                    {/* Error Display */}
                    {error && (
                        <div style={{
                            padding: '10px',
                            background: '#ffebee',
                            border: '1px solid #f44336',
                            borderRadius: '4px',
                            color: '#d32f2f',
                            marginBottom: '10px'
                        }}>
                            <strong>Error:</strong> {error}
                        </div>
                    )}

                    {/* Loading Progress */}
                    {loading && (
                        <div style={{
                            padding: '10px',
                            background: '#e3f2fd',
                            border: '1px solid #2196f3',
                            borderRadius: '4px',
                            color: '#1976d2'
                        }}>
                            Generating image... This may take a few moments.
                        </div>
                    )}
                </div>

                {/* Right Panel - Generated Image */}
                <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
                    <h2>Generated Image</h2>
                    {imageUrl ? (
                        <div>
                            <img 
                                src={imageUrl} 
                                alt="Generated" 
                                style={{ 
                                    maxWidth: '100%', 
                                    height: 'auto', 
                                    border: '1px solid #ddd', 
                                    borderRadius: '4px',
                                    marginBottom: '10px'
                                }} 
                            />
                            <button
                                onClick={downloadImage}
                                style={{
                                    padding: '8px 16px',
                                    border: '1px solid #007bff',
                                    borderRadius: '4px',
                                    background: '#007bff',
                                    color: 'white',
                                    cursor: 'pointer'
                                }}
                            >
                                Download Image
                            </button>
                        </div>
                    ) : (
                        <div style={{
                            height: '400px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '2px dashed #ddd',
                            borderRadius: '4px',
                            color: '#666'
                        }}>
                            {loading ? 'Generating...' : 'Generated image will appear here'}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ImageGenerator;