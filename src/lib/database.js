// Database Schema and Models for SampleSync
// This file defines the Supabase database structure and provides model interfaces

export const DATABASE_SCHEMA = {
  // Users table
  users: {
    user_id: 'uuid PRIMARY KEY DEFAULT gen_random_uuid()',
    wallet_address: 'text UNIQUE',
    email: 'text',
    display_name: 'text',
    created_at: 'timestamp DEFAULT now()',
    updated_at: 'timestamp DEFAULT now()'
  },

  // Tracks table
  tracks: {
    track_id: 'uuid PRIMARY KEY DEFAULT gen_random_uuid()',
    user_id: 'uuid REFERENCES users(user_id)',
    title: 'text NOT NULL',
    audio_file_url: 'text',
    detected_samples: 'jsonb DEFAULT \'[]\'',
    analysis_status: 'text DEFAULT \'pending\'',
    created_at: 'timestamp DEFAULT now()',
    updated_at: 'timestamp DEFAULT now()'
  },

  // Samples table
  samples: {
    sample_id: 'uuid PRIMARY KEY DEFAULT gen_random_uuid()',
    original_artist: 'text NOT NULL',
    sample_source: 'text NOT NULL',
    owner_id: 'uuid REFERENCES users(user_id)',
    metadata: 'jsonb DEFAULT \'{}\'',
    verified: 'boolean DEFAULT false',
    created_at: 'timestamp DEFAULT now()',
    updated_at: 'timestamp DEFAULT now()'
  },

  // Rights Holders table
  rights_holders: {
    rights_holder_id: 'uuid PRIMARY KEY DEFAULT gen_random_uuid()',
    user_id: 'uuid REFERENCES users(user_id)',
    company_name: 'text',
    contact_info: 'jsonb DEFAULT \'{}\'',
    verified: 'boolean DEFAULT false',
    blockchain_address: 'text',
    created_at: 'timestamp DEFAULT now()',
    updated_at: 'timestamp DEFAULT now()'
  },

  // License Offers table
  license_offers: {
    offer_id: 'uuid PRIMARY KEY DEFAULT gen_random_uuid()',
    sample_id: 'uuid REFERENCES samples(sample_id)',
    rights_holder_id: 'uuid REFERENCES rights_holders(rights_holder_id)',
    license_type: 'text NOT NULL',
    price: 'decimal(10,2) NOT NULL',
    currency: 'text DEFAULT \'USDC\'',
    terms: 'text',
    duration: 'text',
    territory: 'text DEFAULT \'Worldwide\'',
    active: 'boolean DEFAULT true',
    created_at: 'timestamp DEFAULT now()',
    updated_at: 'timestamp DEFAULT now()'
  },

  // Licenses table
  licenses: {
    license_id: 'uuid PRIMARY KEY DEFAULT gen_random_uuid()',
    user_id: 'uuid REFERENCES users(user_id)',
    offer_id: 'uuid REFERENCES license_offers(offer_id)',
    transaction_hash: 'text',
    license_token_uri: 'text',
    nft_token_id: 'text',
    start_date: 'timestamp DEFAULT now()',
    end_date: 'timestamp',
    usage_terms: 'text',
    status: 'text DEFAULT \'active\'',
    created_at: 'timestamp DEFAULT now()',
    updated_at: 'timestamp DEFAULT now()'
  },

  // DMCA Disputes table
  dmca_disputes: {
    dispute_id: 'uuid PRIMARY KEY DEFAULT gen_random_uuid()',
    user_id: 'uuid REFERENCES users(user_id)',
    original_notice: 'text NOT NULL',
    counter_notice: 'text',
    evidence: 'jsonb DEFAULT \'{}\'',
    status: 'text DEFAULT \'pending\'',
    platform: 'text',
    created_at: 'timestamp DEFAULT now()',
    updated_at: 'timestamp DEFAULT now()'
  },

  // License Provenance table (for blockchain tracking)
  license_provenance: {
    provenance_id: 'uuid PRIMARY KEY DEFAULT gen_random_uuid()',
    license_id: 'uuid REFERENCES licenses(license_id)',
    transaction_hash: 'text NOT NULL',
    block_number: 'bigint',
    event_type: 'text NOT NULL',
    event_data: 'jsonb DEFAULT \'{}\'',
    ipfs_hash: 'text',
    created_at: 'timestamp DEFAULT now()'
  }
}

