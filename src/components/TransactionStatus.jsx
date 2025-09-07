import { CheckCircle, AlertCircle, Loader2, X } from 'lucide-react'

export function TransactionStatus({ status, message, onClose, variant = status }) {
  const getStatusConfig = () => {
    switch (variant) {
      case 'pending':
        return {
          icon: <Loader2 className="w-5 h-5 animate-spin" />,
          bgColor: 'bg-yellow-500/10 border-yellow-500/20',
          textColor: 'text-yellow-400',
          iconColor: 'text-yellow-400'
        }
      case 'success':
        return {
          icon: <CheckCircle className="w-5 h-5" />,
          bgColor: 'bg-green-500/10 border-green-500/20',
          textColor: 'text-green-400',
          iconColor: 'text-green-400'
        }
      case 'failed':
        return {
          icon: <AlertCircle className="w-5 h-5" />,
          bgColor: 'bg-red-500/10 border-red-500/20',
          textColor: 'text-red-400',
          iconColor: 'text-red-400'
        }
      default:
        return {
          icon: <AlertCircle className="w-5 h-5" />,
          bgColor: 'bg-gray-500/10 border-gray-500/20',
          textColor: 'text-gray-400',
          iconColor: 'text-gray-400'
        }
    }
  }

  const config = getStatusConfig()

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-slide-up">
      <div className={`
        flex items-center gap-3 px-4 py-3 rounded-lg border backdrop-blur-sm
        ${config.bgColor}
      `}>
        <div className={config.iconColor}>
          {config.icon}
        </div>
        
        <div className="flex-1">
          <p className={`text-sm font-medium ${config.textColor}`}>
            {message}
          </p>
        </div>
        
        {onClose && (
          <button
            onClick={onClose}
            className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        )}
      </div>
    </div>
  )
}