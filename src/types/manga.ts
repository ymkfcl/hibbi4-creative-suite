// Types pour le système de génération de manga

export interface Character {
  id: string;
  name: string;
  description: string;
  visualDescription: string;
  referenceImage?: string;
  personality: string;
  age?: number;
  gender?: string;
}

export interface DialogueBubble {
  id: string;
  text: string;
  character?: string;
  type: 'speech' | 'thought' | 'narration' | 'sound';
  position: { x: number; y: number };
  size: { width: number; height: number };
  style: 'normal' | 'shout' | 'whisper' | 'angry' | 'happy';
}

export interface Panel {
  id: string;
  prompt: string;
  generatedImage?: string;
  dialogues: DialogueBubble[];
  position: { x: number; y: number };
  size: { width: number; height: number };
  borderStyle: 'normal' | 'none' | 'jagged' | 'rounded' | 'double';
  backgroundColor?: string;
  effects: PanelEffect[];
  cameraAngle: 'close-up' | 'medium' | 'wide' | 'bird-eye' | 'worm-eye';
  mood: 'normal' | 'dramatic' | 'action' | 'peaceful' | 'tense';
}

export interface PanelEffect {
  type: 'speed-lines' | 'impact' | 'explosion' | 'sparkle' | 'rain' | 'snow';
  intensity: number;
  position?: { x: number; y: number };
}

export interface MangaPage {
  id: string;
  title: string;
  panels: Panel[];
  layout: PageLayout;
  backgroundColor?: string;
  pageNumber: number;
}

export interface PageLayout {
  type: 'grid' | 'custom' | 'template';
  columns?: number;
  rows?: number;
  template?: string; // nom du template prédéfini
}

export interface MangaBook {
  id: string;
  title: string;
  author: string;
  genre: string;
  style: MangaStyle;
  characters: Character[];
  pages: MangaPage[];
  coverImage?: string;
  synopsis: string;
  settings: BookSettings;
}

export interface MangaStyle {
  name: string;
  artStyle: 'shonen' | 'shoujo' | 'seinen' | 'josei' | 'kodomomuke';
  colorScheme: 'black-white' | 'sepia' | 'color';
  lineStyle: 'thin' | 'thick' | 'variable';
  shadingStyle: 'screentone' | 'digital' | 'watercolor' | 'cel';
}

export interface BookSettings {
  pageSize: 'A4' | 'B5' | 'US-Letter' | 'Manga-Tankobon';
  readingDirection: 'left-to-right' | 'right-to-left';
  margins: { top: number; bottom: number; left: number; right: number };
  gutterSize: number; // espace entre les cases
  resolution: number; // DPI pour l'export
}

export interface GenerationParams {
  prompt: string;
  style: string;
  character?: string;
  mood: string;
  cameraAngle: string;
  width: number;
  height: number;
  negativePrompt?: string;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  panels: Omit<Panel, 'id' | 'prompt' | 'generatedImage' | 'dialogues'>[];
  category: 'action' | 'dialogue' | 'dramatic' | 'comedy' | 'romance';
}