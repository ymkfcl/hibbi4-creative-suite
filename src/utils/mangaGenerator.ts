// Utilitaires pour la génération de manga optimisés pour Vercel

import { GenerationParams, Character, MangaStyle } from '../types/manga';
import { apiService } from './apiService';

export class MangaImageGenerator {
  /**
   * Génère une image pour un panel de manga
   */
  async generatePanelImage(params: GenerationParams): Promise<string> {
    const enhancedPrompt = this.enhancePromptForManga(params);
    
    try {
      const result = await apiService.generateImage({
        prompt: enhancedPrompt,
        negative_prompt: this.getMangaNegativePrompt(params.negativePrompt),
        width: params.width,
        height: params.height,
        steps: 25,
        cfg_scale: 8,
        sampler_name: "DPM++ 2M Karras"
      });

      if (result.images && result.images.length > 0) {
        return `data:image/png;base64,${result.images[0]}`;
      } else {
        throw new Error('Aucune image générée');
      }
    } catch (error) {
      console.error('Erreur génération image manga:', error);
      // Fallback vers une image placeholder
      return this.generatePlaceholderImage(params);
    }
  }

  /**
   * Améliore le prompt pour la génération de manga
   */
  private enhancePromptForManga(params: GenerationParams): string {
    let prompt = params.prompt;
    
    // Ajouter le style manga si pas déjà présent
    if (!prompt.toLowerCase().includes('manga') && !prompt.toLowerCase().includes('anime')) {
      prompt += ', manga style';
    }
    
    // Ajouter des termes de qualité
    const qualityTerms = [
      'high quality',
      'detailed',
      'professional artwork',
      'clean lines'
    ];
    
    // Ajouter le style spécifique selon le type
    if (params.style) {
      switch (params.style.artStyle) {
        case 'shonen':
          prompt += ', dynamic action, bold lines, high contrast';
          break;
        case 'shoujo':
          prompt += ', soft lines, delicate features, romantic atmosphere';
          break;
        case 'seinen':
          prompt += ', realistic proportions, detailed shading, mature themes';
          break;
        case 'josei':
          prompt += ', elegant style, sophisticated atmosphere, realistic emotions';
          break;
      }
    }
    
    // Ajouter les personnages si spécifiés
    if (params.characters && params.characters.length > 0) {
      const characterDescriptions = params.characters.map(char => 
        this.getCharacterDescription(char)
      ).join(', ');
      prompt = `${characterDescriptions}, ${prompt}`;
    }
    
    // Ajouter les termes de qualité
    prompt += ', ' + qualityTerms.join(', ');
    
    return prompt;
  }

  /**
   * Génère le prompt négatif pour manga
   */
  private getMangaNegativePrompt(customNegative?: string): string {
    const baseMangaNegative = [
      'blurry',
      'low quality',
      'distorted',
      'ugly',
      'bad anatomy',
      'bad hands',
      'text',
      'watermark',
      'signature',
      'worst quality',
      'low res',
      'extra limbs',
      'missing limbs',
      'floating limbs',
      'disconnected limbs',
      'malformed hands',
      'poorly drawn hands',
      'mutated hands',
      'deformed',
      'poorly drawn face',
      'mutation',
      'deformed face',
      'ugly face',
      'bad proportions',
      'extra arms',
      'extra legs',
      'bad legs',
      'error legs',
      'bad feet'
    ];
    
    let negativePrompt = baseMangaNegative.join(', ');
    
    if (customNegative) {
      negativePrompt += ', ' + customNegative;
    }
    
    return negativePrompt;
  }

  /**
   * Génère une description de personnage pour le prompt
   */
  private getCharacterDescription(character: Character): string {
    let description = character.name;
    
    if (character.appearance) {
      description += ` (${character.appearance})`;
    }
    
    if (character.personality) {
      // Convertir la personnalité en termes visuels
      const personalityToVisual: { [key: string]: string } = {
        'confident': 'confident expression',
        'shy': 'shy expression, blushing',
        'angry': 'angry expression, frowning',
        'happy': 'smiling, cheerful expression',
        'sad': 'sad expression, tears',
        'mysterious': 'mysterious aura, shadowed face',
        'energetic': 'dynamic pose, excited expression',
        'calm': 'serene expression, peaceful'
      };
      
      const visualTraits = character.personality
        .split(',')
        .map(trait => personalityToVisual[trait.trim().toLowerCase()])
        .filter(Boolean)
        .join(', ');
      
      if (visualTraits) {
        description += `, ${visualTraits}`;
      }
    }
    
    return description;
  }

