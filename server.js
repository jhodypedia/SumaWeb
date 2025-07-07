const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');
const { ethers } = require('ethers');
const Satsuma = require('@satsuma/sdk');

const app = express();
const PORT = 3000;
const RPC_URL = 'https://rpc.testnet.citrea.xyz';
const HISTORY_FILE = 'swap_history.json';

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Pastikan file JSON ada
if (!fs.existsSync(HISTORY_FILE)) {
  fs.writeFileSync(HISTORY_FILE, JSON.stringify([]));
}

// API Swap Token
app.post('/swap', async (req, res) => {
  const { privateKey } = req.body;

  if (!privateKey || !privateKey.startsWith('0x')) {
    return res.status(400).json({ error: 'Private key tidak valid' });
  }

  try {
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const wallet = new ethers.Wallet(privateKey, provider);
    const satsuma = new Satsuma.SatsumaSDK({
      provider,
      signer: wallet,
      chainId: 'citrea-testnet'
    });

    const wcbtc = await satsuma.getTokenBySymbol('WCBTC');
    const suma = await satsuma.getTokenBySymbol('SUMA');

    const token = new ethers.Contract(wcbtc.address, ['function balanceOf(address) view returns (uint256)'], wallet);
    const balance = await token.balanceOf(wallet.address);

    if (balance <= 0n) {
      return res.status(400).json({ error: 'Saldo WCBTC kosong' });
    }

    const amountIn = balance * 10n / 100n;

    const quote = await satsuma.quoteExactInput({
      tokenIn: wcbtc.address,
      tokenOut: suma.address,
      amountIn
    });

    const tx = await satsuma.swapExactInput({
      tokenIn: wcbtc.address,
      tokenOut: suma.address,
      amountIn,
      amountOutMin: quote.amountOut * 95n / 100n,
      recipient: wallet.address
    });

    await tx.wait();

    // Simpan histori
    const newData = {
      address: wallet.address,
      amountIn: ethers.formatUnits(amountIn, wcbtc.decimals),
      amountOut: ethers.formatUnits(quote.amountOut, suma.decimals),
      txHash: tx.hash,
      timestamp: new Date().toISOString()
    };

    const history = JSON.parse(fs.readFileSync(HISTORY_FILE));
    history.push(newData);
    fs.writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 2));

    res.json({
      success: true,
      txHash: tx.hash,
      explorer: `https://explorer.testnet.citrea.xyz/tx/${tx.hash}`,
      ...newData
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Terjadi kesalahan saat swap' });
  }
});

// API tampilkan histori
app.get('/history', (req, res) => {
  const history = JSON.parse(fs.readFileSync(HISTORY_FILE));
  res.json(history);
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
