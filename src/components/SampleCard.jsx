import { useState } from 'react'
import { Play, Pause, Shield, Clock, DollarSign, Loader2 } from 'lucide-react'
import { LicenseTerms } from './LicenseTerms'
import { usePaymentContext } from '../hooks/usePaymentContext'
import { useBlockchainTransaction, useLicenseMarketplace } from '../hooks/useSampleSync'

export function SampleCard({ sample, variant = 'preview', onLicense }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [showLicenseTerms, setShowLicenseTerms] = useState(false)
  const { createSession } = usePaymentContext()
  const { executeLicenseTransaction, isProcessing } = useBlockchainTransaction()
  const { fetchOffers } = useLicenseMarketplace()

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
    // In a real app, this would control audio playback
  }

  const handleLicense = async () => {
    try {
      await createSession()
      onLicense(sample)
      setShowLicenseTerms(false)
    } catch (error) {
      console.error('Payment failed:', error)
    }
  }

  return (
    <div className="bg-dark-surface rounded-lg border border-gray-800 p-4 space-y-4 hover:border-gray-700 transition-colors">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-white truncate">{sample.title}</h3>
          <p className="text-sm text-gray-400 truncate">{sample.artist}</p>
        </div>
        
        <button
          onClick={handlePlayPause}
          className="w-10 h-10 bg-primary hover:bg-primary/80 rounded-full flex items-center justify-center transition-colors"
        >
          {isPlaying ? (
            <Pause className="w-4 h-4 text-white" />
          ) : (
            <Play className="w-4 h-4 text-white ml-0.5" />
          )}
        </button>
      </div>

      {/* Metadata */}
      <div className="space-y-2">
        {sample.confidence && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Match Confidence</span>
            <span className="text-white font-medium">{sample.confidence}%</span>
          </div>
        )}
        
        {sample.timestamp && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Timestamp
            </span>
            <span className="text-white font-medium">{sample.timestamp}</span>
          </div>
        )}
        
        {sample.rightsHolder && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400 flex items-center gap-1">
              <Shield className="w-3 h-3" />
              Rights Holder
            </span>
            <span className="text-white font-medium">{sample.rightsHolder}</span>
          </div>
        )}
      </div>

      {/* Price and License Button */}
      {variant === 'preview' && (
        <div className="pt-2 border-t border-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-accent font-semibold">
              <DollarSign className="w-4 h-4" />
              {sample.price || '$10'}
            </div>
            
            <button
              onClick={() => setShowLicenseTerms(true)}
              className="px-4 py-2 bg-accent hover:bg-accent/80 text-white rounded-md text-sm font-medium transition-colors"
            >
              License
            </button>
          </div>
        </div>
      )}

      {variant === 'licensed' && (
        <div className="pt-2 border-t border-gray-800">
          <div className="flex items-center justify-center gap-2 text-green-400">
            <Shield className="w-4 h-4" />
            <span className="text-sm font-medium">Licensed</span>
          </div>
        </div>
      )}

      {/* License Terms Modal */}
      {showLicenseTerms && (
        <LicenseTerms
          sample={sample}
          variant={sample.type || 'commercial'}
          onConfirm={handleLicense}
          onCancel={() => setShowLicenseTerms(false)}
        />
      )}
    </div>
  )
}