  /**
   * Génère une image placeholder intelligente
   */
  private generatePlaceholderImage(params: GenerationParams): string {
    // Créer un canvas pour le placeholder
    const canvas = document.createElement('canvas');
    canvas.width = params.width;
    canvas.height = params.height;
    const ctx = canvas.getContext('2d')!;

    // Couleurs basées sur le style manga
    const colors = this.getMangaColors(params.style);
    
    // Fond dégradé
    const gradient = ctx.createLinearGradient(0, 0, params.width, params.height);
    gradient.addColorStop(0, colors.primary);
    gradient.addColorStop(0.5, colors.secondary);
    gradient.addColorStop(1, colors.accent);
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, params.width, params.height);

    // Ajouter des éléments manga
    this.addMangaElements(ctx, params);
    
    // Ajouter le texte du prompt
    this.addPromptText(ctx, params);
    
    // Ajouter le watermark HIBBI4
    this.addHIBBI4Watermark(ctx, params.width, params.height);

    return canvas.toDataURL();
  }

  /**
   * Obtient les couleurs selon le style manga
   */
  private getMangaColors(style?: MangaStyle): { primary: string, secondary: string, accent: string } {
    if (!style) {
      return { primary: '#f0f0f0', secondary: '#e0e0e0', accent: '#d0d0d0' };
    }

    switch (style.artStyle) {
      case 'shonen':
        return { primary: '#ff6b6b', secondary: '#ffa726', accent: '#ffcc02' };
      case 'shoujo':
        return { primary: '#ffb6c1', secondary: '#ffc0cb', accent: '#ffe4e1' };
      case 'seinen':
        return { primary: '#424242', secondary: '#616161', accent: '#757575' };
      case 'josei':
        return { primary: '#8e24aa', secondary: '#ab47bc', accent: '#ce93d8' };
      default:
        return { primary: '#00bcd4', secondary: '#26c6da', accent: '#4dd0e1' };
    }
  }

  /**
   * Ajoute des éléments visuels manga au placeholder
   */
  private addMangaElements(ctx: CanvasRenderingContext2D, params: GenerationParams) {
    const { width, height } = params;
    
    ctx.globalAlpha = 0.3;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;

    // Lignes de vitesse (style shonen)
    if (params.style?.artStyle === 'shonen') {
      for (let i = 0; i < 8; i++) {
        ctx.beginPath();
        ctx.moveTo(width * 0.1, height * (0.2 + i * 0.1));
        ctx.lineTo(width * 0.9, height * (0.25 + i * 0.1));
        ctx.stroke();
      }
    }
    
    // Bulles et fleurs (style shoujo)
    if (params.style?.artStyle === 'shoujo') {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      for (let i = 0; i < 12; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const size = Math.random() * 15 + 5;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    // Trames (style seinen)
    if (params.style?.artStyle === 'seinen') {
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.lineWidth = 1;
      for (let i = 0; i < width; i += 3) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, height);
        ctx.stroke();
      }
    }

    ctx.globalAlpha = 1;
  }

  /**
   * Ajoute le texte du prompt au placeholder
   */
  private addPromptText(ctx: CanvasRenderingContext2D, params: GenerationParams) {
    const { width, height } = params;
    
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Découper le prompt en lignes
    const words = params.prompt.split(' ');
    const lines: string[] = [];
    let currentLine = '';
    const maxWidth = width * 0.8;

    for (const word of words) {
      const testLine = currentLine + (currentLine ? ' ' : '') + word;
      const metrics = ctx.measureText(testLine);
      
      if (metrics.width > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine) lines.push(currentLine);

    // Dessiner les lignes
    const lineHeight = 18;
    const startY = height / 2 - (lines.length * lineHeight) / 2;

    lines.forEach((line, index) => {
      ctx.fillText(line, width / 2, startY + index * lineHeight);
    });
  }

  /**
   * Ajoute le watermark HIBBI4
   */
  private addHIBBI4Watermark(ctx: CanvasRenderingContext2D, width: number, height: number) {
    // Fond du watermark
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, height - 35, width, 35);

    // Logo HIBBI4
    ctx.fillStyle = '#00bcd4';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('HIBBI4 - Mode Démo', width / 2, height - 17);
  }
}

/**
 * Générateur de prompts intelligents pour manga
 */
