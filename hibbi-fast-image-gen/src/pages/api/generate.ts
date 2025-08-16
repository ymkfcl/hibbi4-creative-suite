import type { NextApiRequest, NextApiResponse } from 'next';
import { generateImage, ImageGenerationParams } from '../../utils/imageUtils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { 
            prompt, 
            width, 
            height, 
            steps, 
            cfg_scale, 
            sampler_name, 
            negative_prompt 
        } = req.body;

        if (!prompt || typeof prompt !== 'string' || prompt.trim() === '') {
            return res.status(400).json({ error: 'Valid prompt is required' });
        }

        try {
            const params: ImageGenerationParams = {
                prompt: prompt.trim(),
                ...(width && { width: parseInt(width) }),
                ...(height && { height: parseInt(height) }),
                ...(steps && { steps: parseInt(steps) }),
                ...(cfg_scale && { cfg_scale: parseFloat(cfg_scale) }),
                ...(sampler_name && { sampler_name }),
                ...(negative_prompt && { negative_prompt })
            };

            const imageUrl = await generateImage(params);
            return res.status(200).json({ imageUrl, success: true });
        } catch (error) {
            console.error('API Error:', error);
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            return res.status(500).json({ 
                error: 'Image generation failed', 
                details: errorMessage,
                success: false 
            });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}