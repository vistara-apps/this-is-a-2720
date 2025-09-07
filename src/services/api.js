// API Service Layer for SampleSync
import axios from 'axios'
import { OpenAI } from 'openai'

// Environment configuration
const API_CONFIG = {
  OPENAI_API_KEY: import.meta.env.VITE_OPENAI_API_KEY,
  ALCHEMY_API_KEY: import.meta.env.VITE_ALCHEMY_API_KEY,
  SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
  SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
  PINATA_API_KEY: import.meta.env.VITE_PINATA_API_KEY,
  PINATA_SECRET_KEY: import.meta.env.VITE_PINATA_SECRET_KEY,
  AIRSTACK_API_KEY: import.meta.env.VITE_AIRSTACK_API_KEY,
}

// OpenAI client for audio analysis and AI assistance
const openai = new OpenAI({
  apiKey: API_CONFIG.OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Note: In production, this should be handled server-side
})

// Supabase client setup
import { createClient } from '@supabase/supabase-js'
const supabase = createClient(API_CONFIG.SUPABASE_URL, API_CONFIG.SUPABASE_ANON_KEY)

// Alchemy client for blockchain interactions
const alchemyClient = axios.create({
  baseURL: `https://base-mainnet.g.alchemy.com/v2/${API_CONFIG.ALCHEMY_API_KEY}`,
  headers: {
    'Content-Type': 'application/json',
  }
})

// Airstack client for on-chain data queries
const airstackClient = axios.create({
  baseURL: 'https://api.airstack.xyz/gql',
  headers: {
    'Authorization': `Bearer ${API_CONFIG.AIRSTACK_API_KEY}`,
    'Content-Type': 'application/json',
  }
})

// Pinata client for IPFS storage
const pinataClient = axios.create({
  baseURL: 'https://api.pinata.cloud',
  headers: {
    'pinata_api_key': API_CONFIG.PINATA_API_KEY,
    'pinata_secret_api_key': API_CONFIG.PINATA_SECRET_KEY,
  }
})

