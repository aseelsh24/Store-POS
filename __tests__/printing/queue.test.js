const { enqueuePrint, getQueueStatus } = require('../../printing/queue');

describe('Print Queue', () => {
  test('should enqueue and process print job successfully', async () => {
    const mockTask = jest.fn().mockResolvedValue({ printed: true });

    const result = await enqueuePrint(mockTask);

    expect(result.ok).toBe(true);
    expect(result.result.printed).toBe(true);
    expect(mockTask).toHaveBeenCalledTimes(1);
  });

  test('should retry failed print job', async () => {
    const mockTask = jest
      .fn()
      .mockRejectedValueOnce(new Error('Printer offline'))
      .mockResolvedValue({ printed: true });

    const result = await enqueuePrint(mockTask);

    expect(result.ok).toBe(true);
    expect(mockTask).toHaveBeenCalledTimes(2);
  }, 10000);

  test('should return error after max retries', async () => {
    const mockTask = jest.fn().mockRejectedValue(new Error('Printer offline'));

    const result = await enqueuePrint(mockTask);

    expect(result.ok).toBe(false);
    expect(result.error).toContain('Printer offline');
  }, 15000);

  test('should report queue status', () => {
    const status = getQueueStatus();

    expect(status).toHaveProperty('queueLength');
    expect(status).toHaveProperty('busyWorkers');
    expect(status).toHaveProperty('maxConcurrency');
    expect(typeof status.queueLength).toBe('number');
  });
});