export class MangaPromptGenerator {
  /**
   * Génère un prompt optimisé selon le contexte
   */
  static generateContextualPrompt(
    basePrompt: string,
    characters: Character[],
    style: MangaStyle,
    sceneType: 'action' | 'dialogue' | 'dramatic' | 'comedy' = 'dialogue'
  ): string {
    let prompt = basePrompt;

    // Ajouter le contexte des personnages
    if (characters.length > 0) {
      const charDescriptions = characters.map(char => {
        let desc = char.name;
        if (char.appearance) desc += ` (${char.appearance})`;
        return desc;
      }).join(', ');
      
      prompt = `${charDescriptions}, ${prompt}`;
    }

    // Ajouter le style artistique
    const stylePrompts = {
      shonen: 'dynamic manga style, bold lines, high energy, action-oriented',
      shoujo: 'delicate manga style, soft lines, romantic atmosphere, beautiful',
      seinen: 'realistic manga style, detailed artwork, mature themes, sophisticated',
      josei: 'elegant manga style, refined artwork, emotional depth, realistic'
    };

    prompt += `, ${stylePrompts[style.artStyle] || stylePrompts.shonen}`;

    // Ajouter le contexte de scène
    const scenePrompts = {
      action: 'dynamic pose, motion lines, intense action, dramatic angle',
      dialogue: 'character interaction, expressive faces, conversation scene',
      dramatic: 'emotional scene, dramatic lighting, intense atmosphere',
      comedy: 'funny expression, comedic situation, lighthearted mood'
    };

    prompt += `, ${scenePrompts[sceneType]}`;

    // Ajouter les termes de qualité
    prompt += ', high quality, detailed manga artwork, professional illustration';

    return prompt;
  }

  /**
   * Génère des suggestions de prompts
   */
  static generatePromptSuggestions(style: MangaStyle): string[] {
    const suggestions = {
      shonen: [
        'Epic battle scene with energy attacks',
        'Hero training in dramatic landscape',
        'Intense confrontation between rivals',
        'Team working together against enemy',
        'Transformation sequence with power aura'
      ],
      shoujo: [
        'Romantic confession under cherry blossoms',
        'Gentle conversation in school hallway',
        'Emotional reunion scene',
        'Beautiful dress-up moment',
        'Tender moment between characters'
      ],
      seinen: [
        'Complex psychological confrontation',
        'Realistic urban environment scene',
        'Mature character development moment',
        'Detailed action with consequences',
        'Philosophical discussion scene'
      ],
      josei: [
        'Sophisticated workplace interaction',
        'Emotional relationship discussion',
        'Elegant social gathering scene',
        'Personal growth moment',
        'Complex adult relationship scene'
      ]
    };

    return suggestions[style.artStyle] || suggestions.shonen;
  }
}

/**
 * Gestionnaire de cohérence des personnages
 */
export class CharacterConsistency {
  private characterCache: Map<string, string> = new Map();

  /**
   * Génère une description cohérente pour un personnage
   */
  generateConsistentDescription(character: Character): string {
    const cacheKey = character.id;
    
    if (this.characterCache.has(cacheKey)) {
      return this.characterCache.get(cacheKey)!;
    }

    let description = character.name;
    
    if (character.appearance) {
      description += `, ${character.appearance}`;
    }

    // Ajouter des détails cohérents
    const consistentTraits = [
      'same character',
      'consistent appearance',
      'recognizable features'
    ];

    description += `, ${consistentTraits.join(', ')}`;

    this.characterCache.set(cacheKey, description);
    return description;
  }

  /**
   * Met à jour la description d'un personnage
   */
  updateCharacterDescription(character: Character): void {
    const cacheKey = character.id;
    this.characterCache.delete(cacheKey);
    this.generateConsistentDescription(character);
  }

  /**
   * Efface le cache pour un personnage
   */
  clearCharacterCache(characterId: string): void {
    this.characterCache.delete(characterId);
  }

  /**
   * Efface tout le cache
   */
  clearAllCache(): void {
    this.characterCache.clear();
  }
}

// Instances globales
export const mangaImageGenerator = new MangaImageGenerator();
export const characterConsistency = new CharacterConsistency();

// Fonction utilitaire pour la génération rapide
export async function generateMangaImage(
  prompt: string,
  characters: Character[] = [],
  style?: MangaStyle,
  width: number = 512,
  height: number = 512
): Promise<string> {
  const params: GenerationParams = {
    prompt,
    characters,
    style,
    width,
    height
  };

  return mangaImageGenerator.generatePanelImage(params);
}