import { cn } from '../cn';

describe('cn', () => {
  it('should merge class names correctly', () => {
    const result = cn('flex', 'items-center', 'justify-center');
    expect(result).toBe('flex items-center justify-center');
  });

  it('should handle conditional classes', () => {
    const isActive = true;
    const result = cn('base-class', isActive && 'active-class', 'another-class');
    expect(result).toBe('base-class active-class another-class');
  });

  it('should handle falsy values', () => {
    const result = cn('base-class', false, null, undefined, '', 'valid-class');
    expect(result).toBe('base-class valid-class');
  });

  it('should merge conflicting Tailwind classes correctly', () => {
    const result = cn('p-2', 'p-4');
    expect(result).toBe('p-4');
  });

  it('should handle arrays of classes', () => {
    const result = cn(['flex', 'items-center'], 'justify-center');
    expect(result).toBe('flex items-center justify-center');
  });

  it('should handle objects with conditional classes', () => {
    const result = cn({
      'flex': true,
      'items-center': true,
      'hidden': false,
      'justify-center': true
    });
    expect(result).toBe('flex items-center justify-center');
  });

  it('should handle complex combinations', () => {
    const isActive = true;
    const isDisabled = false;
    const result = cn(
      'base-class',
      ['flex', 'items-center'],
      {
        'active': isActive,
        'disabled': isDisabled,
        'text-blue-500': true
      },
      isActive && 'bg-blue-100',
      'final-class'
    );
    expect(result).toBe('base-class flex items-center active text-blue-500 bg-blue-100 final-class');
  });

  it('should return empty string when no valid classes provided', () => {
    const result = cn('', null, undefined, false);
    expect(result).toBe('');
  });
});