// SQL statements for creating tables
export const CREATE_TABLES_SQL = `
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  user_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address text UNIQUE,
  email text,
  display_name text,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

-- Tracks table
CREATE TABLE IF NOT EXISTS tracks (
  track_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(user_id),
  title text NOT NULL,
  audio_file_url text,
  detected_samples jsonb DEFAULT '[]',
  analysis_status text DEFAULT 'pending',
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

-- Samples table
CREATE TABLE IF NOT EXISTS samples (
  sample_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  original_artist text NOT NULL,
  sample_source text NOT NULL,
  owner_id uuid REFERENCES users(user_id),
  metadata jsonb DEFAULT '{}',
  verified boolean DEFAULT false,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

-- Rights Holders table
CREATE TABLE IF NOT EXISTS rights_holders (
  rights_holder_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(user_id),
  company_name text,
  contact_info jsonb DEFAULT '{}',
  verified boolean DEFAULT false,
  blockchain_address text,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

-- License Offers table
CREATE TABLE IF NOT EXISTS license_offers (
  offer_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sample_id uuid REFERENCES samples(sample_id),
  rights_holder_id uuid REFERENCES rights_holders(rights_holder_id),
  license_type text NOT NULL,
  price decimal(10,2) NOT NULL,
  currency text DEFAULT 'USDC',
  terms text,
  duration text,
  territory text DEFAULT 'Worldwide',
  active boolean DEFAULT true,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

-- Licenses table
CREATE TABLE IF NOT EXISTS licenses (
  license_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(user_id),
  offer_id uuid REFERENCES license_offers(offer_id),
  transaction_hash text,
  license_token_uri text,
  nft_token_id text,
  start_date timestamp DEFAULT now(),
  end_date timestamp,
  usage_terms text,
  status text DEFAULT 'active',
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

-- DMCA Disputes table
CREATE TABLE IF NOT EXISTS dmca_disputes (
  dispute_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(user_id),
  original_notice text NOT NULL,
  counter_notice text,
  evidence jsonb DEFAULT '{}',
  status text DEFAULT 'pending',
  platform text,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

-- License Provenance table
CREATE TABLE IF NOT EXISTS license_provenance (
  provenance_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  license_id uuid REFERENCES licenses(license_id),
  transaction_hash text NOT NULL,
  block_number bigint,
  event_type text NOT NULL,
  event_data jsonb DEFAULT '{}',
  ipfs_hash text,
  created_at timestamp DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_tracks_user_id ON tracks(user_id);
CREATE INDEX IF NOT EXISTS idx_samples_owner_id ON samples(owner_id);
CREATE INDEX IF NOT EXISTS idx_license_offers_sample_id ON license_offers(sample_id);
CREATE INDEX IF NOT EXISTS idx_licenses_user_id ON licenses(user_id);
CREATE INDEX IF NOT EXISTS idx_licenses_offer_id ON licenses(offer_id);
CREATE INDEX IF NOT EXISTS idx_dmca_disputes_user_id ON dmca_disputes(user_id);
CREATE INDEX IF NOT EXISTS idx_license_provenance_license_id ON license_provenance(license_id);
CREATE INDEX IF NOT EXISTS idx_users_wallet_address ON users(wallet_address);

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tracks_updated_at BEFORE UPDATE ON tracks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_samples_updated_at BEFORE UPDATE ON samples FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_rights_holders_updated_at BEFORE UPDATE ON rights_holders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_license_offers_updated_at BEFORE UPDATE ON license_offers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_licenses_updated_at BEFORE UPDATE ON licenses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_dmca_disputes_updated_at BEFORE UPDATE ON dmca_disputes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
`;

// Model classes for type safety and data validation
export class User {
  constructor(data) {
    this.userId = data.user_id
    this.walletAddress = data.wallet_address
    this.email = data.email
    this.displayName = data.display_name
    this.createdAt = data.created_at
    this.updatedAt = data.updated_at
  }

  static validate(data) {
    const errors = []
    if (!data.wallet_address) errors.push('Wallet address is required')
    if (data.email && !this.isValidEmail(data.email)) errors.push('Invalid email format')
    return errors
  }

  static isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }
}

export class Track {
  constructor(data) {
    this.trackId = data.track_id
    this.userId = data.user_id
    this.title = data.title
    this.audioFileUrl = data.audio_file_url
    this.detectedSamples = data.detected_samples || []
    this.analysisStatus = data.analysis_status || 'pending'
    this.createdAt = data.created_at
    this.updatedAt = data.updated_at
  }

