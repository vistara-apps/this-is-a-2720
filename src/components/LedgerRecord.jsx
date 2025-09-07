import { Shield, DollarSign, Calendar, ExternalLink } from 'lucide-react'

export function LedgerRecord({ record, variant = 'sampleLicense' }) {
  const formatDate = (date) => {
    return new Date(date || Date.now()).toLocaleDateString()
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-400'
      case 'expired': return 'text-red-400'
      case 'pending': return 'text-yellow-400'
      default: return 'text-gray-400'
    }
  }

  return (
    <div className="bg-dark-surface rounded-lg border border-gray-800 p-4">
      <div className="flex items-start justify-between">
        <div className="flex-1 space-y-3">
          {/* Header */}
          <div className="flex items-center gap-3">
            {variant === 'sampleLicense' ? (
              <Shield className="w-5 h-5 text-accent" />
            ) : (
              <DollarSign className="w-5 h-5 text-green-400" />
            )}
            <div>
              <h3 className="font-semibold text-white">{record.title || 'Sample License'}</h3>
              <p className="text-sm text-gray-400">{record.artist || 'Unknown Artist'}</p>
            </div>
          </div>

          {/* Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-400">License Type</span>
              <p className="text-white font-medium">{record.type || 'Commercial'}</p>
            </div>
            
            <div>
              <span className="text-gray-400">Price Paid</span>
              <p className="text-white font-medium">{record.price || '$10'}</p>
            </div>
            
            <div>
              <span className="text-gray-400">Date Acquired</span>
              <p className="text-white font-medium">{formatDate(record.date)}</p>
            </div>
          </div>

          {/* Status */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-800">
            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-sm">Status:</span>
              <span className={`text-sm font-medium ${getStatusColor(record.status || 'active')}`}>
                {record.status || 'Active'}
              </span>
            </div>
            
            {record.transactionHash && (
              <button className="flex items-center gap-1 text-accent hover:text-accent/80 text-sm transition-colors">
                <ExternalLink className="w-3 h-3" />
                View on Chain
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}