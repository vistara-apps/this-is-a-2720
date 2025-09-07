import { useState } from 'react'
import { AppShell } from './components/AppShell'
import { AudioUploader } from './components/AudioUploader'
import { SampleCard } from './components/SampleCard'
import { LicenseTerms } from './components/LicenseTerms'
import { DMCAForm } from './components/DMCAForm'
import { LedgerRecord } from './components/LedgerRecord'
import { TransactionStatus } from './components/TransactionStatus'
import { ConnectButton } from '@rainbow-me/rainbowkit'

function App() {
  const [activeTab, setActiveTab] = useState('identify')
  const [detectedSamples, setDetectedSamples] = useState([])
  const [licenses, setLicenses] = useState([])
  const [transactionStatus, setTransactionStatus] = useState(null)

  return (
    <AppShell>
      <div className="min-h-screen bg-dark-bg">
        {/* Header */}
        <header className="bg-dark-surface border-b border-gray-800">
          <div className="container">
            <div className="flex items-center justify-between py-4">
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
                  <span className="text-white font-bold text-sm">SS</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">SampleSync</h1>
                  <p className="text-sm text-gray-400">Clear Sample Licenses. Create Freely.</p>
                </div>
              </div>
              <ConnectButton />
            </div>
          </div>
        </header>

        {/* Navigation */}
        <nav className="bg-dark-surface border-b border-gray-800">
          <div className="container">
            <div className="flex space-x-8 py-3">
              {[
                { id: 'identify', label: 'Identify Samples' },
                { id: 'marketplace', label: 'License Marketplace' },
                { id: 'dmca', label: 'DMCA Assistant' },
                { id: 'ledger', label: 'License Ledger' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="container py-8">
          {activeTab === 'identify' && (
            <div className="space-y-8">
              <div>
                <h2 className="heading text-white mb-4">Sample Identification</h2>
                <p className="body text-gray-400 mb-6">
                  Upload your track to automatically identify samples and find rights holders.
                </p>
                <AudioUploader 
                  onSamplesDetected={setDetectedSamples}
                  onTransactionStatus={setTransactionStatus}
                />
              </div>
              
              {detectedSamples.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Detected Samples</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {detectedSamples.map((sample, index) => (
                      <SampleCard 
                        key={index} 
                        sample={sample}
                        variant="preview"
                        onLicense={(sample) => {
                          setLicenses(prev => [...prev, sample])
                          setTransactionStatus({ status: 'success', message: 'License acquired successfully!' })
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'marketplace' && (
            <div className="space-y-8">
              <div>
                <h2 className="heading text-white mb-4">License Marketplace</h2>
                <p className="body text-gray-400 mb-6">
                  Browse and purchase licenses for popular samples.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Mock marketplace samples */}
                {[
                  { title: "Classic Break Beat", artist: "Vintage Drums", price: "$5", type: "commercial" },
                  { title: "Jazz Piano Loop", artist: "Blue Notes", price: "$8", type: "shortClip" },
                  { title: "Vocal Sample", artist: "Soul Singer", price: "$12", type: "commercial" }
                ].map((sample, index) => (
                  <SampleCard 
                    key={index} 
                    sample={sample}
                    variant="preview"
                    onLicense={(sample) => {
                      setLicenses(prev => [...prev, sample])
                      setTransactionStatus({ status: 'success', message: 'License purchased successfully!' })
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {activeTab === 'dmca' && (
            <div className="space-y-8">
              <div>
                <h2 className="heading text-white mb-4">DMCA Dispute Assistant</h2>
                <p className="body text-gray-400 mb-6">
                  Get AI-generated assistance for responding to DMCA takedown notices.
                </p>
              </div>
              <DMCAForm />
            </div>
          )}

          {activeTab === 'ledger' && (
            <div className="space-y-8">
              <div>
                <h2 className="heading text-white mb-4">License Ledger</h2>
                <p className="body text-gray-400 mb-6">
                  View your license history and provenance records.
                </p>
              </div>
              
              {licenses.length > 0 ? (
                <div className="space-y-4">
                  {licenses.map((license, index) => (
                    <LedgerRecord 
                      key={index} 
                      record={license}
                      variant="sampleLicense"
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-400">No licenses acquired yet. Start by identifying samples!</p>
                </div>
              )}
            </div>
          )}
        </main>

        {/* Transaction Status */}
        {transactionStatus && (
          <TransactionStatus 
            status={transactionStatus.status}
            message={transactionStatus.message}
            onClose={() => setTransactionStatus(null)}
          />
        )}
      </div>
    </AppShell>
  )
}

export default App