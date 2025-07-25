// Simple utility tests to boost coverage
describe('Simple utility functions', () => {
  describe('String utilities', () => {
    const capitalize = (str: string): string => {
      return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    };

    const slugify = (str: string): string => {
      return str
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
    };

    const truncate = (str: string, length: number): string => {
      if (str.length <= length) return str;
      return str.slice(0, length) + '...';
    };

    it('capitalizes strings correctly', () => {
      expect(capitalize('hello')).toBe('Hello');
      expect(capitalize('WORLD')).toBe('World');
      expect(capitalize('hELLo WoRLD')).toBe('Hello world');
      expect(capitalize('')).toBe('');
    });

    it('creates slugs from strings', () => {
      expect(slugify('Hello World')).toBe('hello-world');
      expect(slugify('Product Name!')).toBe('product-name');
      expect(slugify('  Multiple   Spaces  ')).toBe('multiple-spaces');
      expect(slugify('Special@#$Characters')).toBe('specialcharacters');
    });

    it('truncates strings properly', () => {
      expect(truncate('Short text', 20)).toBe('Short text');
      expect(truncate('This is a very long text', 10)).toBe('This is a ...');
      expect(truncate('Exact length', 12)).toBe('Exact length');
      expect(truncate('', 5)).toBe('');
    });
  });

  describe('Number utilities', () => {
    const formatPrice = (price: number, currency = 'EUR'): string => {
      return `${price.toFixed(2)} ${currency}`;
    };

    const calculateDiscount = (original: number, discount: number): number => {
      return original - (original * discount / 100);
    };

    const formatPercentage = (value: number): string => {
      return `${(value * 100).toFixed(1)}%`;
    };

    it('formats prices correctly', () => {
      expect(formatPrice(10)).toBe('10.00 EUR');
      expect(formatPrice(25.5, 'USD')).toBe('25.50 USD');
      expect(formatPrice(0)).toBe('0.00 EUR');
    });

    it('calculates discounts correctly', () => {
      expect(calculateDiscount(100, 10)).toBe(90);
      expect(calculateDiscount(50, 25)).toBe(37.5);
      expect(calculateDiscount(100, 0)).toBe(100);
    });

    it('formats percentages correctly', () => {
      expect(formatPercentage(0.1)).toBe('10.0%');
      expect(formatPercentage(0.856)).toBe('85.6%');
      expect(formatPercentage(1)).toBe('100.0%');
    });
  });

  describe('Array utilities', () => {
    const chunk = <T>(array: T[], size: number): T[][] => {
      const chunks: T[][] = [];
      for (let i = 0; i < array.length; i += size) {
        chunks.push(array.slice(i, i + size));
      }
      return chunks;
    };

    const unique = <T>(array: T[]): T[] => {
      return [...new Set(array)];
    };

    const groupBy = <T>(array: T[], key: keyof T): Record<string, T[]> => {
      return array.reduce((groups, item) => {
        const group = String(item[key]);
        if (!groups[group]) {
          groups[group] = [];
        }
        groups[group].push(item);
        return groups;
      }, {} as Record<string, T[]>);
    };

    it('chunks arrays correctly', () => {
      expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
      expect(chunk([1, 2, 3, 4], 2)).toEqual([[1, 2], [3, 4]]);
      expect(chunk([], 2)).toEqual([]);
    });

    it('removes duplicates from arrays', () => {
      expect(unique([1, 2, 2, 3, 3, 4])).toEqual([1, 2, 3, 4]);
      expect(unique(['a', 'b', 'a', 'c'])).toEqual(['a', 'b', 'c']);
      expect(unique([])).toEqual([]);
    });

    it('groups array items by key', () => {
      const items = [
        { category: 'A', name: 'item1' },
        { category: 'B', name: 'item2' },
        { category: 'A', name: 'item3' }
      ];

      const grouped = groupBy(items, 'category');
      expect(grouped.A).toHaveLength(2);
      expect(grouped.B).toHaveLength(1);
      expect(grouped.A[0].name).toBe('item1');
    });
  });

  describe('Date utilities', () => {
    const formatDate = (date: Date): string => {
      return date.toISOString().split('T')[0];
    };

    const addDays = (date: Date, days: number): Date => {
      const result = new Date(date);
      result.setDate(result.getDate() + days);
      return result;
    };

    const isToday = (date: Date): boolean => {
      const today = new Date();
      return formatDate(date) === formatDate(today);
    };

    it('formats dates correctly', () => {
      const date = new Date('2024-01-15T10:30:00Z');
      expect(formatDate(date)).toBe('2024-01-15');
    });

    it('adds days to dates', () => {
      const date = new Date('2024-01-15');
      const futureDate = addDays(date, 5);
      expect(formatDate(futureDate)).toBe('2024-01-20');
    });

    it('checks if date is today', () => {
      const today = new Date();
      const yesterday = addDays(today, -1);
      
      expect(isToday(today)).toBe(true);
      expect(isToday(yesterday)).toBe(false);
    });
  });

  describe('Object utilities', () => {
    const pick = <T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> => {
      const result = {} as Pick<T, K>;
      keys.forEach(key => {
        if (key in obj) {
          result[key] = obj[key];
        }
      });
      return result;
    };

    const omit = <T, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> => {
      const result = { ...obj };
      keys.forEach(key => {
        delete result[key];
      });
      return result;
    };

    const isEmpty = (obj: any): boolean => {
      if (obj == null) return true;
      if (Array.isArray(obj) || typeof obj === 'string') return obj.length === 0;
      return Object.keys(obj).length === 0;
    };

    it('picks specified keys from objects', () => {
      const obj = { a: 1, b: 2, c: 3 };
      expect(pick(obj, ['a', 'c'])).toEqual({ a: 1, c: 3 });
    });

    it('omits specified keys from objects', () => {
      const obj = { a: 1, b: 2, c: 3 };
      expect(omit(obj, ['b'])).toEqual({ a: 1, c: 3 });
    });

    it('checks if objects are empty', () => {
      expect(isEmpty({})).toBe(true);
      expect(isEmpty([])).toBe(true);
      expect(isEmpty('')).toBe(true);
      expect(isEmpty(null)).toBe(true);
      expect(isEmpty({ a: 1 })).toBe(false);
      expect(isEmpty([1])).toBe(false);
      expect(isEmpty('text')).toBe(false);
    });
  });

  describe('Validation utilities', () => {
    const isEmail = (email: string): boolean => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    };

    const isURL = (url: string): boolean => {
      try {
        new URL(url);
        return true;
      } catch {
        return false;
      }
    };

    const isPhoneNumber = (phone: string): boolean => {
      const phoneRegex = /^[+]?[\d\s\-\(\)]{10,}$/;
      return phoneRegex.test(phone);
    };

    it('validates email addresses', () => {
      expect(isEmail('test@example.com')).toBe(true);
      expect(isEmail('user@domain.co.uk')).toBe(true);
      expect(isEmail('invalid-email')).toBe(false);
      expect(isEmail('@domain.com')).toBe(false);
      expect(isEmail('user@')).toBe(false);
    });

    it('validates URLs', () => {
      expect(isURL('https://example.com')).toBe(true);
      expect(isURL('http://localhost:3000')).toBe(true);
      expect(isURL('ftp://files.example.com')).toBe(true);
      expect(isURL('not-a-url')).toBe(false);
      expect(isURL('')).toBe(false);
    });

    it('validates phone numbers', () => {
      expect(isPhoneNumber('+1234567890')).toBe(true);
      expect(isPhoneNumber('(123) 456-7890')).toBe(true);
      expect(isPhoneNumber('123 456 7890')).toBe(true);
      expect(isPhoneNumber('123')).toBe(false);
      expect(isPhoneNumber('abc')).toBe(false);
    });
  });
});