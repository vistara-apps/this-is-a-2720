import { useState } from 'react'
import { FileText, Brain, Download, Upload, Loader2, AlertTriangle } from 'lucide-react'
import { useDMCAAssistant } from '../hooks/useSampleSync'

export function DMCAForm({ variant = 'initial' }) {
  const [formType, setFormType] = useState(variant)
  const [noticeText, setNoticeText] = useState('')
  const [evidence, setEvidence] = useState('')
  const [platform, setPlatform] = useState('')
  
  const { 
    generateCounterNotice, 
    isGenerating, 
    generatedResponse, 
    error,
    clearResponse 
  } = useDMCAAssistant()

  const generateResponse = async () => {
    if (!noticeText.trim()) return

    try {
      const response = await generateCounterNotice({
        originalNotice: noticeText,
        userResponse: evidence,
        evidence: evidence,
        platform: platform
      })
      
      // The response is now available in generatedResponse from the hook
    } catch (err) {
      console.error('Failed to generate DMCA response:', err)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Form Type Selector */}
      <div className="flex gap-2 p-1 bg-gray-800 rounded-lg">
        <button
          onClick={() => setFormType('initial')}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            formType === 'initial'
              ? 'bg-primary text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Initial Response
        </button>
        <button
          onClick={() => setFormType('counterDispute')}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            formType === 'counterDispute'
              ? 'bg-primary text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Counter Dispute
        </button>
      </div>

      {/* Notice Input */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            <FileText className="w-4 h-4 inline mr-2" />
            DMCA Notice Content
          </label>
          <textarea
            value={noticeText}
            onChange={(e) => setNoticeText(e.target.value)}
            placeholder="Paste the DMCA takedown notice here..."
            className="w-full h-32 p-3 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:border-primary focus:outline-none"
          />
        </div>

        <button
          onClick={generateResponse}
          disabled={!noticeText.trim() || isGenerating}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-accent hover:bg-accent/80 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-md font-medium transition-colors"
        >
          {isGenerating ? (
            <>
              <Brain className="w-4 h-4 animate-pulse" />
              Generating AI Response...
            </>
          ) : (
            <>
              <Brain className="w-4 h-4" />
              Generate AI Response
            </>
          )}
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <p className="text-red-400 text-sm flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            {error}
          </p>
        </div>
      )}

      {/* Generated Response */}
      {generatedResponse && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Generated Response
            </label>
            <textarea
              value={generatedResponse}
              readOnly
              className="w-full h-64 p-3 bg-gray-800 border border-gray-600 rounded-md text-white focus:border-primary focus:outline-none"
            />
          </div>

          <div className="flex gap-3">
            <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-600 text-gray-400 rounded-md hover:bg-gray-800 transition-colors">
              <Upload className="w-4 h-4" />
              Submit Response
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary hover:bg-primary/80 text-white rounded-md transition-colors">
              <Download className="w-4 h-4" />
              Download PDF
            </button>
          </div>
        </div>
      )}

      {/* Legal Disclaimer */}
      <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
        <p className="text-amber-400 text-sm">
          <strong>Legal Disclaimer:</strong> This AI-generated response is for informational purposes only and does not constitute legal advice. Please consult with a qualified attorney before submitting any legal documents.
        </p>
      </div>
    </div>
  )
}
