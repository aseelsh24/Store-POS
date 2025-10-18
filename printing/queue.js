const { cfg } = require('../config/index');

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const queue = [];
let busyWorkers = 0;

async function enqueuePrint(taskFn) {
  return new Promise((resolve) => {
    queue.push({ taskFn, resolve, retries: 0 });
    processQueue();
  });
}

async function processQueue() {
  if (busyWorkers >= cfg.PRINT_QUEUE_CONCURRENCY) {
    return;
  }

  const job = queue.shift();
  if (!job) {
    return;
  }

  busyWorkers++;

  try {
    const result = await job.taskFn();
    job.resolve({ ok: true, result });
  } catch (error) {
    console.error(`Print job failed (attempt ${job.retries + 1}):`, error.message);

    if (job.retries < cfg.PRINT_MAX_RETRY) {
      job.retries++;
      console.log(`Retrying print job in ${cfg.PRINT_RETRY_DELAY_MS}ms...`);
      await sleep(cfg.PRINT_RETRY_DELAY_MS);
      queue.unshift(job);
    } else {
      console.error(`Print job failed after ${cfg.PRINT_MAX_RETRY} attempts`);
      job.resolve({ ok: false, error: String(error.message || error) });
    }
  } finally {
    busyWorkers--;
    if (queue.length > 0) {
      processQueue();
    }
  }
}

function getQueueStatus() {
  return {
    queueLength: queue.length,
    busyWorkers: busyWorkers,
    maxConcurrency: cfg.PRINT_QUEUE_CONCURRENCY,
  };
}

module.exports = {
  enqueuePrint,
  getQueueStatus,
};
