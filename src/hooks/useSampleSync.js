// Custom hooks for SampleSync functionality
import { useState, useEffect, useCallback } from 'react'
import { useAccount, useWalletClient } from 'wagmi'
import SampleSyncAPI from '../services/api'
import { User, Track, License } from '../lib/database'

// Main hook for sample analysis and identification
export function useSampleAnalysis() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [detectedSamples, setDetectedSamples] = useState([])
  const [error, setError] = useState(null)

  const analyzeSample = useCallback(async (audioFile) => {
    setIsAnalyzing(true)
    setError(null)
    
    try {
      const samples = await SampleSyncAPI.analyzeSample(audioFile)
      setDetectedSamples(samples)
      return samples
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setIsAnalyzing(false)
    }
  }, [])

  const clearResults = useCallback(() => {
    setDetectedSamples([])
    setError(null)
  }, [])

  return {
    analyzeSample,
    clearResults,
    isAnalyzing,
    detectedSamples,
    error
  }
}

// Hook for managing user licenses
export function useLicenses() {
  const { address } = useAccount()
  const [licenses, setLicenses] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchLicenses = useCallback(async () => {
    if (!address) return

    setLoading(true)
    setError(null)

    try {
      const userLicenses = await SampleSyncAPI.getUserLicenses(address)
      setLicenses(userLicenses.map(license => new License(license)))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [address])

  useEffect(() => {
    fetchLicenses()
  }, [fetchLicenses])

  const addLicense = useCallback((newLicense) => {
    setLicenses(prev => [new License(newLicense), ...prev])
  }, [])

  return {
    licenses,
    loading,
    error,
    fetchLicenses,
    addLicense
  }
}

// Hook for license marketplace functionality
export function useLicenseMarketplace() {
  const [offers, setOffers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchOffers = useCallback(async (sampleId) => {
    setLoading(true)
    setError(null)

    try {
      const licenseOffers = await SampleSyncAPI.getLicenseOffers(sampleId)
      setOffers(licenseOffers)
      return licenseOffers
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    offers,
    loading,
    error,
    fetchOffers
  }
}

// Hook for blockchain transactions
export function useBlockchainTransaction() {
  const { data: walletClient } = useWalletClient()
  const [isProcessing, setIsProcessing] = useState(false)
  const [transactionHash, setTransactionHash] = useState(null)
  const [error, setError] = useState(null)

  const executeLicenseTransaction = useCallback(async (licenseData) => {
    if (!walletClient) {
      throw new Error('Wallet not connected')
    }

    setIsProcessing(true)
    setError(null)
    setTransactionHash(null)

    try {
      const result = await SampleSyncAPI.createLicenseTransaction(licenseData, walletClient)
      setTransactionHash(result.transactionHash)
      return result
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setIsProcessing(false)
    }
  }, [walletClient])

  const resetTransaction = useCallback(() => {
    setTransactionHash(null)
    setError(null)
  }, [])

  return {
    executeLicenseTransaction,
    resetTransaction,
    isProcessing,
    transactionHash,
    error
  }
}

// Hook for DMCA dispute assistance
export function useDMCAAssistant() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedResponse, setGeneratedResponse] = useState(null)
  const [error, setError] = useState(null)

  const generateCounterNotice = useCallback(async (noticeData) => {
    setIsGenerating(true)
    setError(null)

    try {
      const response = await SampleSyncAPI.generateDMCAResponse(noticeData)
      setGeneratedResponse(response)
      return response
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setIsGenerating(false)
    }
  }, [])

  const clearResponse = useCallback(() => {
    setGeneratedResponse(null)
    setError(null)
  }, [])

  return {
    generateCounterNotice,
    clearResponse,
    isGenerating,
    generatedResponse,
    error
  }
}

// Hook for rights holder discovery
export function useRightsHolders() {
  const [rightsHolders, setRightsHolders] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const findRightsHolders = useCallback(async (sampleData) => {
    setLoading(true)
    setError(null)

    try {
      const holders = await SampleSyncAPI.findRightsHolders(sampleData)
      setRightsHolders(prev => ({
        ...prev,
        [sampleData.title]: holders
      }))
      return holders
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    rightsHolders,
    loading,
    error,
    findRightsHolders
  }
}

// Hook for user profile management
export function useUserProfile() {
  const { address, isConnected } = useAccount()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const createOrUpdateUser = useCallback(async (userData) => {
    if (!address) return

    setLoading(true)
    setError(null)

    try {
      // In a real implementation, this would call the API
      const userProfile = new User({
        user_id: crypto.randomUUID(),
        wallet_address: address,
        ...userData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      
      setUser(userProfile)
      return userProfile
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [address])

  useEffect(() => {
    if (isConnected && address && !user) {
      createOrUpdateUser({ display_name: `User ${address.slice(0, 6)}...` })
    }
  }, [isConnected, address, user, createOrUpdateUser])

  return {
    user,
    loading,
    error,
    createOrUpdateUser
  }
}

// Hook for track management
export function useTrackManagement() {
  const { address } = useAccount()
  const [tracks, setTracks] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const saveTrack = useCallback(async (trackData) => {
    if (!address) throw new Error('Wallet not connected')

    setLoading(true)
    setError(null)

    try {
      const track = await SampleSyncAPI.saveTrack({
        ...trackData,
        user_id: address
      })
      
      const newTrack = new Track(track)
      setTracks(prev => [newTrack, ...prev])
      return newTrack
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [address])

  const updateTrackSamples = useCallback((trackId, samples) => {
    setTracks(prev => prev.map(track => 
      track.trackId === trackId 
        ? { ...track, detectedSamples: samples, analysisStatus: 'completed' }
        : track
    ))
  }, [])

  return {
    tracks,
    loading,
    error,
    saveTrack,
    updateTrackSamples
  }
}

// Hook for notification management
export function useNotifications() {
  const [notifications, setNotifications] = useState([])

  const addNotification = useCallback((notification) => {
    const id = crypto.randomUUID()
    const newNotification = {
      id,
      timestamp: new Date(),
      ...notification
    }
    
    setNotifications(prev => [newNotification, ...prev])
    
    // Auto-remove after 5 seconds for success/info notifications
    if (notification.type !== 'error') {
      setTimeout(() => {
        removeNotification(id)
      }, 5000)
    }
    
    return id
  }, [])

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }, [])

  const clearAll = useCallback(() => {
    setNotifications([])
  }, [])

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAll
  }
}

// Hook for application state management
export function useAppState() {
  const [activeTab, setActiveTab] = useState('identify')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState(null)

  const openModal = useCallback((modalType, data = null) => {
    setModalOpen({ type: modalType, data })
  }, [])

  const closeModal = useCallback(() => {
    setModalOpen(null)
  }, [])

  return {
    activeTab,
    setActiveTab,
    sidebarOpen,
    setSidebarOpen,
    modalOpen,
    openModal,
    closeModal
  }
}

// Hook for local storage persistence
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error)
      return initialValue
    }
  })

  const setValue = useCallback((value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error)
    }
  }, [key, storedValue])

  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key)
      setStoredValue(initialValue)
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error)
    }
  }, [key, initialValue])

  return [storedValue, setValue, removeValue]
}

export default {
  useSampleAnalysis,
  useLicenses,
  useLicenseMarketplace,
  useBlockchainTransaction,
  useDMCAAssistant,
  useRightsHolders,
  useUserProfile,
  useTrackManagement,
  useNotifications,
  useAppState,
  useLocalStorage
}
