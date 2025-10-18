const { enqueuePrint } = require('./queue');
const { cfg } = require('../config/index');

async function printReceipt(receiptData) {
  return enqueuePrint(async () => {
    if (!cfg.PRINTER_NAME) {
      console.warn('No printer configured. Skipping print.');
      return { orderId: receiptData.orderId, status: 'skipped', reason: 'no_printer' };
    }

    console.log(
      `Printing receipt for order ${receiptData.orderId} to printer: ${cfg.PRINTER_NAME}`
    );

    await simulatePrintOperation(receiptData);

    return { orderId: receiptData.orderId, status: 'printed' };
  });
}

async function simulatePrintOperation(receiptData) {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`Receipt printed successfully for order ${receiptData.orderId}`);
      resolve();
    }, 500);
  });
}

async function testPrint() {
  return printReceipt({
    orderId: 'TEST-' + Date.now(),
    items: [{ name: 'Test Item', quantity: 1, price: 10.0 }],
    total: 10.0,
  });
}

module.exports = {
  printReceipt,
  testPrint,
};
