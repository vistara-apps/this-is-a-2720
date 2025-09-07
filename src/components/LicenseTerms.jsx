import { X, FileText, DollarSign, Clock, Users } from 'lucide-react'

export function LicenseTerms({ sample, variant = 'commercial', onConfirm, onCancel }) {
  const getTermsConfig = () => {
    switch (variant) {
      case 'shortClip':
        return {
          title: 'Short Clip License',
          description: 'Limited use for short clips and previews',
          duration: 'Up to 30 seconds',
          usage: 'Non-commercial use only',
          distribution: 'Social media, demos',
          price: sample.price || '$5'
        }
      case 'commercial':
        return {
          title: 'Commercial License',
          description: 'Full commercial rights with revenue sharing',
          duration: 'Full track usage',
          usage: 'Commercial releases allowed',
          distribution: 'All platforms and media',
          price: sample.price || '$15'
        }
      default:
        return {
          title: 'Standard License',
          description: 'Standard usage rights',
          duration: 'Full track usage',
          usage: 'Personal and limited commercial',
          distribution: 'Most platforms',
          price: sample.price || '$10'
        }
    }
  }

  const terms = getTermsConfig()

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-dark-surface rounded-lg border border-gray-800 w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <div>
            <h2 className="text-lg font-semibold text-white">{terms.title}</h2>
            <p className="text-sm text-gray-400">{sample.title} by {sample.artist}</p>
          </div>
          <button
            onClick={onCancel}
            className="w-8 h-8 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div>
            <h3 className="font-medium text-white mb-2">{terms.description}</h3>
          </div>

          {/* Terms Details */}
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-white">Duration</p>
                <p className="text-sm text-gray-400">{terms.duration}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <FileText className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-white">Usage Rights</p>
                <p className="text-sm text-gray-400">{terms.usage}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Users className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-white">Distribution</p>
                <p className="text-sm text-gray-400">{terms.distribution}</p>
              </div>
            </div>
          </div>

          {/* Price */}
          <div className="bg-gray-800/50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">License Fee</span>
              <div className="flex items-center gap-1 text-accent font-semibold">
                <DollarSign className="w-4 h-4" />
                {terms.price}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2 border border-gray-600 text-gray-400 rounded-md hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-2 bg-accent hover:bg-accent/80 text-white rounded-md font-medium transition-colors"
            >
              Pay & License
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}