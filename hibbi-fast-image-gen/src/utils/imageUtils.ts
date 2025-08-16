import { checkStableDiffusionAvailability, generatePlaceholderImage } from './fallbackImageService';

export interface ImageGenerationParams {
    prompt: string;
    width?: number;
    height?: number;
    steps?: number;
    cfg_scale?: number;
    sampler_name?: string;
    negative_prompt?: string;
}

export const generateImage = async (params: ImageGenerationParams): Promise<string> => {
    // Default parameters for Stable Diffusion
    const defaultParams = {
        width: 512,
        height: 512,
        steps: 20,
        cfg_scale: 7,
        sampler_name: "Euler a",
        negative_prompt: "blurry, bad quality, distorted",
        ...params
    };

    try {
        // First, check if local Stable Diffusion is available
        const isStableDiffusionAvailable = await checkStableDiffusionAvailability();
        
        if (!isStableDiffusionAvailable) {
            console.warn('Local Stable Diffusion not available, using fallback placeholder generator');
            return await generatePlaceholderImage({
                prompt: params.prompt,
                width: params.width,
                height: params.height
            });
        }

        // Using AUTOMATIC1111 WebUI API (default local setup)
        const response = await fetch('http://127.0.0.1:7860/sdapi/v1/txt2img', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(defaultParams),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        // AUTOMATIC1111 returns base64 encoded images
        if (data.images && data.images.length > 0) {
            return `data:image/png;base64,${data.images[0]}`;
        } else {
            throw new Error('No image generated');
        }
    } catch (error) {
        console.error('Error in generateImage:', error);
        
        // If Stable Diffusion fails, try fallback
        try {
            console.warn('Stable Diffusion failed, using fallback placeholder generator');
            return await generatePlaceholderImage({
                prompt: params.prompt,
                width: params.width,
                height: params.height
            });
        } catch (fallbackError) {
            throw new Error(`Image generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
};

// Utility function to get available samplers from Stable Diffusion
export const getAvailableSamplers = async (): Promise<string[]> => {
    try {
        const response = await fetch('http://127.0.0.1:7860/sdapi/v1/samplers');
        if (response.ok) {
            const samplers = await response.json();
            return samplers.map((s: any) => s.name);
        }
    } catch (error) {
        console.warn('Could not fetch samplers from Stable Diffusion');
    }
    
    // Return default samplers if API is not available
    return [
        'Euler a', 'Euler', 'LMS', 'Heun', 'DPM2', 'DPM2 a', 
        'DPM++ 2S a', 'DPM++ 2M', 'DPM++ SDE', 'DPM fast', 'DPM adaptive'
    ];
};

// Utility function to get available models from Stable Diffusion
export const getAvailableModels = async (): Promise<string[]> => {
    try {
        const response = await fetch('http://127.0.0.1:7860/sdapi/v1/sd-models');
        if (response.ok) {
            const models = await response.json();
            return models.map((m: any) => m.title);
        }
    } catch (error) {
        console.warn('Could not fetch models from Stable Diffusion');
    }
    
    return ['Default Model'];
};