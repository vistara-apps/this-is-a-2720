import { useState, useRef } from 'react'
import { Upload, Music, Loader2 } from 'lucide-react'
import { useSampleAnalysis, useTrackManagement } from '../hooks/useSampleSync'
import SampleSyncAPI from '../services/api'

export function AudioUploader({ variant = 'dragAndDrop', onSamplesDetected, onTransactionStatus }) {
  const [isDragging, setIsDragging] = useState(false)
  const [uploadedFile, setUploadedFile] = useState(null)
  const fileInputRef = useRef(null)
  
  const { analyzeSample, isAnalyzing, error } = useSampleAnalysis()
  const { saveTrack } = useTrackManagement()

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileUpload(files[0])
    }
  }

  const handleFileInput = (e) => {
    const file = e.target.files[0]
    if (file) {
      handleFileUpload(file)
    }
  }

  const handleFileUpload = async (file) => {
    if (!file.type.startsWith('audio/')) {
      onTransactionStatus({ status: 'failed', message: 'Please upload an audio file' })
      return
    }

    setUploadedFile(file)
    onTransactionStatus({ status: 'pending', message: 'Analyzing audio file...' })

    try {
      // Save track to database first
      const trackData = await saveTrack({
        title: file.name.replace(/\.[^/.]+$/, ""), // Remove file extension
        audio_file_url: URL.createObjectURL(file), // In production, upload to cloud storage
        analysis_status: 'analyzing'
      })

      // Analyze the sample using AI
      const detectedSamples = await analyzeSample(file)
      
      // Update track with detected samples
      if (trackData) {
        // In a real implementation, update the track in the database
        console.log('Track saved:', trackData)
      }
      
      onSamplesDetected(detectedSamples)
      onTransactionStatus({ status: 'success', message: 'Sample analysis complete!' })
    } catch (err) {
      console.error('Analysis failed:', err)
      onTransactionStatus({ 
        status: 'failed', 
        message: error || 'Failed to analyze audio file' 
      })
    }
  }

  if (variant === 'fileInput') {
    return (
      <div className="space-y-4">
        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*"
          onChange={handleFileInput}
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full p-4 border-2 border-dashed border-gray-600 rounded-lg hover:border-primary transition-colors"
        >
          <Upload className="w-6 h-6 mx-auto mb-2 text-gray-400" />
          <p className="text-gray-400">Click to upload audio file</p>
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer
          ${isDragging ? 'border-primary bg-primary/10' : 'border-gray-600 hover:border-primary/50'}
        `}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*"
          onChange={handleFileInput}
          className="hidden"
        />
        
        {isAnalyzing ? (
          <div className="space-y-4">
            <Loader2 className="w-12 h-12 mx-auto animate-spin text-primary" />
            <div>
              <p className="text-white font-medium">Analyzing Audio...</p>
              <p className="text-gray-400 text-sm">Identifying samples using AI</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto bg-gray-800 rounded-lg flex items-center justify-center">
              {uploadedFile ? (
                <Music className="w-8 h-8 text-primary" />
              ) : (
                <Upload className="w-8 h-8 text-gray-400" />
              )}
            </div>
            <div>
              <p className="text-white font-medium">
                {uploadedFile ? uploadedFile.name : 'Drop your audio file here'}
              </p>
              <p className="text-gray-400 text-sm">
                or click to browse • MP3, WAV, FLAC supported
              </p>
            </div>
          </div>
        )}
      </div>
      
      <div className="text-center">
        <p className="text-gray-400 text-sm">
          Maximum file size: 100MB • Files are processed securely and privately
        </p>
      </div>
    </div>
  )
}
