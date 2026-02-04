/**
 * x402 Payment middleware
 */
const USDC_CONTRACT_BASE = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';
const PRICE_ATOMIC = '500';

function requirePayment(walletAddress) {
  return (req, res, next) => {
    if (req.headers['x-payment']) return next();

    const paymentRequirements = {
      x402Version: 2,
      accepts: [{ scheme: 'exact', network: 'eip155:8453', amount: PRICE_ATOMIC, payTo: walletAddress, asset: USDC_CONTRACT_BASE }]
    };

    res.status(402);
    res.setHeader('PAYMENT-REQUIRED', Buffer.from(JSON.stringify(paymentRequirements)).toString('base64'));
    res.json({ message: 'Payment required', price: '$0.0005 USDC', network: 'Base' });
  };
}

module.exports = { requirePayment };
