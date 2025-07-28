// Accessibility audit utilities for automated testing
import React from 'react';
export interface AccessibilityIssue {
  id: string;
  element: HTMLElement;
  type: 'error' | 'warning' | 'info';
  category: 'keyboard' | 'screen-reader' | 'visual' | 'structure' | 'forms' | 'media';
  message: string;
  suggestion: string;
  wcagGuideline?: string;
  severity: 'critical' | 'serious' | 'moderate' | 'minor';
}

export interface AccessibilityAuditResult {
  issues: AccessibilityIssue[];
  score: number;
  summary: {
    total: number;
    critical: number;
    serious: number;
    moderate: number;
    minor: number;
  };
  categories: Record<string, number>;
}

class AccessibilityAuditor {
  private issues: AccessibilityIssue[] = [];
  private issueId = 0;

  private addIssue(
    element: HTMLElement,
    type: AccessibilityIssue['type'],
    category: AccessibilityIssue['category'],
    message: string,
    suggestion: string,
    severity: AccessibilityIssue['severity'],
    wcagGuideline?: string
  ) {
    this.issues.push({
      id: `issue-${++this.issueId}`,
      element,
      type,
      category,
      message,
      suggestion,
      severity,
      wcagGuideline,
    });
  }

  // Check for missing alt text on images
  private checkImageAltText() {
    const images = document.querySelectorAll('img');
    images.forEach((img) => {
      const alt = img.getAttribute('alt');
      const role = img.getAttribute('role');
      
      if (alt === null && role !== 'presentation' && !img.hasAttribute('aria-hidden')) {
        this.addIssue(
          img,
          'error',
          'screen-reader',
          'Image manque d\'attribut alt',
          'Ajouter un attribut alt descriptif ou role="presentation" si décoratif',
          'serious',
          'WCAG 1.1.1'
        );
      } else if (alt === '') {
        // Check if it's actually decorative
        const hasDescriptiveContent = img.closest('figure')?.querySelector('figcaption') ||
                                     img.parentElement?.textContent?.trim();
        if (!hasDescriptiveContent) {
          this.addIssue(
            img,
            'warning',
            'screen-reader',
            'Image avec alt vide potentiellement problématique',
            'Vérifier si l\'image est vraiment décorative ou ajouter une description',
            'moderate',
            'WCAG 1.1.1'
          );
        }
      }
    });
  }

  // Check for proper heading structure
  private checkHeadingStructure() {
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    let previousLevel = 0;

    headings.forEach((heading, index) => {
      const level = parseInt(heading.tagName[1]);
      
      if (index === 0 && level !== 1) {
        this.addIssue(
          heading as HTMLElement,
          'error',
          'structure',
          'La page devrait commencer par un h1',
          'Utiliser h1 pour le titre principal de la page',
          'serious',
          'WCAG 1.3.1'
        );
      }
      
      if (level > previousLevel + 1) {
        this.addIssue(
          heading as HTMLElement,
          'error',
          'structure',
          `Saut de niveau de titre (de h${previousLevel} à h${level})`,
          'Utiliser les niveaux de titre de manière séquentielle',
          'moderate',
          'WCAG 1.3.1'
        );
      }
      
      previousLevel = level;
    });
  }

  // Check for proper form labels
  private checkFormLabels() {
    const inputs = document.querySelectorAll('input, select, textarea');
    
    inputs.forEach((input) => {
      const type = input.getAttribute('type');
      if (type === 'hidden' || type === 'submit' || type === 'button') return;
      
      const id = input.getAttribute('id');
      const ariaLabel = input.getAttribute('aria-label');
      const ariaLabelledby = input.getAttribute('aria-labelledby');
      const title = input.getAttribute('title');
      const placeholder = input.getAttribute('placeholder');
      
      let hasLabel = false;
      
      // Check for associated label
      if (id) {
        const label = document.querySelector(`label[for="${id}"]`);
        if (label) hasLabel = true;
      }
      
      // Check for wrapping label
      const parentLabel = input.closest('label');
      if (parentLabel) hasLabel = true;
      
      // Check for ARIA labeling
      if (ariaLabel || ariaLabelledby) hasLabel = true;
      
      if (!hasLabel) {
        this.addIssue(
          input as HTMLElement,
          'error',
          'forms',
          'Champ de formulaire sans label',
          'Ajouter un élément label associé ou un aria-label',
          'serious',
          'WCAG 1.3.1'
        );
      } else if (!ariaLabel && !ariaLabelledby && !id && placeholder && !title) {
        this.addIssue(
          input as HTMLElement,
          'warning',
          'forms',
          'Utilisation uniquement de placeholder comme label',
          'Ajouter un label visible pour améliorer l\'accessibilité',
          'moderate',
          'WCAG 3.3.2'
        );
      }
    });
  }

