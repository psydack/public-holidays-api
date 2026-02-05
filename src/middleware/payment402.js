/**
 * x402 Payment middleware using official server implementation
 */
const { paymentMiddleware } = require('@x402/express');
const { x402ResourceServer, HTTPFacilitatorClient } = require('@x402/core/server');
const { registerExactEvmScheme } = require('@x402/evm/exact/server');

const FACILITATOR_URL = process.env.FACILITATOR_URL || 'https://x402.org/facilitator';
const NETWORK = process.env.NETWORK || 'eip155:84532';
const PRICE = '$0.00025';

function createX402Middleware(walletAddress) {
  const facilitatorClient = new HTTPFacilitatorClient({ url: FACILITATOR_URL });
  const x402Server = new x402ResourceServer(facilitatorClient);
  registerExactEvmScheme(x402Server);

  const x402Routes = {
    'POST /holidays': {
      accepts: [{ scheme: 'exact', price: PRICE, network: NETWORK, payTo: walletAddress }],
      description: 'Get public holidays for a country and year',
      mimeType: 'application/json'
    },
    'POST /is-business-day': {
      accepts: [{ scheme: 'exact', price: PRICE, network: NETWORK, payTo: walletAddress }],
      description: 'Check if a date is a business day',
      mimeType: 'application/json'
    },
    'POST /next-business-day': {
      accepts: [{ scheme: 'exact', price: PRICE, network: NETWORK, payTo: walletAddress }],
      description: 'Get the next business day',
      mimeType: 'application/json'
    },
    'POST /count-business-days': {
      accepts: [{ scheme: 'exact', price: PRICE, network: NETWORK, payTo: walletAddress }],
      description: 'Count business days between dates',
      mimeType: 'application/json'
    }
  };

  return paymentMiddleware(x402Routes, x402Server);
}

module.exports = { createX402Middleware };
