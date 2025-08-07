import { colors } from '../colors';

describe('colors', () => {
  it('should export a colors object', () => {
    expect(colors).toBeDefined();
    expect(typeof colors).toBe('object');
  });

  it('should have dark color palette', () => {
    expect(colors.dark).toBeDefined();
    expect(colors.dark.DEFAULT).toBe('#0A0B0D');
    expect(colors.dark[50]).toBe('#F8FAFC');
    expect(colors.dark[100]).toBe('#2A2D32');
    expect(colors.dark[200]).toBe('#1E2228');
    expect(colors.dark[300]).toBe('#1A1D21');
  });

  it('should have surface color palette', () => {
    expect(colors.surface).toBeDefined();
    expect(colors.surface.DEFAULT).toBe('#1A1D21');
    expect(colors.surface.elevated).toBe('#2A2D32');
    expect(colors.surface.overlay).toBe('#363A42');
  });

  it('should have text color palette', () => {
    expect(colors.text).toBeDefined();
    expect(colors.text.primary).toBe('#F8FAFC');
    expect(colors.text.secondary).toBe('#CBD5E1');
    expect(colors.text.muted).toBe('#94A3B8');
    expect(colors.text.disabled).toBe('#64748B');
  });

  it('should have aqua color palette', () => {
    expect(colors.aqua).toBeDefined();
    expect(colors.aqua.DEFAULT).toBe('#10F5D4');
    expect(colors.aqua[500]).toBe('#10F5D4');
  });

  it('should have emerald color palette', () => {
    expect(colors.emerald).toBeDefined();
    expect(colors.emerald.DEFAULT).toBe('#6EE7B7');
    expect(colors.emerald[300]).toBe('#6EE7B7');
  });

  it('should have teal color palette', () => {
    expect(colors.teal).toBeDefined();
    expect(colors.teal.DEFAULT).toBe('#5EEAD4');
    expect(colors.teal[300]).toBe('#5EEAD4');
  });

  it('should have accent color palette', () => {
    expect(colors.accent).toBeDefined();
    expect(colors.accent.primary).toBe('#10F5D4');
    expect(colors.accent.secondary).toBe('#6EE7B7');
    expect(colors.accent.tertiary).toBe('#5EEAD4');
    expect(colors.accent.hover).toBe('#0FD9C4');
  });

  it('should have gray color palette', () => {
    expect(colors.gray).toBeDefined();
    expect(colors.gray[50]).toBe('#F8FAFC');
    expect(colors.gray[900]).toBe('#0F172A');
  });

  it('should have support color palette', () => {
    expect(colors.support).toBeDefined();
    expect(colors.support.success).toBe('#10B981');
    expect(colors.support.warning).toBe('#F59E0B');
    expect(colors.support.error).toBe('#EF4444');
    expect(colors.support.info).toBe('#3B82F6');
  });

  it('should have consistent color format (hex codes)', () => {
    const hexColorRegex = /^#[0-9A-F]{6}$/i;
    
    // Test a sample of colors from each palette
    expect(colors.dark.DEFAULT).toMatch(hexColorRegex);
    expect(colors.accent.primary).toMatch(hexColorRegex);
    expect(colors.support.error).toMatch(hexColorRegex);
    expect(colors.text.primary).toMatch(hexColorRegex);
  });

  it('should have all required color palettes', () => {
    const requiredPalettes = [
      'dark',
      'surface',
      'text',
      'aqua',
      'emerald',
      'teal',
      'accent',
      'gray',
      'support'
    ];

    requiredPalettes.forEach(palette => {
      expect(colors).toHaveProperty(palette);
    });
  });
});