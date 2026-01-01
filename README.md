# mint_meme — Meme Token Factory (Hardhat + Next.js)

A minimal full-stack sample demonstrating a token factory on Ethereum (Hardhat) with a Next.js frontend for listing, creating and buying tokens.

This repository includes:

- Smart contracts: `Factory.sol` (token factory) and `Token.sol` (ERC20 token)
- Tests covering creation, buying, deposits and withdrawals (`/test/Factory.js`)
- A simple Next.js app (app/) that interacts with the deployed factory
- Hardhat Ignition module for deterministic local deployment (`/ignition/modules/Factory.js`)

---

## Quick start — Local development

Prerequisites

- Node.js (v16+ recommended)
- npm or yarn

Install

```bash
git clone https://github.com/ayushn2/mint_meme.git
cd mint_meme
npm install
```

Start a local Hardhat node

```bash
npx hardhat node
```

Compile contracts

```bash
npx hardhat compile
```

Run tests

```bash
npx hardhat test
# or with gas report
REPORT_GAS=true npx hardhat test
```

Deploy locally (Hardhat Ignition)

```bash
# Deploy the Factory module to the running node (31337)
npx hardhat ignition deploy ./ignition/modules/Factory.js --network localhost
```

After deployment update `app/config.json` with the deployed Factory address for the network you used (the repo includes an example address for `31337`).

Run the frontend

```bash
npm run dev
# open http://localhost:3000
```

---

## Project structure 🔧

- `contracts/` — Solidity contracts (`Factory.sol`, `Token.sol`)
- `test/` — Hardhat tests (`Factory.js`)
- `artifacts/`, `cache/`, `build-info/` — Hardhat build outputs
- `ignition/modules/Factory.js` — Hardhat Ignition module for deploying Factory
- `app/` — Next.js application (React components in `/app/components/`)
  - `config.json` — front-end network / contract address configuration
- `public/` — static assets

---

## Contracts — summary 💡

Factory.sol

- Allows creators to pay a small fee and create a new ERC20 token
- Tokens are listed for sale in a simple token sale model
- Buyers can purchase tokens; sale closes when targets/limits are reached
- Creator can deposit remaining tokens and withdraw ETH raised

Token.sol

- Basic ERC20 token (OpenZeppelin)
- `owner` (factory) holds initial supply, `creator` is recorded

Read the Solidity files for full details and comments.

---

## Frontend (Next.js) 

- The frontend is built with Next.js using the `app/` directory.
- It reads deployed contract addresses from `app/config.json`. Update this file after deploying to a new network or address.
- Components of interest:
  - `CreateToken.jsx` — create/list a new token via the Factory
  - `List.jsx` — list tokens and sales
  - `Token.jsx` — token detail and buy UI
  - `Trade.jsx` — buying tokens

To interact locally, connect MetaMask to your local Hardhat node (chainId 31337) and use the accounts printed by `npx hardhat node`.

---

## Testing & CI

Run the test suite:

```bash
npx hardhat test
```

Tests cover:

- Factory deployment and fee/owner checks
- Token creation logic and initial balances
- Buying behavior, sale state, and deposit/withdraw flows

---

## Notes & Security

- This is an educational sample, not production-ready. Do not use as-is for real value transfers.
- Gas, re-entrancy, and economic edge-cases are simplified for clarity.
- Always audit and write comprehensive tests before production use.

---

## Contributing 

Contributions welcome — open an issue or a pull request. Please include tests for any change to smart-contract logic.

---

## License

This project is licensed under the ISC License (see `package.json`).

---

If you'd like, I can also add an example `deploy` script, CI configuration (GitHub Actions), or expand the frontend docs for common flows.
