// Exporteur PDF pour les mangas

import { MangaBook, MangaPage, BookSettings } from '../types/manga';

export class MangaPDFExporter {
  private jsPDF: any;

  constructor() {
    // jsPDF sera chargé dynamiquement
  }

  /**
   * Initialise jsPDF (chargement dynamique)
   */
  private async initializePDF() {
    if (!this.jsPDF) {
      // Chargement dynamique de jsPDF
      const jsPDFModule = await import('jspdf');
      this.jsPDF = jsPDFModule.jsPDF;
    }
  }

  /**
   * Exporte un manga complet en PDF
   */
  async exportMangaBook(book: MangaBook): Promise<Blob> {
    await this.initializePDF();

    const { pageSize, margins, resolution } = book.settings;
    const dimensions = this.getPageDimensions(pageSize);
    
    const pdf = new this.jsPDF({
      orientation: dimensions.width > dimensions.height ? 'landscape' : 'portrait',
      unit: 'mm',
      format: [dimensions.width, dimensions.height],
      compress: true
    });

    // Page de couverture
    await this.addCoverPage(pdf, book, dimensions);

    // Pages de contenu
    for (let i = 0; i < book.pages.length; i++) {
      if (i > 0 || book.coverImage) {
        pdf.addPage();
      }
      await this.addMangaPage(pdf, book.pages[i], book.settings, dimensions);
    }

    // Page de fin (optionnelle)
    await this.addEndPage(pdf, book, dimensions);

    return pdf.output('blob');
  }

