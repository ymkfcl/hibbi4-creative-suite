// Fallback image generation service for when local Stable Diffusion is not available

export interface FallbackImageParams {
    prompt: string;
    width?: number;
    height?: number;
}

// Simple placeholder image generator
export const generatePlaceholderImage = async (params: FallbackImageParams): Promise<string> => {
    const { prompt, width = 512, height = 512 } = params;
    
    // Create a canvas to generate a placeholder image
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
        throw new Error('Could not create canvas context');
    }
    
    // Generate a gradient background based on prompt hash
    const hash = hashString(prompt);
    const color1 = `hsl(${hash % 360}, 70%, 60%)`;
    const color2 = `hsl(${(hash + 180) % 360}, 70%, 40%)`;
    
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, color1);
    gradient.addColorStop(1, color2);
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    // Add text overlay
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Word wrap the prompt
    const words = prompt.split(' ');
    const lines = [];
    let currentLine = '';
    
    for (const word of words) {
        const testLine = currentLine + (currentLine ? ' ' : '') + word;
        const metrics = ctx.measureText(testLine);
        
        if (metrics.width > width - 40 && currentLine) {
            lines.push(currentLine);
            currentLine = word;
        } else {
            currentLine = testLine;
        }
    }
    if (currentLine) {
        lines.push(currentLine);
    }
    
    // Draw the text lines
    const lineHeight = 30;
    const startY = height / 2 - (lines.length - 1) * lineHeight / 2;
    
    lines.forEach((line, index) => {
        ctx.fillText(line, width / 2, startY + index * lineHeight);
    });
    
    // Add "DEMO MODE" watermark
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.font = '16px Arial';
    ctx.fillText('DEMO MODE - Install Stable Diffusion for real generation', width / 2, height - 20);
    
    return canvas.toDataURL('image/png');
};

// Simple string hash function
function hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
}

// Check if local Stable Diffusion is available
export const checkStableDiffusionAvailability = async (): Promise<boolean> => {
    try {
        const response = await fetch('http://127.0.0.1:7860/sdapi/v1/samplers', {
            method: 'GET',
            signal: AbortSignal.timeout(5000) // 5 second timeout
        });
        return response.ok;
    } catch (error) {
        return false;
    }
};

// Alternative API services (require API keys)
export const generateWithHuggingFace = async (params: FallbackImageParams, apiKey: string): Promise<string> => {
    const response = await fetch(
        "https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5",
        {
            headers: {
                Authorization: `Bearer ${apiKey}`,
                "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify({
                inputs: params.prompt,
                parameters: {
                    width: params.width || 512,
                    height: params.height || 512,
                }
            }),
        }
    );
    
    if (!response.ok) {
        throw new Error(`Hugging Face API error: ${response.status}`);
    }
    
    const blob = await response.blob();
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
    });
};

export const generateWithOpenAI = async (params: FallbackImageParams, apiKey: string): Promise<string> => {
    const response = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            prompt: params.prompt,
            n: 1,
            size: `${params.width || 512}x${params.height || 512}`,
            response_format: 'url'
        }),
    });
    
    if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data[0].url;
};