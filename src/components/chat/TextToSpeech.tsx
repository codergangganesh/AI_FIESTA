'use client'

import { useState, useRef } from 'react'
import { Play, Pause, Square, Volume2 } from 'lucide-react'

interface TextToSpeechProps {
  text: string
  isVisible?: boolean
}

export default function TextToSpeech({ text, isVisible = true }: TextToSpeechProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [currentPosition, setCurrentPosition] = useState(0)
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  const speak = () => {
    if (!('speechSynthesis' in window)) {
      alert('Text-to-speech is not supported in your browser')
      return
    }

    if (isPaused) {
      speechSynthesis.resume()
      setIsPaused(false)
      setIsPlaying(true)
      return
    }

    // Stop any ongoing speech
    speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utteranceRef.current = utterance

    utterance.rate = 0.9
    utterance.pitch = 1
    utterance.volume = 0.8

    utterance.onstart = () => {
      setIsPlaying(true)
      setIsPaused(false)
    }

    utterance.onend = () => {
      setIsPlaying(false)
      setIsPaused(false)
      setCurrentPosition(0)
    }

    utterance.onerror = () => {
      setIsPlaying(false)
      setIsPaused(false)
      setCurrentPosition(0)
    }

    speechSynthesis.speak(utterance)
  }

  const pause = () => {
    if (speechSynthesis.speaking && !speechSynthesis.paused) {
      speechSynthesis.pause()
      setIsPaused(true)
      setIsPlaying(false)
    }
  }

  const stop = () => {
    speechSynthesis.cancel()
    setIsPlaying(false)
    setIsPaused(false)
    setCurrentPosition(0)
  }

  if (!isVisible) return null

  return (
    <div className="flex items-center space-x-2 p-2 bg-slate-50/50 border border-slate-200/30 rounded-lg">
      <div className="flex items-center space-x-1">
        <Volume2 className="w-3 h-3 text-slate-500" />
        <span className="text-xs text-slate-600 font-medium">Listen</span>
      </div>
      
      <div className="flex items-center space-x-1">
        {!isPlaying && !isPaused && (
          <button
            onClick={speak}
            className="p-1.5 hover:bg-slate-200/50 rounded-md transition-colors"
            title="Play audio"
          >
            <Play className="w-3 h-3 text-slate-600" />
          </button>
        )}
        
        {isPlaying && (
          <button
            onClick={pause}
            className="p-1.5 hover:bg-slate-200/50 rounded-md transition-colors"
            title="Pause audio"
          >
            <Pause className="w-3 h-3 text-slate-600" />
          </button>
        )}
        
        {isPaused && (
          <button
            onClick={speak}
            className="p-1.5 hover:bg-slate-200/50 rounded-md transition-colors"
            title="Resume audio"
          >
            <Play className="w-3 h-3 text-slate-600" />
          </button>
        )}
        
        {(isPlaying || isPaused) && (
          <button
            onClick={stop}
            className="p-1.5 hover:bg-slate-200/50 rounded-md transition-colors"
            title="Stop audio"
          >
            <Square className="w-3 h-3 text-slate-600" />
          </button>
        )}
      </div>
      
      {isPlaying && (
        <div className="flex-1 flex items-center space-x-2">
          <div className="flex space-x-0.5">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-0.5 h-3 bg-blue-500 rounded-full animate-pulse"
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
          <span className="text-xs text-blue-600">Playing...</span>
        </div>
      )}
    </div>
  )
}