  /**
   * Ajoute la page de couverture
   */
  private async addCoverPage(pdf: any, book: MangaBook, dimensions: any) {
    // Fond blanc
    pdf.setFillColor(255, 255, 255);
    pdf.rect(0, 0, dimensions.width, dimensions.height, 'F');

    // Image de couverture si disponible
    if (book.coverImage) {
      try {
        const imgData = await this.loadImage(book.coverImage);
        const imgDimensions = this.calculateImageDimensions(
          imgData, 
          dimensions.width - 20, 
          dimensions.height - 60
        );
        
        pdf.addImage(
          book.coverImage,
          'PNG',
          (dimensions.width - imgDimensions.width) / 2,
          20,
          imgDimensions.width,
          imgDimensions.height
        );
      } catch (error) {
        console.warn('Could not load cover image:', error);
      }
    }

    // Titre
    pdf.setFontSize(24);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(0, 0, 0);
    pdf.text(book.title, dimensions.width / 2, dimensions.height - 40, { align: 'center' });

    // Auteur
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Par ${book.author}`, dimensions.width / 2, dimensions.height - 30, { align: 'center' });

    // Genre
    pdf.setFontSize(12);
    pdf.text(book.genre, dimensions.width / 2, dimensions.height - 20, { align: 'center' });
  }

  /**
   * Ajoute une page de manga
   */
  private async addMangaPage(
    pdf: any, 
    page: MangaPage, 
    settings: BookSettings, 
    dimensions: any
  ) {
    const { margins, gutterSize } = settings;

    // Fond blanc
    pdf.setFillColor(255, 255, 255);
    pdf.rect(0, 0, dimensions.width, dimensions.height, 'F');

    // Zone de contenu (en tenant compte des marges)
    const contentWidth = dimensions.width - margins.left - margins.right;
    const contentHeight = dimensions.height - margins.top - margins.bottom;

    // Dessiner chaque panel
    for (const panel of page.panels) {
      await this.drawPanel(pdf, panel, margins, contentWidth, contentHeight, gutterSize);
    }

    // Numéro de page
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(128, 128, 128);
    pdf.text(
      page.pageNumber.toString(),
      dimensions.width - margins.right - 10,
      dimensions.height - margins.bottom + 5,
      { align: 'right' }
    );
  }

  /**
   * Dessine un panel sur la page PDF
   */
  private async drawPanel(
    pdf: any,
    panel: any,
    margins: any,
    contentWidth: number,
    contentHeight: number,
    gutterSize: number
  ) {
    // Calculer la position réelle du panel
    const x = margins.left + (panel.position.x * contentWidth) / 100;
    const y = margins.top + (panel.position.y * contentHeight) / 100;
    const width = (panel.size.width * contentWidth) / 100 - gutterSize;
    const height = (panel.size.height * contentHeight) / 100 - gutterSize;

    // Fond du panel
    if (panel.backgroundColor) {
      const color = this.hexToRgb(panel.backgroundColor);
      pdf.setFillColor(color.r, color.g, color.b);
      pdf.rect(x, y, width, height, 'F');
    }

    // Image générée
    if (panel.generatedImage) {
      try {
        const imgDimensions = this.calculateImageDimensions(
          panel.generatedImage,
          width - 4,
          height - 4
        );
        
        pdf.addImage(
          panel.generatedImage,
          'PNG',
          x + 2,
          y + 2,
          imgDimensions.width,
          imgDimensions.height
        );
      } catch (error) {
        console.warn('Could not add panel image:', error);
        // Dessiner un placeholder
        pdf.setFillColor(240, 240, 240);
        pdf.rect(x + 2, y + 2, width - 4, height - 4, 'F');
        
        pdf.setFontSize(8);
        pdf.setTextColor(128, 128, 128);
        pdf.text('Image non disponible', x + width/2, y + height/2, { align: 'center' });
      }
    }

    // Bordure du panel
    this.drawPanelBorder(pdf, x, y, width, height, panel.borderStyle);

    // Bulles de dialogue
    for (const dialogue of panel.dialogues) {
      this.drawDialogueBubble(pdf, dialogue, x, y, width, height);
    }

    // Effets spéciaux
    for (const effect of panel.effects) {
      this.drawPanelEffect(pdf, effect, x, y, width, height);
    }
  }

  /**
   * Dessine la bordure d'un panel
   */
  private drawPanelBorder(pdf: any, x: number, y: number, width: number, height: number, style: string) {
    pdf.setDrawColor(0, 0, 0);
    
    switch (style) {
      case 'normal':
        pdf.setLineWidth(0.5);
        pdf.rect(x, y, width, height);
        break;
      case 'thick':
        pdf.setLineWidth(1.5);
        pdf.rect(x, y, width, height);
        break;
      case 'double':
        pdf.setLineWidth(0.3);
        pdf.rect(x, y, width, height);
        pdf.rect(x + 1, y + 1, width - 2, height - 2);
        break;
      case 'jagged':
        // Simuler une bordure dentelée avec des lignes brisées
        pdf.setLineWidth(0.8);
        this.drawJaggedBorder(pdf, x, y, width, height);
        break;
      case 'none':
        // Pas de bordure
        break;
      default:
        pdf.setLineWidth(0.5);
        pdf.rect(x, y, width, height);
    }
  }

  /**
   * Dessine une bordure dentelée
   */
  private drawJaggedBorder(pdf: any, x: number, y: number, width: number, height: number) {
    const jagSize = 2;
    
    // Haut
    for (let i = 0; i < width; i += jagSize * 2) {
      pdf.line(x + i, y, x + i + jagSize, y - jagSize/2);
      pdf.line(x + i + jagSize, y - jagSize/2, x + i + jagSize * 2, y);
    }
    
    // Droite
    for (let i = 0; i < height; i += jagSize * 2) {
      pdf.line(x + width, y + i, x + width + jagSize/2, y + i + jagSize);
      pdf.line(x + width + jagSize/2, y + i + jagSize, x + width, y + i + jagSize * 2);
    }
    
    // Bas
    for (let i = width; i > 0; i -= jagSize * 2) {
      pdf.line(x + i, y + height, x + i - jagSize, y + height + jagSize/2);
      pdf.line(x + i - jagSize, y + height + jagSize/2, x + i - jagSize * 2, y + height);
    }
    
    // Gauche
    for (let i = height; i > 0; i -= jagSize * 2) {
      pdf.line(x, y + i, x - jagSize/2, y + i - jagSize);
      pdf.line(x - jagSize/2, y + i - jagSize, x, y + i - jagSize * 2);
    }
  }

  /**
   * Dessine une bulle de dialogue
   */
  private drawDialogueBubble(pdf: any, dialogue: any, panelX: number, panelY: number, panelWidth: number, panelHeight: number) {
    const x = panelX + (dialogue.position.x * panelWidth) / 100;
    const y = panelY + (dialogue.position.y * panelHeight) / 100;
    const width = (dialogue.size.width * panelWidth) / 100;
    const height = (dialogue.size.height * panelHeight) / 100;

    // Fond de la bulle
    pdf.setFillColor(255, 255, 255);
    
    switch (dialogue.type) {
      case 'speech':
        // Bulle de parole ovale
        pdf.ellipse(x + width/2, y + height/2, width/2, height/2, 'FD');
        break;
      case 'thought':
        // Bulle de pensée avec des petits cercles
        pdf.ellipse(x + width/2, y + height/2, width/2, height/2, 'FD');
        // Petits cercles pour indiquer la pensée
        pdf.circle(x + width/4, y + height + 2, 1, 'FD');
        pdf.circle(x + width/6, y + height + 4, 0.5, 'FD');
        break;
      case 'narration':
        // Rectangle simple
        pdf.rect(x, y, width, height, 'FD');
        break;
      case 'sound':
        // Forme irrégulière pour les effets sonores
        pdf.setFillColor(255, 255, 0, 0.3);
        pdf.rect(x, y, width, height, 'FD');
        break;
    }

    // Texte
    pdf.setFontSize(8);
    pdf.setFont('helvetica', dialogue.style === 'shout' ? 'bold' : 'normal');
    pdf.setTextColor(0, 0, 0);
    
    // Découper le texte en lignes
    const lines = pdf.splitTextToSize(dialogue.text, width - 4);
    const lineHeight = 3;
    const startY = y + height/2 - (lines.length * lineHeight) / 2;
    
    lines.forEach((line: string, index: number) => {
      pdf.text(line, x + width/2, startY + index * lineHeight, { align: 'center' });
    });
  }

  /**
   * Dessine les effets spéciaux d'un panel
   */
  private drawPanelEffect(pdf: any, effect: any, panelX: number, panelY: number, panelWidth: number, panelHeight: number) {
    switch (effect.type) {
      case 'speed-lines':
        this.drawSpeedLines(pdf, panelX, panelY, panelWidth, panelHeight, effect.intensity);
        break;
      case 'impact':
        this.drawImpactEffect(pdf, panelX, panelY, panelWidth, panelHeight, effect.intensity);
        break;
      // Autres effets...
    }
  }

  /**
   * Dessine des lignes de vitesse
   */
  private drawSpeedLines(pdf: any, x: number, y: number, width: number, height: number, intensity: number) {
    pdf.setDrawColor(0, 0, 0);
    pdf.setLineWidth(0.2);
    
    const lineCount = Math.floor(intensity * 20);
    const centerX = x + width / 2;
    const centerY = y + height / 2;
    
    for (let i = 0; i < lineCount; i++) {
      const angle = (i / lineCount) * Math.PI * 2;
      const startRadius = Math.min(width, height) * 0.1;
      const endRadius = Math.min(width, height) * 0.4;
      
      const startX = centerX + Math.cos(angle) * startRadius;
      const startY = centerY + Math.sin(angle) * startRadius;
      const endX = centerX + Math.cos(angle) * endRadius;
      const endY = centerY + Math.sin(angle) * endRadius;
      
      pdf.line(startX, startY, endX, endY);
    }
  }

  /**
   * Dessine un effet d'impact
   */
  private drawImpactEffect(pdf: any, x: number, y: number, width: number, height: number, intensity: number) {
    pdf.setDrawColor(0, 0, 0);
    pdf.setLineWidth(1);
    
    const centerX = x + width / 2;
    const centerY = y + height / 2;
    const radius = Math.min(width, height) * 0.3 * intensity;
    
    // Étoile d'impact
    const points = 8;
    for (let i = 0; i < points; i++) {
      const angle = (i / points) * Math.PI * 2;
      const innerRadius = radius * 0.5;
      const outerRadius = radius;
      
      const x1 = centerX + Math.cos(angle) * innerRadius;
      const y1 = centerY + Math.sin(angle) * innerRadius;
      const x2 = centerX + Math.cos(angle) * outerRadius;
      const y2 = centerY + Math.sin(angle) * outerRadius;
      
      pdf.line(x1, y1, x2, y2);
    }
  }

  /**
   * Ajoute une page de fin
   */
  private async addEndPage(pdf: any, book: MangaBook, dimensions: any) {
    pdf.addPage();
    
    // Fond blanc
    pdf.setFillColor(255, 255, 255);
    pdf.rect(0, 0, dimensions.width, dimensions.height, 'F');

    // "Fin"
    pdf.setFontSize(36);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(0, 0, 0);
    pdf.text('FIN', dimensions.width / 2, dimensions.height / 2 - 20, { align: 'center' });

    // Synopsis si disponible
    if (book.synopsis) {
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      const lines = pdf.splitTextToSize(book.synopsis, dimensions.width - 40);
      const startY = dimensions.height / 2 + 20;
      
      lines.forEach((line: string, index: number) => {
        pdf.text(line, dimensions.width / 2, startY + index * 6, { align: 'center' });
      });
    }

    // Informations de génération
    pdf.setFontSize(8);
    pdf.setTextColor(128, 128, 128);
    pdf.text(
      `Généré avec HIBBI Manga Builder - ${new Date().toLocaleDateString()}`,
      dimensions.width / 2,
      dimensions.height - 20,
      { align: 'center' }
    );
  }

  /**
   * Obtient les dimensions de page selon le format
   */
  private getPageDimensions(pageSize: string) {
    switch (pageSize) {
      case 'A4':
        return { width: 210, height: 297 };
      case 'B5':
        return { width: 176, height: 250 };
      case 'US-Letter':
        return { width: 216, height: 279 };
      case 'Manga-Tankobon':
        return { width: 112, height: 174 };
      default:
        return { width: 210, height: 297 };
    }
  }

  /**
   * Calcule les dimensions d'image pour s'adapter à l'espace disponible
   */
  private calculateImageDimensions(imageData: string, maxWidth: number, maxHeight: number) {
    // Pour simplifier, on assume un ratio 4:3
    const aspectRatio = 4 / 3;
    
    let width = maxWidth;
    let height = width / aspectRatio;
    
    if (height > maxHeight) {
      height = maxHeight;
      width = height * aspectRatio;
    }
    
    return { width, height };
  }

  /**
   * Charge une image et retourne ses données
   */
  private loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  }

  /**
   * Convertit une couleur hex en RGB
   */
  private hexToRgb(hex: string) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  }
}