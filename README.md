# SampleSync 🎵

**Clear Sample Licenses. Create Freely.**

SampleSync is a platform for remix artists to automate sample clearance and rights management using AI and on-chain technologies. Built on Base blockchain with USDC payments and NFT license provenance.

## 🚀 Features

### Core Functionality
- **🎯 Automated Sample Identification** - Upload tracks and AI identifies potential samples using OpenAI Whisper
- **🔍 Rights Holder Discovery** - Find sample owners through blockchain queries and traditional databases
- **🏪 Standardized License Marketplace** - Pre-defined licensing tiers for various usage scenarios
- **⛓️ On-Chain License Transactions** - Secure USDC payments and NFT license minting on Base
- **⚖️ DMCA Dispute Assistant** - AI-generated legal templates for copyright disputes
- **📋 License Provenance Ledger** - Immutable record of all sample licenses and usage rights

### Technical Features
- **Web3 Integration** - RainbowKit + Wagmi for wallet connections
- **AI-Powered Analysis** - OpenAI for audio analysis and legal assistance
- **Blockchain Infrastructure** - Base network with Alchemy API
- **Decentralized Storage** - IPFS via Pinata for metadata and files
- **Real-time Database** - Supabase for application data
- **Modern UI/UX** - React + Tailwind CSS with shadcn/ui components

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icons

### Web3 & Blockchain
- **RainbowKit** - Wallet connection interface
- **Wagmi** - React hooks for Ethereum
- **Viem** - TypeScript interface for Ethereum
- **Base Network** - L2 blockchain for transactions
- **Alchemy** - Blockchain infrastructure

### Backend Services
- **OpenAI** - Audio analysis and AI assistance
- **Supabase** - Database and authentication
- **Pinata** - IPFS storage
- **Airstack** - On-chain data queries

## 📋 Prerequisites

Before running SampleSync, you'll need:

1. **Node.js 18+** and **npm/yarn**
2. **API Keys** for the following services:
   - OpenAI API key
   - Alchemy API key (Base network)
   - Supabase project credentials
   - Pinata API credentials
   - Airstack API key
   - WalletConnect Project ID

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone https://github.com/vistara-apps/this-is-a-2720.git
cd this-is-a-2720
npm install
```

### 2. Environment Setup

```bash
cp .env.example .env
```

Edit `.env` with your API keys:

```env
# Required API Keys
VITE_OPENAI_API_KEY=your_openai_api_key
VITE_ALCHEMY_API_KEY=your_alchemy_api_key
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_PINATA_API_KEY=your_pinata_api_key
VITE_PINATA_SECRET_KEY=your_pinata_secret_key
VITE_AIRSTACK_API_KEY=your_airstack_api_key
VITE_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
```

### 3. Database Setup

Set up your Supabase database with the provided schema:

```sql
-- Run this SQL in your Supabase SQL editor
-- (See src/lib/database.js for the complete schema)

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
  user_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address text UNIQUE,
  email text,
  display_name text,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

-- Additional tables for tracks, samples, licenses, etc.
-- (Full schema available in src/lib/database.js)
```

### 4. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:5173` to see SampleSync in action!

## 🏗️ Project Structure

```
src/
├── components/          # React components
│   ├── AppShell.jsx    # Main app layout
│   ├── AudioUploader.jsx # File upload with AI analysis
│   ├── SampleCard.jsx  # Sample display and licensing
│   ├── LicenseTerms.jsx # License agreement UI
│   ├── DMCAForm.jsx    # DMCA dispute assistant
│   └── ...
├── hooks/              # Custom React hooks
│   ├── useSampleSync.js # Main app functionality hooks
│   └── usePaymentContext.js # Payment processing
├── services/           # API integrations
│   └── api.js         # SampleSync API service layer
├── lib/               # Utilities and configurations
│   └── database.js    # Database schema and models
└── App.jsx           # Main application component
```

## 🎯 User Flows

### Sample Identification & Licensing
1. **Upload Audio** - User uploads track or provides URL
2. **AI Analysis** - OpenAI identifies potential samples
3. **Rights Discovery** - System finds rights holders via blockchain/databases
4. **License Selection** - User reviews available license offers
5. **Payment & NFT** - USDC payment creates license NFT on Base
6. **Provenance Record** - Transaction recorded on blockchain

### DMCA Dispute Resolution
1. **Upload Notice** - User provides DMCA takedown notice
2. **AI Analysis** - OpenAI analyzes notice and generates response
3. **Review & Edit** - User reviews AI-generated counter-notice
4. **Submit Response** - User submits dispute through platform
5. **Track Progress** - System logs dispute for reference

## 🔧 Configuration

### Blockchain Configuration
- **Network**: Base Mainnet (Chain ID: 8453)
- **Currency**: USDC for license payments
- **NFTs**: ERC-721 tokens for license provenance

### AI Configuration
- **Audio Analysis**: OpenAI Whisper for transcription
- **Sample Identification**: GPT-4 for pattern recognition
- **Legal Assistance**: GPT-4 for DMCA response generation

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Vercel

```bash
npm install -g vercel
vercel --prod
```

### Environment Variables in Production

Ensure all environment variables are set in your deployment platform:
- Vercel: Project Settings → Environment Variables
- Netlify: Site Settings → Environment Variables

## 🧪 Development

### Mock Data Mode

For development without API keys, enable mock data:

```env
VITE_ENABLE_MOCK_DATA=true
```

### Debug Mode

Enable detailed logging:

```env
VITE_DEBUG_MODE=true
```

## 📚 API Documentation

### SampleSync API Service

The main API service (`src/services/api.js`) provides:

- `analyzeSample(audioFile)` - AI-powered sample identification
- `findRightsHolders(sampleData)` - Rights holder discovery
- `getLicenseOffers(sampleId)` - Available license options
- `createLicenseTransaction(licenseData, walletClient)` - Blockchain licensing
- `generateDMCAResponse(noticeData)` - AI legal assistance
- `storeOnIPFS(data)` - Decentralized storage

### Database Models

Type-safe models for all entities:
- `User` - User profiles and wallet addresses
- `Track` - Uploaded audio tracks
- `Sample` - Identified samples and metadata
- `LicenseOffer` - Available licensing terms
- `License` - Acquired licenses and NFTs
- `DMCADispute` - Copyright dispute records

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check this README and code comments
- **Issues**: Open a GitHub issue for bugs or feature requests
- **Community**: Join our Discord for discussions

## 🎵 About SampleSync

SampleSync bridges the gap between creative freedom and legal compliance in music production. By automating sample clearance and providing transparent, blockchain-verified licensing, we enable artists to create without fear while ensuring rights holders are fairly compensated.

**Built with ❤️ for the music community**

---

*SampleSync - Clear Sample Licenses. Create Freely.* 🎵