  // Check for keyboard accessibility
  private checkKeyboardAccessibility() {
    const interactive = document.querySelectorAll(
      'a, button, input, select, textarea, [tabindex], [role="button"], [role="link"], [role="menuitem"]'
    );
    
    interactive.forEach((element) => {
      const tabindex = element.getAttribute('tabindex');
      
      // Check for positive tabindex (anti-pattern)
      if (tabindex && parseInt(tabindex) > 0) {
        this.addIssue(
          element as HTMLElement,
          'warning',
          'keyboard',
          'Tabindex positif détecté',
          'Éviter les valeurs de tabindex positives, utiliser 0 ou -1',
          'moderate',
          'WCAG 2.4.3'
        );
      }
      
      // Check for missing keyboard handlers on custom interactive elements
      const role = element.getAttribute('role');
      if ((role === 'button' || role === 'link') && element.tagName !== 'BUTTON' && element.tagName !== 'A') {
        const hasKeyboardHandler = element.getAttribute('onkeydown') || 
                                  element.getAttribute('onkeyup') ||
                                  element.getAttribute('onkeypress');
        
        if (!hasKeyboardHandler) {
          this.addIssue(
            element as HTMLElement,
            'error',
            'keyboard',
            'Élément interactif personnalisé sans gestion clavier',
            'Ajouter des gestionnaires d\'événements clavier (Enter, Space)',
            'serious',
            'WCAG 2.1.1'
          );
        }
      }
    });
  }

  // Check for proper ARIA usage
  private checkAriaUsage() {
    const elementsWithAria = document.querySelectorAll('[aria-labelledby], [aria-describedby]');
    
    elementsWithAria.forEach((element) => {
      const labelledby = element.getAttribute('aria-labelledby');
      const describedby = element.getAttribute('aria-describedby');
      
      if (labelledby) {
        const ids = labelledby.split(' ');
        ids.forEach((id) => {
          if (!document.getElementById(id)) {
            this.addIssue(
              element as HTMLElement,
              'error',
              'screen-reader',
              `aria-labelledby référence un ID inexistant: ${id}`,
              'Vérifier que l\'élément avec l\'ID existe',
              'serious',
              'WCAG 4.1.1'
            );
          }
        });
      }
      
      if (describedby) {
        const ids = describedby.split(' ');
        ids.forEach((id) => {
          if (!document.getElementById(id)) {
            this.addIssue(
              element as HTMLElement,
              'error',
              'screen-reader',
              `aria-describedby référence un ID inexistant: ${id}`,
              'Vérifier que l\'élément avec l\'ID existe',
              'serious',
              'WCAG 4.1.1'
            );
          }
        });
      }
    });
    
    // Check for invalid ARIA attributes
    const allElements = document.querySelectorAll('*');
    allElements.forEach((element) => {
      const attributes = Array.from(element.attributes);
      attributes.forEach((attr) => {
        if (attr.name.startsWith('aria-')) {
          // Basic validation for common ARIA attributes
          if (attr.name === 'aria-hidden' && !['true', 'false'].includes(attr.value)) {
            this.addIssue(
              element as HTMLElement,
              'error',
              'screen-reader',
              'Valeur invalide pour aria-hidden',
              'Utiliser "true" ou "false" pour aria-hidden',
              'moderate',
              'WCAG 4.1.1'
            );
          }
        }
      });
    });
  }

  // Check for color contrast (simplified)
  private checkColorContrast() {
    const textElements = document.querySelectorAll('p, span, a, button, input, label, h1, h2, h3, h4, h5, h6');
    
    textElements.forEach((element) => {
      const styles = window.getComputedStyle(element);
      const fontSize = parseFloat(styles.fontSize);
      const fontWeight = styles.fontWeight;
      
      // Simple heuristic: warn if text is very light on light background or very dark on dark background
      const color = styles.color;
      const backgroundColor = styles.backgroundColor;
      
      if (color === 'rgb(255, 255, 255)' && backgroundColor === 'rgb(255, 255, 255)') {
        this.addIssue(
          element as HTMLElement,
          'error',
          'visual',
          'Texte blanc sur fond blanc détecté',
          'Vérifier le contraste entre le texte et l\'arrière-plan',
          'critical',
          'WCAG 1.4.3'
        );
      }
      
      if (color === 'rgb(0, 0, 0)' && backgroundColor === 'rgb(0, 0, 0)') {
        this.addIssue(
          element as HTMLElement,
          'error',
          'visual',
          'Texte noir sur fond noir détecté',
          'Vérifier le contraste entre le texte et l\'arrière-plan',
          'critical',
          'WCAG 1.4.3'
        );
      }
    });
  }

