import { debounce } from '../utils';

describe('debounce', () => {
  beforeEach(() => {
    jest.clearAllTimers();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should call the function after the specified delay', () => {
    const mockFn = jest.fn();
    const debouncedFn = debounce(mockFn, 300);

    debouncedFn('test');
    expect(mockFn).not.toHaveBeenCalled();

    jest.advanceTimersByTime(300);
    expect(mockFn).toHaveBeenCalledWith('test');
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it('should cancel previous calls if called again within delay', () => {
    const mockFn = jest.fn();
    const debouncedFn = debounce(mockFn, 300);

    debouncedFn('first');
    jest.advanceTimersByTime(200);
    
    debouncedFn('second');
    jest.advanceTimersByTime(200);
    
    expect(mockFn).not.toHaveBeenCalled();

    jest.advanceTimersByTime(100);
    expect(mockFn).toHaveBeenCalledWith('second');
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it('should pass multiple arguments to the debounced function', () => {
    const mockFn = jest.fn();
    const debouncedFn = debounce(mockFn, 300);

    debouncedFn('arg1', 'arg2', 123);
    jest.advanceTimersByTime(300);

    expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2', 123);
  });

  it('should work with different delay times', () => {
    const mockFn = jest.fn();
    const debouncedFn = debounce(mockFn, 500);

    debouncedFn('test');
    jest.advanceTimersByTime(400);
    expect(mockFn).not.toHaveBeenCalled();

    jest.advanceTimersByTime(100);
    expect(mockFn).toHaveBeenCalledWith('test');
  });

  it('should handle multiple debounced functions independently', () => {
    const mockFn1 = jest.fn();
    const mockFn2 = jest.fn();
    const debouncedFn1 = debounce(mockFn1, 200);
    const debouncedFn2 = debounce(mockFn2, 400);

    debouncedFn1('first');
    debouncedFn2('second');

    jest.advanceTimersByTime(200);
    expect(mockFn1).toHaveBeenCalledWith('first');
    expect(mockFn2).not.toHaveBeenCalled();

    jest.advanceTimersByTime(200);
    expect(mockFn2).toHaveBeenCalledWith('second');
  });
});