export class SampleSyncAPI {
  // Audio Analysis Service
  static async analyzeSample(audioFile) {
    try {
      // Convert audio file to base64 for OpenAI
      const audioBuffer = await audioFile.arrayBuffer()
      const audioBase64 = btoa(String.fromCharCode(...new Uint8Array(audioBuffer)))
      
      // Use OpenAI's audio analysis capabilities
      const response = await openai.audio.transcriptions.create({
        file: audioFile,
        model: "whisper-1",
        response_format: "verbose_json",
        timestamp_granularities: ["segment"]
      })

      // Analyze transcription for potential sample identification
      const analysisPrompt = `
        Analyze this audio transcription and identify potential music samples:
        ${JSON.stringify(response)}
        
        Look for:
        1. Recognizable lyrics or phrases
        2. Distinctive musical patterns
        3. Known samples from popular songs
        
        Return a JSON array of potential samples with confidence scores.
      `

      const sampleAnalysis = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are an expert music sample identifier. Analyze audio transcriptions and identify potential samples with high accuracy."
          },
          {
            role: "user",
            content: analysisPrompt
          }
        ],
        response_format: { type: "json_object" }
      })

      const samples = JSON.parse(sampleAnalysis.choices[0].message.content)
      
      // Enhance with mock data for demonstration
      return samples.samples || [
        {
          title: "Amen Break",
          artist: "The Winstons",
          confidence: 95,
          timestamp: "0:32",
          rightsHolder: "Color Red Music",
          contactInfo: "licensing@colorredmusic.com",
          sampleSource: "Amen, Brother (1969)",
          metadata: {
            genre: "Funk",
            year: 1969,
            duration: "6 seconds",
            bpm: 136
          }
        },
        {
          title: "Think Break",
          artist: "Lyn Collins",
          confidence: 87,
          timestamp: "1:15",
          rightsHolder: "Universal Music Group",
          contactInfo: "clearance@umusic.com",
          sampleSource: "Think (About It) (1972)",
          metadata: {
            genre: "Funk",
            year: 1972,
            duration: "4 seconds",
            bpm: 126
          }
        }
      ]
    } catch (error) {
      console.error('Sample analysis failed:', error)
      throw new Error('Failed to analyze audio sample')
    }
  }

  // Rights Holder Discovery Service
  static async findRightsHolders(sampleData) {
    try {
      // Query Airstack for on-chain rights information
      const query = `
        query GetRightsHolders($artist: String!, $title: String!) {
          TokenNfts(
            input: {
              filter: {
                name: {_regex: $title},
                tokenType: {_in: [ERC721, ERC1155]}
              },
              blockchain: ethereum,
              limit: 10
            }
          ) {
            TokenNft {
              address
              tokenId
              name
              owner {
                addresses
                primaryDomain {
                  name
                }
              }
              metadata {
                name
                description
                attributes {
                  trait_type
                  value
                }
              }
            }
          }
        }
      `

      const response = await airstackClient.post('', {
        query,
        variables: {
          artist: sampleData.artist,
          title: sampleData.title
        }
      })

      // Process blockchain data and combine with traditional rights databases
      const onChainRights = response.data?.data?.TokenNfts?.TokenNft || []
      
      // Mock traditional rights holder data
      const traditionalRights = {
        publisher: sampleData.rightsHolder,
        contact: sampleData.contactInfo,
        verified: true,
        licenseTypes: ['commercial', 'shortClip', 'stems']
      }

      return {
        onChain: onChainRights,
        traditional: traditionalRights,
        combined: {
          ...traditionalRights,
          blockchainVerified: onChainRights.length > 0
        }
      }
    } catch (error) {
      console.error('Rights holder discovery failed:', error)
      return {
        onChain: [],
        traditional: {
          publisher: sampleData.rightsHolder,
          contact: sampleData.contactInfo,
          verified: false,
          licenseTypes: ['commercial', 'shortClip']
        }
      }
    }
  }

  // License Marketplace Service
  static async getLicenseOffers(sampleId) {
    try {
      const { data, error } = await supabase
        .from('license_offers')
        .select(`
          *,
          samples(*),
          rights_holders(*)
        `)
        .eq('sample_id', sampleId)

      if (error) throw error

      return data || [
        {
          offerId: 'offer_1',
          sampleId,
          licenseType: 'shortClip',
          price: 5.00,
          currency: 'USDC',
          terms: 'Non-commercial use, up to 30 seconds',
          duration: '1 year',
          territory: 'Worldwide'
        },
        {
          offerId: 'offer_2',
          sampleId,
          licenseType: 'commercial',
          price: 15.00,
          currency: 'USDC',
          terms: 'Commercial use with 5% revenue share',
          duration: 'Perpetual',
          territory: 'Worldwide'
        }
      ]
    } catch (error) {
      console.error('Failed to fetch license offers:', error)
      throw new Error('Unable to load license offers')
    }
  }

  // Blockchain Transaction Service
  static async createLicenseTransaction(licenseData, walletClient) {
    try {
      // Prepare transaction data for USDC payment
      const transactionData = {
        to: licenseData.rightsHolderAddress,
        value: 0, // USDC transfer, not ETH
        data: this.encodeLicenseData(licenseData)
      }

      // Execute transaction through wallet
      const txHash = await walletClient.sendTransaction(transactionData)
      
      // Monitor transaction status
      const receipt = await this.waitForTransaction(txHash)
      
      // Mint license NFT if transaction successful
      if (receipt.status === 'success') {
        const nftData = await this.mintLicenseNFT(licenseData, txHash)
        return {
          transactionHash: txHash,
          licenseNFT: nftData,
          status: 'success'
        }
      }

      throw new Error('Transaction failed')
    } catch (error) {
      console.error('License transaction failed:', error)
      throw new Error('Failed to complete license transaction')
    }
  }

  // DMCA Assistant Service
  static async generateDMCAResponse(noticeData) {
    try {
      const prompt = `
        Generate a professional DMCA counter-notice response for the following takedown notice:
        
        Original Notice: ${noticeData.originalNotice}
        Your Response: ${noticeData.userResponse}
        Evidence: ${noticeData.evidence}
        
        Create a legally sound counter-notice that:
        1. Follows DMCA counter-notice requirements
        2. Is professional and respectful
        3. Clearly states the basis for dispute
        4. Includes all required legal elements
        
        Format as a complete letter ready to send.
      `

      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are a legal assistant specializing in DMCA law. Generate professional, legally compliant counter-notice responses."
          },
          {
            role: "user",
            content: prompt
          }
        ]
      })

      return {
        counterNotice: response.choices[0].message.content,
        legalAdvice: "This is AI-generated content. Please review with a qualified attorney before submission.",
        nextSteps: [
          "Review the generated response carefully",
          "Consult with a qualified attorney",
          "Submit to the appropriate platform",
          "Keep records of all communications"
        ]
      }
    } catch (error) {
      console.error('DMCA response generation failed:', error)
      throw new Error('Failed to generate DMCA response')
    }
  }

  // IPFS Storage Service
  static async storeOnIPFS(data, type = 'json') {
    try {
      let formData = new FormData()
      
      if (type === 'file') {
        formData.append('file', data)
      } else {
        const jsonBlob = new Blob([JSON.stringify(data)], { type: 'application/json' })
        formData.append('file', jsonBlob, 'metadata.json')
      }

      const response = await pinataClient.post('/pinning/pinFileToIPFS', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      return {
        ipfsHash: response.data.IpfsHash,
        url: `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`
      }
    } catch (error) {
      console.error('IPFS storage failed:', error)
      throw new Error('Failed to store data on IPFS')
    }
  }

  // Database Operations
  static async saveTrack(trackData) {
    try {
      const { data, error } = await supabase
        .from('tracks')
        .insert([trackData])
        .select()

      if (error) throw error
      return data[0]
    } catch (error) {
      console.error('Failed to save track:', error)
      throw new Error('Unable to save track data')
    }
  }

  static async saveLicense(licenseData) {
    try {
      const { data, error } = await supabase
        .from('licenses')
        .insert([licenseData])
        .select()

      if (error) throw error
      return data[0]
    } catch (error) {
      console.error('Failed to save license:', error)
      throw new Error('Unable to save license data')
    }
  }

  static async getUserLicenses(userId) {
    try {
      const { data, error } = await supabase
        .from('licenses')
        .select(`
          *,
          license_offers(*),
          samples(*)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Failed to fetch user licenses:', error)
      return []
    }
  }

  // Helper methods
  static encodeLicenseData(licenseData) {
    // Encode license data for smart contract interaction
    // This would typically use ethers.js or similar library
    return '0x' + Buffer.from(JSON.stringify(licenseData)).toString('hex')
  }

  static async waitForTransaction(txHash) {
    // Monitor transaction status on Base network
    let attempts = 0
    const maxAttempts = 30

    while (attempts < maxAttempts) {
      try {
        const response = await alchemyClient.post('', {
          jsonrpc: '2.0',
          method: 'eth_getTransactionReceipt',
          params: [txHash],
          id: 1
        })

        if (response.data.result) {
          return {
            status: response.data.result.status === '0x1' ? 'success' : 'failed',
            receipt: response.data.result
          }
        }

        await new Promise(resolve => setTimeout(resolve, 2000))
        attempts++
      } catch (error) {
        console.error('Transaction monitoring error:', error)
        attempts++
      }
    }

    throw new Error('Transaction monitoring timeout')
  }

  static async mintLicenseNFT(licenseData, txHash) {
    // Mock NFT minting - in production this would interact with actual smart contract
    const metadata = {
      name: `License: ${licenseData.sampleTitle}`,
      description: `License for sample "${licenseData.sampleTitle}" by ${licenseData.artist}`,
      image: 'https://samplesync.app/license-nft.png',
      attributes: [
        { trait_type: 'License Type', value: licenseData.licenseType },
        { trait_type: 'Sample Title', value: licenseData.sampleTitle },
        { trait_type: 'Artist', value: licenseData.artist },
        { trait_type: 'Transaction Hash', value: txHash }
      ]
    }

    // Store metadata on IPFS
    const ipfsData = await this.storeOnIPFS(metadata)
    
    return {
      tokenId: Date.now().toString(),
      tokenURI: ipfsData.url,
      metadata,
      ipfsHash: ipfsData.ipfsHash
    }
  }
}

export default SampleSyncAPI
