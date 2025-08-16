// Service API optimisé pour Vercel et production avec authentification
import { supabase, history } from '../lib/supabase';

export interface ImageGenerationParams {
  prompt: string;
  negative_prompt?: string;
  width?: number;
  height?: number;
  steps?: number;
  cfg_scale?: number;
  sampler_name?: string;
  seed?: number;
  batch_size?: number;
  userId?: string; // Ajout de l'ID utilisateur
}

export interface ImageGenerationResponse {
  images: string[];
  parameters: any;
  info: string;
}

export class APIService {
  private static instance: APIService;
  private baseUrl: string;
  private isProduction: boolean;

  private constructor() {
    this.isProduction = process.env.NODE_ENV === 'production';
    this.baseUrl = this.isProduction 
      ? '/api/sd' // Proxy Vercel
      : process.env.STABLE_DIFFUSION_URL || 'http://127.0.0.1:7860/sdapi/v1';
  }

  public static getInstance(): APIService {
    if (!APIService.instance) {
      APIService.instance = new APIService();
    }
    return APIService.instance;
  }

  // Vérifier la disponibilité de Stable Diffusion
  async checkAvailability(): Promise<boolean> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);

      const response = await fetch(`${this.baseUrl}/samplers`, {
        method: 'GET',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      clearTimeout(timeoutId);
      return response.ok;
    } catch (error) {
      console.log('Stable Diffusion non disponible, utilisation du mode démo');
      return false;
    }
  }

  // Générer une image avec Stable Diffusion et gestion des crédits
  async generateImage(params: ImageGenerationParams): Promise<ImageGenerationResponse> {
    const isAvailable = await this.checkAvailability();
    
    if (!isAvailable) {
      // Mode démo avec placeholder intelligent
      const result = await this.generateDemoImage(params);
      
      // Sauvegarder dans l'historique si utilisateur connecté
      if (params.userId && result.images.length > 0) {
        await this.saveToHistory(params, result.images[0]);
      }
      
      return result;
    }

    try {
      const response = await fetch(`${this.baseUrl}/txt2img`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: params.prompt,
          negative_prompt: params.negative_prompt || 'blurry, low quality, distorted',
          width: params.width || 512,
          height: params.height || 512,
          steps: params.steps || 20,
          cfg_scale: params.cfg_scale || 7,
          sampler_name: params.sampler_name || 'Euler a',
          seed: params.seed || -1,
          batch_size: params.batch_size || 1,
          restore_faces: true,
          tiling: false,
          do_not_save_samples: true,
          do_not_save_grid: true,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Sauvegarder dans l'historique si utilisateur connecté
      if (params.userId && data.images && data.images.length > 0) {
        await this.saveToHistory(params, data.images[0]);
      }
      
      return data;
    } catch (error) {
      console.error('Erreur génération image:', error);
      // Fallback vers le mode démo
      const result = await this.generateDemoImage(params);
      
      // Sauvegarder dans l'historique si utilisateur connecté
      if (params.userId && result.images.length > 0) {
        await this.saveToHistory(params, result.images[0]);
      }
      
      return result;
    }
  }

  // Sauvegarder dans l'historique
  private async saveToHistory(params: ImageGenerationParams, imageBase64: string): Promise<void> {
    if (!params.userId) return;

    try {
      const imageUrl = `data:image/png;base64,${imageBase64}`;
      await history.addGeneration(
        params.userId,
        params.prompt,
        imageUrl,
        {
          width: params.width || 512,
          height: params.height || 512,
          steps: params.steps || 20,
          cfg_scale: params.cfg_scale || 7,
          sampler_name: params.sampler_name || 'Euler a',
          negative_prompt: params.negative_prompt
        },
        1 // 1 crédit utilisé
      );
    } catch (error) {
      console.error('Erreur sauvegarde historique:', error);
    }
  }

  // Générer une image de démonstration
  private async generateDemoImage(params: ImageGenerationParams): Promise<ImageGenerationResponse> {
    const { width = 512, height = 512 } = params;
    
    // Créer un canvas pour générer un placeholder intelligent
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d')!;

    // Analyser le prompt pour choisir les couleurs et le style
    const prompt = params.prompt.toLowerCase();
    const colors = this.getColorsFromPrompt(prompt);
    const style = this.getStyleFromPrompt(prompt);

    // Dessiner le placeholder
    this.drawIntelligentPlaceholder(ctx, width, height, colors, style, params.prompt);

    // Convertir en base64
    const base64 = canvas.toDataURL('image/png').split(',')[1];

    return {
      images: [base64],
      parameters: params,
      info: `Mode démo - Placeholder généré pour: "${params.prompt}"`
    };
  }

  // Analyser le prompt pour déterminer les couleurs
  private getColorsFromPrompt(prompt: string): string[] {
    const colorMap: { [key: string]: string[] } = {
      'fire': ['#ff4444', '#ff8800', '#ffaa00'],
      'water': ['#0088ff', '#00aaff', '#44ccff'],
      'forest': ['#228833', '#44aa44', '#66cc66'],
      'night': ['#1a1a2e', '#16213e', '#0f3460'],
      'sunset': ['#ff6b6b', '#ffa726', '#ffcc02'],
      'cyberpunk': ['#00ffff', '#ff00ff', '#ffff00'],
      'manga': ['#333333', '#666666', '#999999'],
      'anime': ['#ff69b4', '#87ceeb', '#98fb98'],
      'action': ['#ff0000', '#ff4500', '#ffa500'],
      'romance': ['#ffb6c1', '#ffc0cb', '#ffe4e1'],
    };

    for (const [key, colors] of Object.entries(colorMap)) {
      if (prompt.includes(key)) {
        return colors;
      }
    }

    // Couleurs par défaut
    return ['#667eea', '#764ba2', '#f093fb'];
  }

  // Analyser le prompt pour déterminer le style
  private getStyleFromPrompt(prompt: string): string {
    if (prompt.includes('manga') || prompt.includes('anime')) return 'manga';
    if (prompt.includes('cyberpunk') || prompt.includes('sci-fi')) return 'cyberpunk';
    if (prompt.includes('fantasy') || prompt.includes('magic')) return 'fantasy';
    if (prompt.includes('realistic') || prompt.includes('photo')) return 'realistic';
    return 'artistic';
  }

  // Dessiner un placeholder intelligent
  private drawIntelligentPlaceholder(
    ctx: CanvasRenderingContext2D, 
    width: number, 
    height: number, 
    colors: string[], 
    style: string, 
    prompt: string
  ) {
    // Fond dégradé
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, colors[0]);
    gradient.addColorStop(0.5, colors[1]);
    gradient.addColorStop(1, colors[2]);
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Ajouter des formes selon le style
    this.addStyleElements(ctx, width, height, style, colors);

    // Ajouter le texte du prompt
    this.addPromptText(ctx, width, height, prompt);

    // Ajouter le logo HIBBI4
    this.addDemoWatermark(ctx, width, height);
  }

  // Ajouter des éléments selon le style
  private addStyleElements(ctx: CanvasRenderingContext2D, width: number, height: number, style: string, colors: string[]) {
    ctx.globalAlpha = 0.3;

    switch (style) {
      case 'manga':
        // Lignes de vitesse
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        for (let i = 0; i < 10; i++) {
          ctx.beginPath();
          ctx.moveTo(width * 0.1, height * (0.1 + i * 0.08));
          ctx.lineTo(width * 0.9, height * (0.15 + i * 0.08));
          ctx.stroke();
        }
        break;

      case 'cyberpunk':
        // Grille cyberpunk
        ctx.strokeStyle = colors[0];
        ctx.lineWidth = 1;
        for (let i = 0; i < width; i += 20) {
          ctx.beginPath();
          ctx.moveTo(i, 0);
          ctx.lineTo(i, height);
          ctx.stroke();
        }
        for (let i = 0; i < height; i += 20) {
          ctx.beginPath();
          ctx.moveTo(0, i);
          ctx.lineTo(width, i);
          ctx.stroke();
        }
        break;

      case 'fantasy':
        // Particules magiques
        ctx.fillStyle = '#ffffff';
        for (let i = 0; i < 20; i++) {
          const x = Math.random() * width;
          const y = Math.random() * height;
          const size = Math.random() * 4 + 1;
          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fill();
        }
        break;

      default:
        // Formes géométriques artistiques
        ctx.fillStyle = colors[1];
        for (let i = 0; i < 5; i++) {
          const x = Math.random() * width;
          const y = Math.random() * height;
          const size = Math.random() * 50 + 20;
          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fill();
        }
        break;
    }

    ctx.globalAlpha = 1;
  }

  // Ajouter le texte du prompt
  private addPromptText(ctx: CanvasRenderingContext2D, width: number, height: number, prompt: string) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Découper le prompt en lignes
    const words = prompt.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    for (const word of words) {
      const testLine = currentLine + (currentLine ? ' ' : '') + word;
      const metrics = ctx.measureText(testLine);
      
      if (metrics.width > width * 0.8 && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine) lines.push(currentLine);

    // Dessiner les lignes
    const lineHeight = 20;
    const startY = height / 2 - (lines.length * lineHeight) / 2;

    lines.forEach((line, index) => {
      ctx.fillText(line, width / 2, startY + index * lineHeight);
    });
  }

  // Ajouter le watermark de démo
  private addDemoWatermark(ctx: CanvasRenderingContext2D, width: number, height: number) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, height - 30, width, 30);

    ctx.fillStyle = '#00bcd4';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('HIBBI4 - Mode Démo', width / 2, height - 15);
  }

  // Obtenir les samplers disponibles
  async getSamplers(): Promise<string[]> {
    try {
      const isAvailable = await this.checkAvailability();
      if (!isAvailable) {
        return ['Euler a', 'DPM++ 2M Karras', 'DDIM'];
      }

      const response = await fetch(`${this.baseUrl}/samplers`);
      const data = await response.json();
      return data.map((sampler: any) => sampler.name);
    } catch (error) {
      return ['Euler a', 'DPM++ 2M Karras', 'DDIM'];
    }
  }

  // Obtenir les modèles disponibles
  async getModels(): Promise<string[]> {
    try {
      const isAvailable = await this.checkAvailability();
      if (!isAvailable) {
        return ['stable-diffusion-v1-5', 'anything-v4.5'];
      }

      const response = await fetch(`${this.baseUrl}/sd-models`);
      const data = await response.json();
      return data.map((model: any) => model.title);
    } catch (error) {
      return ['stable-diffusion-v1-5', 'anything-v4.5'];
    }
  }
}

// Instance singleton
export const apiService = APIService.getInstance();