  // Check for media accessibility
  private checkMediaAccessibility() {
    // Check videos for captions
    const videos = document.querySelectorAll('video');
    videos.forEach((video) => {
      const tracks = video.querySelectorAll('track[kind="captions"], track[kind="subtitles"]');
      if (tracks.length === 0) {
        this.addIssue(
          video,
          'warning',
          'media',
          'Vidéo sans sous-titres détectée',
          'Ajouter des éléments track avec des sous-titres',
          'serious',
          'WCAG 1.2.2'
        );
      }
    });
    
    // Check audio for transcripts
    const audios = document.querySelectorAll('audio');
    audios.forEach((audio) => {
      // This is a simplified check - in practice, you'd look for associated transcript
      const hasTranscript = audio.nextElementSibling?.textContent?.includes('transcript') ||
                           audio.previousElementSibling?.textContent?.includes('transcript');
      
      if (!hasTranscript) {
        this.addIssue(
          audio,
          'info',
          'media',
          'Audio sans transcription détectée',
          'Fournir une transcription textuelle pour le contenu audio',
          'moderate',
          'WCAG 1.2.1'
        );
      }
    });
  }

  // Main audit function
  public audit(): AccessibilityAuditResult {
    this.issues = [];
    this.issueId = 0;
    
    // Run all checks
    this.checkImageAltText();
    this.checkHeadingStructure();
    this.checkFormLabels();
    this.checkKeyboardAccessibility();
    this.checkAriaUsage();
    this.checkColorContrast();
    this.checkMediaAccessibility();
    
    // Calculate summary
    const summary = {
      total: this.issues.length,
      critical: this.issues.filter(i => i.severity === 'critical').length,
      serious: this.issues.filter(i => i.severity === 'serious').length,
      moderate: this.issues.filter(i => i.severity === 'moderate').length,
      minor: this.issues.filter(i => i.severity === 'minor').length,
    };
    
    // Calculate categories
    const categories = this.issues.reduce((acc, issue) => {
      acc[issue.category] = (acc[issue.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    // Calculate score (0-100, lower is better for issues)
    const weightedScore = 
      summary.critical * 10 + 
      summary.serious * 5 + 
      summary.moderate * 2 + 
      summary.minor * 1;
    
    const maxPossibleScore = 100;
    const score = Math.max(0, maxPossibleScore - weightedScore);
    
    return {
      issues: this.issues,
      score,
      summary,
      categories,
    };
  }
}

// Singleton instance
export const accessibilityAuditor = new AccessibilityAuditor();

// Utility function to run audit and log results
export const runAccessibilityAudit = (): AccessibilityAuditResult => {
  const result = accessibilityAuditor.audit();
  
  if (process.env.NODE_ENV === 'development') {
    console.group('🔍 Audit d\'accessibilité');
    console.log(`Score: ${result.score}/100`);
    console.log('Résumé:', result.summary);
    console.log('Catégories:', result.categories);
    
    if (result.issues.length > 0) {
      console.groupCollapsed(`${result.issues.length} problèmes détectés`);
      result.issues.forEach(issue => {
        const icon = issue.severity === 'critical' ? '🚨' : 
                    issue.severity === 'serious' ? '⚠️' : 
                    issue.severity === 'moderate' ? '⚡' : 'ℹ️';
        
        console.log(`${icon} ${issue.message}`, {
          element: issue.element,
          suggestion: issue.suggestion,
          wcag: issue.wcagGuideline,
        });
      });
      console.groupEnd();
    }
    
    console.groupEnd();
  }
  
  return result;
};

// Hook for React components
export const useAccessibilityAudit = (runOnMount = false) => {
  const [result, setResult] = React.useState<AccessibilityAuditResult | null>(null);
  
  const runAudit = React.useCallback(() => {
    const auditResult = runAccessibilityAudit();
    setResult(auditResult);
    return auditResult;
  }, []);
  
  React.useEffect(() => {
    if (runOnMount) {
      // Run audit after component mount and DOM updates
      setTimeout(runAudit, 100);
    }
  }, [runOnMount, runAudit]);
  
  return {
    result,
    runAudit,
  };
};

export default accessibilityAuditor;