  static validate(data) {
    const errors = []
    if (!data.title) errors.push('Track title is required')
    if (!data.user_id) errors.push('User ID is required')
    return errors
  }
}

export class Sample {
  constructor(data) {
    this.sampleId = data.sample_id
    this.originalArtist = data.original_artist
    this.sampleSource = data.sample_source
    this.ownerId = data.owner_id
    this.metadata = data.metadata || {}
    this.verified = data.verified || false
    this.createdAt = data.created_at
    this.updatedAt = data.updated_at
  }

  static validate(data) {
    const errors = []
    if (!data.original_artist) errors.push('Original artist is required')
    if (!data.sample_source) errors.push('Sample source is required')
    return errors
  }
}

export class LicenseOffer {
  constructor(data) {
    this.offerId = data.offer_id
    this.sampleId = data.sample_id
    this.rightsHolderId = data.rights_holder_id
    this.licenseType = data.license_type
    this.price = parseFloat(data.price)
    this.currency = data.currency || 'USDC'
    this.terms = data.terms
    this.duration = data.duration
    this.territory = data.territory || 'Worldwide'
    this.active = data.active !== false
    this.createdAt = data.created_at
    this.updatedAt = data.updated_at
  }

  static validate(data) {
    const errors = []
    if (!data.sample_id) errors.push('Sample ID is required')
    if (!data.rights_holder_id) errors.push('Rights holder ID is required')
    if (!data.license_type) errors.push('License type is required')
    if (!data.price || data.price <= 0) errors.push('Valid price is required')
    return errors
  }

  static TYPES = {
    SHORT_CLIP: 'shortClip',
    COMMERCIAL: 'commercial',
    STEMS: 'stems',
    EXCLUSIVE: 'exclusive'
  }
}

export class License {
  constructor(data) {
    this.licenseId = data.license_id
    this.userId = data.user_id
    this.offerId = data.offer_id
    this.transactionHash = data.transaction_hash
    this.licenseTokenUri = data.license_token_uri
    this.nftTokenId = data.nft_token_id
    this.startDate = data.start_date
    this.endDate = data.end_date
    this.usageTerms = data.usage_terms
    this.status = data.status || 'active'
    this.createdAt = data.created_at
    this.updatedAt = data.updated_at
  }

  static validate(data) {
    const errors = []
    if (!data.user_id) errors.push('User ID is required')
    if (!data.offer_id) errors.push('Offer ID is required')
    return errors
  }

  static STATUS = {
    ACTIVE: 'active',
    EXPIRED: 'expired',
    REVOKED: 'revoked',
    PENDING: 'pending'
  }

  isActive() {
    if (this.status !== License.STATUS.ACTIVE) return false
    if (this.endDate && new Date(this.endDate) < new Date()) return false
    return true
  }
}

export class DMCADispute {
  constructor(data) {
    this.disputeId = data.dispute_id
    this.userId = data.user_id
    this.originalNotice = data.original_notice
    this.counterNotice = data.counter_notice
    this.evidence = data.evidence || {}
    this.status = data.status || 'pending'
    this.platform = data.platform
    this.createdAt = data.created_at
    this.updatedAt = data.updated_at
  }

  static validate(data) {
    const errors = []
    if (!data.user_id) errors.push('User ID is required')
    if (!data.original_notice) errors.push('Original notice is required')
    return errors
  }

  static STATUS = {
    PENDING: 'pending',
    SUBMITTED: 'submitted',
    RESOLVED: 'resolved',
    REJECTED: 'rejected'
  }
}

// Utility functions for database operations
export const DatabaseUtils = {
  // Convert camelCase to snake_case for database columns
  toSnakeCase(obj) {
    const result = {}
    for (const [key, value] of Object.entries(obj)) {
      const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`)
      result[snakeKey] = value
    }
    return result
  },

  // Convert snake_case to camelCase for JavaScript objects
  toCamelCase(obj) {
    const result = {}
    for (const [key, value] of Object.entries(obj)) {
      const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
      result[camelKey] = value
    }
    return result
  },

  // Validate UUID format
  isValidUUID(uuid) {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    return uuidRegex.test(uuid)
  },

  // Generate pagination metadata
  getPaginationMeta(total, page, limit) {
    const totalPages = Math.ceil(total / limit)
    return {
      total,
      page,
      limit,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1
    }
  }
}

export default {
  DATABASE_SCHEMA,
  CREATE_TABLES_SQL,
  User,
  Track,
  Sample,
  LicenseOffer,
  License,
  DMCADispute,
  DatabaseUtils
}
