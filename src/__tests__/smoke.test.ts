describe('Test Setup', () => {
  it('should run tests successfully', () => {
    expect(1 + 1).toBe(2);
  });

  it('should have access to Jest globals', () => {
    expect(jest).toBeDefined();
    expect(expect).toBeDefined();
    expect(describe).toBeDefined();
    expect(it).toBeDefined();
  });

  it('should handle async operations', async () => {
    const result = await Promise.resolve('test');
    expect(result).toBe('test');
  });
});