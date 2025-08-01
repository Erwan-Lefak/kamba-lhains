import { accessibilityAuditor, runAccessibilityAudit } from '../../utils/accessibilityAudit';

// Mock DOM for testing
interface MockElement extends Partial<HTMLElement> {
  tagName?: string;
  getAttribute?: (name: string) => string | null;
  setAttribute?: (name: string, value: string) => void;
  hasAttribute?: (name: string) => boolean;
  closest?: (selector: string) => MockElement | null;
  querySelector?: (selector: string) => MockElement | null;
  querySelectorAll?: (selector: string) => MockElement[];
  attributes?: Array<{ name: string; value: string }>;
  textContent?: string | null;
  parentElement?: MockElement | null;
  nextElementSibling?: MockElement | null;
  previousElementSibling?: MockElement | null;
}

// Mock global objects
Object.defineProperty(global, 'document', {
  value: {
    querySelectorAll: jest.fn(),
    querySelector: jest.fn(),
    getElementById: jest.fn(),
  },
  writable: true,
});

Object.defineProperty(global, 'window', {
  value: {
    getComputedStyle: jest.fn(),
  },
  writable: true,
});

describe('AccessibilityAuditor', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset console.log/group mocks if needed
    jest.spyOn(console, 'group').mockImplementation();
    jest.spyOn(console, 'groupCollapsed').mockImplementation();
    jest.spyOn(console, 'groupEnd').mockImplementation();
    jest.spyOn(console, 'log').mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Image Alt Text Check', () => {
    it('should detect images without alt text', () => {
      const mockImg: MockElement = {
        tagName: 'IMG',
        getAttribute: jest.fn((attr) => {
          if (attr === 'alt') return null;
          if (attr === 'role') return null;
          return null;
        }),
        hasAttribute: jest.fn((attr) => {
          if (attr === 'aria-hidden') return false;
          return false;
        }),
      };

      (document.querySelectorAll as jest.Mock).mockImplementation((selector) => {
        if (selector === 'img') return [mockImg];
        return [];
      });

      const result = accessibilityAuditor.audit();

      expect(result.issues).toHaveLength(1);
      expect(result.issues[0].message).toBe('Image manque d\'attribut alt');
      expect(result.issues[0].severity).toBe('serious');
      expect(result.issues[0].wcagGuideline).toBe('WCAG 1.1.1');
    });

    it('should not flag images with proper alt text', () => {
      const mockImg: MockElement = {
        tagName: 'IMG',
        getAttribute: jest.fn((attr) => {
          if (attr === 'alt') return 'Descriptive alt text';
          return null;
        }),
        hasAttribute: jest.fn(() => false),
      };

      (document.querySelectorAll as jest.Mock).mockImplementation((selector) => {
        if (selector === 'img') return [mockImg];
        return [];
      });

      const result = accessibilityAuditor.audit();

      expect(result.issues).toHaveLength(0);
    });

    it('should not flag decorative images with role="presentation"', () => {
      const mockImg: MockElement = {
        tagName: 'IMG',
        getAttribute: jest.fn((attr) => {
          if (attr === 'alt') return null;
          if (attr === 'role') return 'presentation';
          return null;
        }),
        hasAttribute: jest.fn(() => false),
      };

      (document.querySelectorAll as jest.Mock).mockImplementation((selector) => {
        if (selector === 'img') return [mockImg];
        return [];
      });

      const result = accessibilityAuditor.audit();

      expect(result.issues).toHaveLength(0);
    });
  });

  describe('Heading Structure Check', () => {
    it('should detect missing h1 at start', () => {
      const mockH2: MockElement = {
        tagName: 'H2',
      };

      (document.querySelectorAll as jest.Mock).mockImplementation((selector) => {
        if (selector === 'h1, h2, h3, h4, h5, h6') return [mockH2];
        return [];
      });

      const result = accessibilityAuditor.audit();

      expect(result.issues.some(issue => 
        issue.message === 'La page devrait commencer par un h1'
      )).toBe(true);
    });

    it('should detect heading level skipping', () => {
      const mockH1: MockElement = { tagName: 'H1' };
      const mockH3: MockElement = { tagName: 'H3' };

      (document.querySelectorAll as jest.Mock).mockImplementation((selector) => {
        if (selector === 'h1, h2, h3, h4, h5, h6') return [mockH1, mockH3];
        return [];
      });

      const result = accessibilityAuditor.audit();

      expect(result.issues.some(issue => 
        issue.message.includes('Saut de niveau de titre')
      )).toBe(true);
    });
  });

  describe('Form Labels Check', () => {
    it('should detect inputs without labels', () => {
      const mockInput: MockElement = {
        tagName: 'INPUT',
        getAttribute: jest.fn((attr) => {
          if (attr === 'type') return 'text';
          if (attr === 'id') return 'test-input';
          return null;
        }),
        closest: jest.fn(() => null),
      };

      (document.querySelectorAll as jest.Mock).mockImplementation((selector) => {
        if (selector === 'input, select, textarea') return [mockInput];
        return [];
      });

      (document.querySelector as jest.Mock).mockReturnValue(null);

      const result = accessibilityAuditor.audit();

      expect(result.issues.some(issue => 
        issue.message === 'Champ de formulaire sans label'
      )).toBe(true);
    });

    it('should not flag inputs with associated labels', () => {
      const mockInput: MockElement = {
        tagName: 'INPUT',
        getAttribute: jest.fn((attr) => {
          if (attr === 'type') return 'text';
          if (attr === 'id') return 'test-input';
          return null;
        }),
        closest: jest.fn(() => null),
      };

      const mockLabel: MockElement = {
        tagName: 'LABEL',
      };

      (document.querySelectorAll as jest.Mock).mockImplementation((selector) => {
        if (selector === 'input, select, textarea') return [mockInput];
        return [];
      });

      (document.querySelector as jest.Mock).mockReturnValue(mockLabel);

      const result = accessibilityAuditor.audit();

      expect(result.issues.some(issue => 
        issue.message === 'Champ de formulaire sans label'
      )).toBe(false);
    });
  });

  describe('Keyboard Accessibility Check', () => {
    it('should detect positive tabindex values', () => {
      const mockButton: MockElement = {
        tagName: 'BUTTON',
        getAttribute: jest.fn((attr) => {
          if (attr === 'tabindex') return '1';
          return null;
        }),
      };

      (document.querySelectorAll as jest.Mock).mockImplementation((selector) => {
        if (selector.includes('tabindex')) return [mockButton];
        return [];
      });

      const result = accessibilityAuditor.audit();

      expect(result.issues.some(issue => 
        issue.message === 'Tabindex positif détecté'
      )).toBe(true);
    });

    it('should detect custom interactive elements without keyboard handlers', () => {
      const mockDiv: MockElement = {
        tagName: 'DIV',
        getAttribute: jest.fn((attr) => {
          if (attr === 'role') return 'button';
          if (attr === 'tabindex') return '0';
          return null;
        }),
      };

      (document.querySelectorAll as jest.Mock).mockImplementation((selector) => {
        if (selector.includes('role')) return [mockDiv];
        return [];
      });

      const result = accessibilityAuditor.audit();

      expect(result.issues.some(issue => 
        issue.message === 'Élément interactif personnalisé sans gestion clavier'
      )).toBe(true);
    });
  });

  describe('ARIA Usage Check', () => {
    it('should detect invalid ARIA references', () => {
      const mockElement: MockElement = {
        getAttribute: jest.fn((attr) => {
          if (attr === 'aria-labelledby') return 'non-existent-id';
          return null;
        }),
      };

      (document.querySelectorAll as jest.Mock).mockImplementation((selector) => {
        if (selector === '[aria-labelledby], [aria-describedby]') return [mockElement];
        if (selector === '*') return [];
        return [];
      });

      (document.getElementById as jest.Mock).mockReturnValue(null);

      const result = accessibilityAuditor.audit();

      expect(result.issues.some(issue => 
        issue.message.includes('aria-labelledby référence un ID inexistant')
      )).toBe(true);
    });

    it('should detect invalid ARIA attribute values', () => {
      const mockElement: MockElement = {
        attributes: [
          { name: 'aria-hidden', value: 'invalid' },
        ],
      };

      (document.querySelectorAll as jest.Mock).mockImplementation((selector) => {
        if (selector === '[aria-labelledby], [aria-describedby]') return [];
        if (selector === '*') return [mockElement];
        return [];
      });

      // Mock Array.from for element.attributes
      global.Array.from = jest.fn((arrayLike) => {
        if (arrayLike === mockElement.attributes) {
          return mockElement.attributes || [];
        }
        return [];
      });

      const result = accessibilityAuditor.audit();

      expect(result.issues.some(issue => 
        issue.message === 'Valeur invalide pour aria-hidden'
      )).toBe(true);
    });
  });

  describe('Color Contrast Check', () => {
    it('should detect white text on white background', () => {
      const mockElement: MockElement = {};

      (document.querySelectorAll as jest.Mock).mockImplementation((selector) => {
        if (selector.includes('p, span')) return [mockElement];
        return [];
      });

      (window.getComputedStyle as jest.Mock).mockReturnValue({
        fontSize: '16px',
        fontWeight: 'normal',
        color: 'rgb(255, 255, 255)',
        backgroundColor: 'rgb(255, 255, 255)',
      });

      const result = accessibilityAuditor.audit();

      expect(result.issues.some(issue => 
        issue.message === 'Texte blanc sur fond blanc détecté'
      )).toBe(true);
    });
  });

  describe('Score Calculation', () => {
    it('should calculate score correctly based on issue severity', () => {
      // Mock to return specific issues
      const mockElement: MockElement = {};

      (document.querySelectorAll as jest.Mock).mockImplementation((selector) => {
        if (selector === 'img') {
          return [{
            getAttribute: () => null,
            hasAttribute: () => false,
          }];
        }
        if (selector.includes('p, span')) {
          return [mockElement];
        }
        return [];
      });

      (window.getComputedStyle as jest.Mock).mockReturnValue({
        fontSize: '16px',
        fontWeight: 'normal',
        color: 'rgb(255, 255, 255)',
        backgroundColor: 'rgb(255, 255, 255)',
      });

      const result = accessibilityAuditor.audit();

      expect(result.score).toBeLessThan(100); // Should have deductions
      expect(result.summary.total).toBeGreaterThan(0);
      expect(typeof result.score).toBe('number');
    });
  });

  describe('runAccessibilityAudit', () => {
    it('should run audit and log results in development', () => {
      // Set NODE_ENV to development
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      (document.querySelectorAll as jest.Mock).mockReturnValue([]);

      const result = runAccessibilityAudit();

      expect(console.group).toHaveBeenCalledWith('🔍 Audit d\'accessibilité');
      expect(result.score).toBeDefined();
      expect(result.issues).toBeDefined();
      expect(result.summary).toBeDefined();

      // Restore original NODE_ENV
      process.env.NODE_ENV = originalEnv;
    });
  });
});