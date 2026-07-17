import { useEffect, useRef, useState } from 'react'
import logo from './assets/logo_loopGroup.png'
import card3 from './assets/photocard-3pic.png'
import card6 from './assets/photocard-6pic.png'
import card9 from './assets/photocard-9pic-id.png'
import './App.css'

const TEMPLATES = [
  {
    id: 3,
    label: '3 PHOTOS',
    asset: card3,
    width: 361,
    height: 932,
    columns: 1,
    slots: [
      { x: 59, y: 62, width: 242, height: 221 },
      { x: 59, y: 311, width: 242, height: 222 },
      { x: 59, y: 560, width: 242, height: 222 },
    ],
  },
  {
    id: 6,
    label: '6 PHOTOS',
    asset: card6,
    width: 642,
    height: 932,
    columns: 2,
    slots: [
      { x: 59, y: 62, width: 242, height: 221 },
      { x: 336, y: 62, width: 243, height: 221 },
      { x: 59, y: 311, width: 242, height: 222 },
      { x: 337, y: 311, width: 242, height: 222 },
      { x: 59, y: 560, width: 242, height: 222 },
      { x: 337, y: 560, width: 242, height: 222 },
    ],
  },
  {
    id: 9,
    label: '9 PHOTOS',
    asset: card9,
    width: 684,
    height: 932,
    columns: 3,
    slots: [
      { x: 48, y: 47, width: 168, height: 252 },
      { x: 255, y: 47, width: 168, height: 252 },
      { x: 463, y: 47, width: 167, height: 252 },
      { x: 48, y: 339, width: 168, height: 252 },
      { x: 255, y: 339, width: 168, height: 252 },
      { x: 463, y: 339, width: 167, height: 252 },
      { x: 48, y: 630, width: 168, height: 253 },
      { x: 255, y: 630, width: 168, height: 253 },
      { x: 463, y: 630, width: 167, height: 253 },
    ],
  },
]

const FILTERS = [
  { id: 'normal', label: 'ORIGINAL', css: 'none' },
  { id: 'warm', label: 'WARM', css: 'saturate(1.15) sepia(.22) contrast(1.04) brightness(1.04)' },
  { id: 'mono', label: 'B&W', css: 'grayscale(1) contrast(1.14)' },
  { id: 'vintage', label: 'VINTAGE', css: 'sepia(.48) saturate(.78) contrast(.94) brightness(1.05)' },
  { id: 'cool', label: 'COOL', css: 'saturate(.88) hue-rotate(172deg) brightness(1.03) contrast(1.04)' },
]

const HISTORY_POSITIONS = [
  { left: '4%', top: '4%', width: '20%', rotate: '-7deg' },
  { left: '31%', top: '7%', width: '23%', rotate: '5deg' },
  { left: '66%', top: '3%', width: '18%', rotate: '-4deg' },
  { left: '8%', top: '45%', width: '21%', rotate: '6deg' },
  { left: '40%', top: '41%', width: '25%', rotate: '-6deg' },
  { left: '72%', top: '51%', width: '17%', rotate: '4deg' },
  { left: '3%', top: '57%', width: '20%', rotate: '7deg' },
  { left: '57%', top: '60%', width: '17%', rotate: '-5deg' },
]

const SOUND_STYLES = ['CLASSIC', 'SOFT', 'RETRO']

const FLASH_COLORS = {
  normal: '#ffffff',
  warm: '#ffe2b8',
  mono: '#f4f4f4',
  vintage: '#f0d1a1',
  cool: '#c9e9ff',
}

const FEATURE_LIST = [
  { icon: '◉', title: 'PRIVATE PHOTOBOOTH', copy: 'Photos are created and kept on this device only.' },
  { icon: '✦', title: 'RANDOM FILTER', copy: 'Turn it on to get a surprise filter on every snap.' },
  { icon: '♫', title: 'BOOTH SOUNDS', copy: 'Choose from Classic, Soft, and Retro shutter sounds—or go completely silent.' },
  { icon: '▣', title: 'PHOTO BOARD', copy: 'Keep every finished strip on your board and shake it into a new arrangement.' },
  { icon: '⧉', title: 'COPY & DOWNLOAD', copy: 'Copy a finished card or save it as a full-quality PNG.' },
  { icon: '◷', title: 'OPTIONAL TIMER', copy: 'Shoot instantly or turn on the 10-second timer when everyone needs time to pose.' },
]

const UPDATE_LOG = [
  {
    date: '18 JUL 2026',
    version: 'v0.4 — MOBILE RELIABILITY UPDATE',
    items: [
      'Filters are now rendered directly into photo pixels for consistent mobile captures.',
      'Rebuilt Save Image with Blob downloads and the native iOS share sheet.',
      'Added clear saving, saved, shared, and retry feedback.',
    ],
  },
  {
    date: '15 JUL 2026',
    version: 'v0.3 — THE PLAYFUL BOOTH UPDATE',
    items: [
      'Added Random Filter for a different look on every snap.',
      'Added Classic, Soft, and Retro shutter sounds.',
      'Added Silent Booth, mood-colored flash, vibration, and the final ding.',
      'Added Copy Image and Shake the Board.',
      'The 10-second timer now starts turned off.',
    ],
  },
  {
    date: '14 JUL 2026',
    version: 'v0.2 — THE PHOTO BOARD UPDATE',
    items: [
      'Added the expandable blue photo board.',
      'Added a sliding card drawer with visible card previews.',
      'Improved card opacity, overlap, board proportions, and drawer motion.',
    ],
  },
]

let boothAudioContext

function getBoothAudioContext() {
  if (!boothAudioContext) {
    const AudioContext = window.AudioContext || window.webkitAudioContext
    if (!AudioContext) return null
    boothAudioContext = new AudioContext()
  }
  if (boothAudioContext.state === 'suspended') boothAudioContext.resume().catch(() => {})
  return boothAudioContext
}

function playTone(context, frequency, duration, type = 'sine', volume = .06, delay = 0) {
  const oscillator = context.createOscillator()
  const gain = context.createGain()
  const start = context.currentTime + delay
  oscillator.type = type
  oscillator.frequency.setValueAtTime(frequency, start)
  gain.gain.setValueAtTime(.0001, start)
  gain.gain.exponentialRampToValueAtTime(volume, start + .012)
  gain.gain.exponentialRampToValueAtTime(.0001, start + duration)
  oscillator.connect(gain).connect(context.destination)
  oscillator.start(start)
  oscillator.stop(start + duration + .02)
}

function playNoise(context, duration, volume = .05, delay = 0) {
  const frameCount = Math.ceil(context.sampleRate * duration)
  const buffer = context.createBuffer(1, frameCount, context.sampleRate)
  const channel = buffer.getChannelData(0)
  for (let index = 0; index < frameCount; index += 1) channel[index] = Math.random() * 2 - 1
  const source = context.createBufferSource()
  const gain = context.createGain()
  const start = context.currentTime + delay
  source.buffer = buffer
  gain.gain.setValueAtTime(volume, start)
  gain.gain.exponentialRampToValueAtTime(.0001, start + duration)
  source.connect(gain).connect(context.destination)
  source.start(start)
}

function playBoothSound(kind, style = 'CLASSIC', isSilent = false) {
  if (isSilent) return
  const context = getBoothAudioContext()
  if (!context) return

  if (kind === 'curtain') {
    playNoise(context, .42, .035)
    playTone(context, 150, .35, 'sine', .025)
  } else if (kind === 'shutter' && style === 'SOFT') {
    playTone(context, 520, .08, 'sine', .035)
    playTone(context, 360, .11, 'sine', .025, .055)
  } else if (kind === 'shutter' && style === 'RETRO') {
    playTone(context, 180, .07, 'square', .04)
    playNoise(context, .1, .055, .045)
    playTone(context, 110, .1, 'square', .025, .1)
  } else if (kind === 'shutter') {
    playNoise(context, .12, .07)
    playTone(context, 240, .09, 'triangle', .04)
  } else if (kind === 'ding') {
    playTone(context, 880, .32, 'sine', .06)
    playTone(context, 1320, .38, 'sine', .035, .08)
  } else if (kind === 'print') {
    playTone(context, 95, .5, 'sawtooth', .018)
    playNoise(context, .48, .018)
  }
}

function clampColor(value) {
  return Math.max(0, Math.min(255, value))
}

function applyPhotoFilter(context, width, height, filterId) {
  if (filterId === 'normal') return
  const imageData = context.getImageData(0, 0, width, height)
  const pixels = imageData.data

  for (let index = 0; index < pixels.length; index += 4) {
    let red = pixels[index]
    let green = pixels[index + 1]
    let blue = pixels[index + 2]
    const gray = .2126 * red + .7152 * green + .0722 * blue

    if (filterId === 'mono') {
      red = (gray - 128) * 1.14 + 128
      green = red
      blue = red
    } else if (filterId === 'warm' || filterId === 'vintage') {
      const sepiaAmount = filterId === 'warm' ? .22 : .48
      const saturation = filterId === 'warm' ? 1.15 : .78
      const contrast = filterId === 'warm' ? 1.04 : .94
      const brightness = filterId === 'warm' ? 1.04 : 1.05
      const sepiaRed = .393 * red + .769 * green + .189 * blue
      const sepiaGreen = .349 * red + .686 * green + .168 * blue
      const sepiaBlue = .272 * red + .534 * green + .131 * blue
      red += (sepiaRed - red) * sepiaAmount
      green += (sepiaGreen - green) * sepiaAmount
      blue += (sepiaBlue - blue) * sepiaAmount
      red = gray + (red - gray) * saturation
      green = gray + (green - gray) * saturation
      blue = gray + (blue - gray) * saturation
      red = ((red - 128) * contrast + 128) * brightness
      green = ((green - 128) * contrast + 128) * brightness
      blue = ((blue - 128) * contrast + 128) * brightness
    } else if (filterId === 'cool') {
      const saturation = .88
      red = gray + (red - gray) * saturation
      green = gray + (green - gray) * saturation
      blue = gray + (blue - gray) * saturation
      red = ((red * .91 - 128) * 1.04 + 128) * 1.03
      green = ((green * 1.01 - 128) * 1.04 + 128) * 1.03 + 2
      blue = ((blue * 1.1 - 128) * 1.04 + 128) * 1.03 + 6
    }

    pixels[index] = clampColor(red)
    pixels[index + 1] = clampColor(green)
    pixels[index + 2] = clampColor(blue)
  }

  context.putImageData(imageData, 0, 0)
}

function dataUrlToBlob(source) {
  const [header, encodedData] = source.split(',')
  const mimeType = header.match(/data:([^;]+)/)?.[1] || 'image/png'
  const binary = window.atob(encodedData)
  const bytes = new Uint8Array(binary.length)
  for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index)
  return new Blob([bytes], { type: mimeType })
}

function isAppleMobileDevice() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent)
    || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
}

async function saveImageToDevice(source, filename) {
  const blob = source.startsWith('data:')
    ? dataUrlToBlob(source)
    : await fetch(source).then((response) => response.blob())

  if (isAppleMobileDevice() && window.File && navigator.share) {
    const file = new File([blob], filename, { type: blob.type || 'image/png' })
    if (navigator.canShare?.({ files: [file] })) {
      await navigator.share({ files: [file], title: 'NONGEVE Photobooth' })
      return 'shared'
    }
  }

  const objectUrl = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = objectUrl
  link.download = filename
  link.rel = 'noopener'
  link.style.display = 'none'
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.setTimeout(() => URL.revokeObjectURL(objectUrl), 60000)
  return 'saved'
}

function Brand({ onClick }) {
  return (
    <button className="brand" type="button" onClick={onClick} aria-label="กลับหน้าแรก">
      <img src={logo} alt="LoopGroup" />
    </button>
  )
}

function BoothSurface({ historyCards = [], onBoardClick, positions = HISTORY_POSITIONS }) {
  const BoardElement = onBoardClick ? 'button' : 'div'
  return (
    <div className="booth-surface" role={onBoardClick ? 'group' : 'img'} aria-label="ตู้พิมพ์รูป LoopGroup">
      <BoardElement
        className={`stamp-pic-area ${onBoardClick ? 'is-interactive' : ''}`}
        type={onBoardClick ? 'button' : undefined}
        onClick={onBoardClick}
        aria-label={onBoardClick ? 'Open photo board' : undefined}
        aria-hidden={onBoardClick ? undefined : true}
      >
        {historyCards.map((card, index) => {
          const position = positions[index % positions.length]
          return (
            <div
              className={`session-card session-card--${card.templateId}`}
              key={card.id}
              style={{
                left: position.left,
                top: position.top,
                width: position.width,
                transform: `rotate(${position.rotate})`,
              }}
            >
              <img src={card.url} alt="" />
            </div>
          )
        })}
      </BoardElement>
      <div className="booth-door" />
      <div className="booth-print-slot" />
    </div>
  )
}

function StartPage({ onStart, onUpdates }) {
  const [isRevealed, setIsRevealed] = useState(false)
  return (
    <main
      className={`start-page page-enter ${isRevealed ? 'is-revealed' : ''}`}
      onClick={() => {
        console.log('คลิกหน้าแรกแล้ว')
        setIsRevealed(true)
      }}
    >
      <div className="start-content">
        <img className="start-logo" src={logo} alt="LoopGroup" />
        <button
          className="primary-button start-button figma-button"
          onClick={(event) => {
            event.stopPropagation()
            console.log('คลิกปุ่ม LET’S START แล้ว')
            onStart()
          }}
        >
          LET&apos;S START!
        </button>
        <button
          className="start-updates-button"
          type="button"
          onClick={(event) => {
            event.stopPropagation()
            onUpdates()
          }}
        >
          WHAT&apos;S NEW
        </button>
      </div>
      <p className="privacy-note">PHOTOS STAY ON THIS DEVICE ONLY</p>
    </main>
  )
}

function UpdatesPage({ onHome }) {
  return (
    <main className="updates-page page-enter">
      <header className="minimal-header updates-header">
        <button className="text-button" type="button" onClick={onHome}>← HOME</button>
        <Brand onClick={onHome} />
        <span aria-hidden="true" />
      </header>

      <section className="updates-hero">
        <p className="tiny-heading">NONGEVE PHOTOBOOTH</p>
        <h1>Small features.<br />More fun memories.</h1>
        <p>Everything you can play with today—and every little thing that gets better along the way.</p>
      </section>

      <section className="feature-guide" aria-labelledby="feature-guide-title">
        <div className="updates-section-heading">
          <p className="tiny-heading">FEATURE GUIDE</p>
          <h2 id="feature-guide-title">What can the booth do?</h2>
        </div>
        <div className="feature-guide-grid">
          {FEATURE_LIST.map((feature) => (
            <article className="feature-guide-card" key={feature.title}>
              <span aria-hidden="true">{feature.icon}</span>
              <h3>{feature.title}</h3>
              <p>{feature.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="changelog" aria-labelledby="changelog-title">
        <div className="updates-section-heading">
          <p className="tiny-heading">CHANGELOG</p>
          <h2 id="changelog-title">What&apos;s new?</h2>
        </div>
        <div className="changelog-list">
          {UPDATE_LOG.map((update, index) => (
            <article className="changelog-entry" key={update.version}>
              <div className="changelog-marker"><span>{index + 1}</span></div>
              <div>
                <time>{update.date}</time>
                <h3>{update.version}</h3>
                <ul>
                  {update.items.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}

function TemplatePage({ historyCards, onHome, onSelect, silentMode }) {
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [isCardTrayOpen, setIsCardTrayOpen] = useState(false)
  const [isBoardOpen, setIsBoardOpen] = useState(false)
  const [boardPositions, setBoardPositions] = useState(HISTORY_POSITIONS)
  const handleSelect = (template) => {
    if (selectedTemplate) return

    playBoothSound('curtain', 'CLASSIC', silentMode)
    setSelectedTemplate(template)

    window.setTimeout(() => {
      onSelect(template)
    }, 750)
  }
  const shakeBoard = () => {
    setBoardPositions((current) => [...current]
      .sort(() => Math.random() - .5)
      .map((position) => ({
        ...position,
        rotate: `${Math.round(Math.random() * 16) - 8}deg`,
      })))
    window.navigator.vibrate?.([25, 35, 25])
  }
  return (
    <main className="template-page page-enter">
      <div className="template-booth-layout">
        <div className="booth-wrap">
          <BoothSurface historyCards={historyCards} positions={boardPositions} onBoardClick={() => setIsBoardOpen(true)} />
        </div>
      </div>
      <header className="minimal-header"><Brand onClick={onHome} /></header>
      <section
        id="template-card-tray"
        className={`template-content ${isCardTrayOpen ? 'is-open' : 'is-closed'}`}
      >
        <button
          className="template-view-toggle"
          type="button"
          onClick={() => setIsCardTrayOpen((isOpen) => !isOpen)}
          aria-expanded={isCardTrayOpen}
          aria-controls="template-card-options"
        >
          {isCardTrayOpen ? 'CLOSE CARDS ↓' : 'CHOOSE A CARD ↑'}
        </button>
        <div id="template-card-options" className="figma-template-grid">
          {TEMPLATES.map((template) => (
            <button className={`figma-template ${
                selectedTemplate?.id === template.id ? 'is-selected' : ''
              } ${
                selectedTemplate && selectedTemplate.id !== template.id
                  ? 'is-muted'
                  : ''
              }`}
              type="button" key={template.id} onClick={() => handleSelect(template)}
            >
              <span className="template-image-wrap">
                <img src={template.asset} alt={`เทมเพลต ${template.id} รูป`} />
              </span>
            </button>
          ))}
        </div>
      </section>
      {isBoardOpen && (
        <div className="photo-board-overlay" role="dialog" aria-modal="true" aria-label="Photo board">
          <div className="photo-board-expanded">
            {historyCards.map((card, index) => {
              const position = boardPositions[index % boardPositions.length]
              return (
                <div
                  className={`session-card session-card--${card.templateId}`}
                  key={card.id}
                  style={{
                    left: position.left,
                    top: position.top,
                    width: position.width,
                    transform: `rotate(${position.rotate})`,
                  }}
                >
                  <img src={card.url} alt="" />
                </div>
              )
            })}
          </div>
          <div className="photo-board-actions">
            <button className="photo-board-shake" type="button" onClick={shakeBoard}>SHAKE THE BOARD</button>
            <button className="photo-board-close" type="button" onClick={() => setIsBoardOpen(false)}>BACK TO PHOTOBOOTH</button>
          </div>
        </div>
      )}
      {selectedTemplate && (
        <div className="template-zoom-overlay" aria-hidden="true">
          <img src={selectedTemplate.asset} alt="" />
        </div>
      )}
    </main>
  )
}

function CameraPage({ template, onBack, onComplete, silentMode, setSilentMode }) {
  const videoRef = useRef(null)
  const previewRefs = useRef([])
  const streamRef = useRef(null)
  const cameraRequestRef = useRef(0)
  const countdownTimerRef = useRef(null)
  const [cameraState, setCameraState] = useState('loading')
  const [cameraAttempt, setCameraAttempt] = useState(0)
  const [facingMode, setFacingMode] = useState('user')
  const [photos, setPhotos] = useState([])
  const [filterId, setFilterId] = useState('normal')
  const [timerEnabled, setTimerEnabled] = useState(false)
  const [randomFilterEnabled, setRandomFilterEnabled] = useState(false)
  const [soundStyle, setSoundStyle] = useState('CLASSIC')
  const [countdown, setCountdown] = useState(null)
  const [isFlashing, setIsFlashing] = useState(false)
  const [flashColor, setFlashColor] = useState(FLASH_COLORS.normal)

  const selectedFilter = FILTERS.find((filter) => filter.id === filterId) || FILTERS[0]

  useEffect(() => {
    const requestId = ++cameraRequestRef.current
    streamRef.current?.getTracks().forEach((track) => track.stop())

    if (!navigator.mediaDevices?.getUserMedia) {
      Promise.resolve().then(() => {
        if (requestId === cameraRequestRef.current) setCameraState('error')
      })
      return () => {
        cameraRequestRef.current += 1
      }
    }

    navigator.mediaDevices.getUserMedia({
      video: { facingMode, width: { ideal: 1920 }, height: { ideal: 1080 } },
      audio: false,
    }).then(async (stream) => {
      if (requestId !== cameraRequestRef.current) {
        stream.getTracks().forEach((track) => track.stop())
        return
      }
      streamRef.current = stream
      const videos = [videoRef.current, ...previewRefs.current].filter(Boolean)
      await Promise.all(videos.map(async (video) => {
        video.srcObject = stream
        await video.play().catch(() => {})
      }))
      setCameraState('ready')
    }).catch(() => {
      if (requestId === cameraRequestRef.current) setCameraState('error')
    })

    return () => {
      cameraRequestRef.current += 1
      streamRef.current?.getTracks().forEach((track) => track.stop())
    }
  }, [cameraAttempt, facingMode])

  useEffect(() => () => window.clearInterval(countdownTimerRef.current), [])

  const setPreviewVideo = (index, node) => {
    previewRefs.current[index] = node
    if (node && streamRef.current) {
      node.srcObject = streamRef.current
      node.play().catch(() => {})
    }
  }

  const takeSnapshot = () => {
    const video = videoRef.current
    if (!video || !video.videoWidth || cameraState !== 'ready') return

    let captureFilter = selectedFilter
    if (randomFilterEnabled) {
      const choices = FILTERS.filter((filter) => filter.id !== filterId)
      captureFilter = choices[Math.floor(Math.random() * choices.length)] || FILTERS[0]
      setFilterId(captureFilter.id)
    }

    const canvas = document.createElement('canvas')
    canvas.width = 1200
    canvas.height = 900
    const context = canvas.getContext('2d')
    const sourceRatio = video.videoWidth / video.videoHeight
    const targetRatio = canvas.width / canvas.height
    let sx = 0
    let sy = 0
    let sourceWidth = video.videoWidth
    let sourceHeight = video.videoHeight

    if (sourceRatio > targetRatio) {
      sourceWidth = video.videoHeight * targetRatio
      sx = (video.videoWidth - sourceWidth) / 2
    } else {
      sourceHeight = video.videoWidth / targetRatio
      sy = (video.videoHeight - sourceHeight) / 2
    }

    context.save()
    if (facingMode === 'user') {
      context.translate(canvas.width, 0)
      context.scale(-1, 1)
    }
    context.drawImage(video, sx, sy, sourceWidth, sourceHeight, 0, 0, canvas.width, canvas.height)
    context.restore()
    applyPhotoFilter(context, canvas.width, canvas.height, captureFilter.id)

    setFlashColor(FLASH_COLORS[captureFilter.id] || FLASH_COLORS.normal)
    setIsFlashing(true)
    playBoothSound('shutter', soundStyle, silentMode)
    window.navigator.vibrate?.(35)
    window.setTimeout(() => setIsFlashing(false), 300)
    const photo = canvas.toDataURL('image/jpeg', .94)
    const nextPhotos = [...photos, photo]
    setPhotos(nextPhotos)
    if (nextPhotos.length === template.id) {
      window.setTimeout(() => playBoothSound('ding', soundStyle, silentMode), 260)
      window.setTimeout(() => {
        streamRef.current?.getTracks().forEach((track) => track.stop())
        onComplete(nextPhotos)
      }, 550)
    }
  }

  const capturePhoto = () => {
    if (cameraState !== 'ready' || countdown !== null || photos.length >= template.id) return
    if (!timerEnabled) {
      takeSnapshot()
      return
    }

    let seconds = 10
    setCountdown(seconds)
    countdownTimerRef.current = window.setInterval(() => {
      seconds -= 1
      if (seconds <= 0) {
        window.clearInterval(countdownTimerRef.current)
        setCountdown(null)
        takeSnapshot()
      } else {
        setCountdown(seconds)
      }
    }, 1000)
  }

  const retryCamera = () => {
    setCameraState('loading')
    setCameraAttempt((attempt) => attempt + 1)
  }

  const switchCamera = () => {
    if (countdown !== null) return
    setCameraState('loading')
    setFacingMode((mode) => mode === 'user' ? 'environment' : 'user')
  }

  const cycleSoundStyle = () => {
    const currentIndex = SOUND_STYLES.indexOf(soundStyle)
    const nextStyle = SOUND_STYLES[(currentIndex + 1) % SOUND_STYLES.length]
    setSoundStyle(nextStyle)
    playBoothSound('shutter', nextStyle, silentMode)
  }

  return (
    <main className="camera-page page-enter">
      <header className="minimal-header camera-header">
        <Brand onClick={onBack} />
        <button className="text-button" type="button" onClick={onBack}>← BACK</button>
      </header>

      <div className="camera-layout">
        <aside className="capture-template-preview" aria-label={`ตัวอย่างการ์ด ${template.label}`}>
          <div
            className="capture-template-card"
            style={{
              width: template.id === 3 ? '74%' : '100%',
              aspectRatio: `${template.width} / ${template.height}`,
            }}
          >
            <img className="capture-template-art" src={template.asset} alt="" />
            {template.slots.map((slot, index) => photos[index] && (
              <button
                type="button"
                className="capture-template-slot"
                key={index}
                disabled={countdown !== null}
                onClick={() => setPhotos((current) => current.filter((_, photoIndex) => photoIndex !== index))}
                aria-label={`ลบรูปที่ ${index + 1} แล้วถ่ายใหม่`}
                style={{
                  left: `${(slot.x / template.width) * 100}%`,
                  top: `${(slot.y / template.height) * 100}%`,
                  width: `${(slot.width / template.width) * 100}%`,
                  height: `${(slot.height / template.height) * 100}%`,
                }}
              >
                <img src={photos[index]} alt="" />
              </button>
            ))}
          </div>
          <p>CLICK A PHOTO TO RETAKE</p>
        </aside>

        <section className="camera-section">
          <div
            className={`live-camera ${isFlashing ? 'is-flashing' : ''}`}
            style={{ '--flash-color': flashColor }}
          >
            <video
              ref={videoRef}
              playsInline
              muted
              className={facingMode === 'user' ? 'is-mirrored' : ''}
              style={{ filter: selectedFilter.css }}
            />
            {countdown !== null && <div className="countdown"><span>{countdown}</span><small>GET READY</small></div>}
            {cameraState === 'loading' && <div className="camera-status"><span className="loader" />OPENING CAMERA</div>}
            {cameraState === 'error' && (
              <div className="camera-status camera-error">
                <strong>CAMERA NOT AVAILABLE</strong>
                <p>กรุณาอนุญาตให้เว็บไซต์เข้าถึงกล้อง</p>
                <button className="figma-button" type="button" onClick={retryCamera}>TRY AGAIN</button>
              </div>
            )}
            <button className="switch-camera" type="button" onClick={switchCamera}>↻ FLIP</button>
            <div className="camera-actions">
              <button
                type="button"
                className={`timer-toggle ${timerEnabled ? 'is-active' : ''}`}
                onClick={() => setTimerEnabled((enabled) => !enabled)}
                disabled={countdown !== null}
                aria-pressed={timerEnabled}
              >
                <span>◷</span>
                <strong>10 SEC</strong>
                <small>{timerEnabled ? 'ON' : 'OFF'}</small>
              </button>
              <button
                className="shutter"
                type="button"
                onClick={capturePhoto}
                disabled={cameraState !== 'ready' || countdown !== null}
                aria-label={timerEnabled ? 'เริ่มนับถอยหลัง 10 วินาทีแล้วถ่ายรูป' : 'ถ่ายรูป'}
              ><span /></button>
            </div>
          </div>

          <div className="filter-section">
            <div className="booth-feature-controls">
              <button
                type="button"
                className={randomFilterEnabled ? 'is-active' : ''}
                onClick={() => setRandomFilterEnabled((enabled) => !enabled)}
                aria-pressed={randomFilterEnabled}
              >
                RANDOM FILTER <small>{randomFilterEnabled ? 'ON' : 'OFF'}</small>
              </button>
              <button type="button" onClick={cycleSoundStyle} disabled={silentMode}>
                SHUTTER <small>{soundStyle}</small>
              </button>
              <button
                type="button"
                className={silentMode ? 'is-active' : ''}
                onClick={() => setSilentMode((isSilent) => !isSilent)}
                aria-pressed={silentMode}
              >
                SILENT BOOTH <small>{silentMode ? 'ON' : 'OFF'}</small>
              </button>
            </div>
            <div className="filter-list">
              {FILTERS.map((filter, index) => (
                <button
                  type="button"
                  key={filter.id}
                  className={filterId === filter.id ? 'is-active' : ''}
                  onClick={() => setFilterId(filter.id)}
                  disabled={countdown !== null}
                >
                  <span className="filter-preview">
                    <video
                      ref={(node) => setPreviewVideo(index, node)}
                      playsInline
                      muted
                      className={facingMode === 'user' ? 'is-mirrored' : ''}
                      style={{ filter: filter.css }}
                    />
                  </span>
                  <small>{filter.label}</small>
                </button>
              ))}
            </div>
          </div>

        </section>
      </div>
    </main>
  )
}

function loadImage(source) {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = reject
    image.src = source
  })
}

function drawCover(context, image, slot) {
  const sourceRatio = image.width / image.height
  const targetRatio = slot.width / slot.height
  let sx = 0
  let sy = 0
  let sourceWidth = image.width
  let sourceHeight = image.height
  if (sourceRatio > targetRatio) {
    sourceWidth = image.height * targetRatio
    sx = (image.width - sourceWidth) / 2
  } else {
    sourceHeight = image.width / targetRatio
    sy = (image.height - sourceHeight) / 2
  }
  context.drawImage(image, sx, sy, sourceWidth, sourceHeight, slot.x, slot.y, slot.width, slot.height)
}

async function composePhotoCard(photos, template) {
  const [cardImage, ...photoImages] = await Promise.all([loadImage(template.asset), ...photos.map(loadImage)])
  const canvas = document.createElement('canvas')
  canvas.width = cardImage.width
  canvas.height = cardImage.height
  const context = canvas.getContext('2d')
  context.clearRect(0, 0, canvas.width, canvas.height)
  context.drawImage(cardImage, 0, 0)
  photoImages.forEach((image, index) => drawCover(context, image, template.slots[index]))
  return canvas.toDataURL('image/png')
}

function ResultPage({ template, photos, historyCards, onArchive, onHome, onRetake, silentMode }) {
  const [cardUrl, setCardUrl] = useState('')
  const [isPrinted, setIsPrinted] = useState(false)
  const [isPlaced, setIsPlaced] = useState(false)
  const [openCardUrl, setOpenCardUrl] = useState('')
  const [copyStatus, setCopyStatus] = useState('idle')
  const [saveStatus, setSaveStatus] = useState('idle')
  const [previousCards] = useState(() => historyCards)
  const hasArchivedRef = useRef(false)

  useEffect(() => {
    let active = true
    composePhotoCard(photos, template).then((url) => {
      if (active) setCardUrl(url)
    })
    return () => { active = false }
  }, [photos, template])

  useEffect(() => {
    if (!cardUrl) return undefined
    playBoothSound('print', 'CLASSIC', silentMode)
    const timer = window.setTimeout(() => setIsPrinted(true), 2850)
    return () => window.clearTimeout(timer)
  }, [cardUrl, silentMode])

  useEffect(() => {
    const closeOnEscape = (event) => event.key === 'Escape' && setOpenCardUrl('')
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [])

  const download = async (source = cardUrl) => {
    if (!source) return
    setSaveStatus('saving')
    try {
      const result = await saveImageToDevice(
        source,
        `nongeve-${template.id}-photos-${Date.now()}.png`,
      )
      setSaveStatus(result)
      window.setTimeout(() => setSaveStatus('idle'), 2200)
    } catch (error) {
      if (error?.name === 'AbortError') {
        setSaveStatus('idle')
      } else {
        setSaveStatus('failed')
        window.setTimeout(() => setSaveStatus('idle'), 2600)
      }
    }
  }

  const copyImage = async (source = cardUrl) => {
    if (!source) return
    try {
      if (!window.ClipboardItem || !navigator.clipboard?.write) throw new Error('Clipboard image API unavailable')
      const blob = source.startsWith('data:')
        ? dataUrlToBlob(source)
        : await fetch(source).then((response) => response.blob())
      await navigator.clipboard.write([new window.ClipboardItem({ [blob.type]: blob })])
      setCopyStatus('copied')
      window.setTimeout(() => setCopyStatus('idle'), 1800)
    } catch {
      setCopyStatus('failed')
      window.setTimeout(() => setCopyStatus('idle'), 2200)
    }
  }

  const copyLabel = copyStatus === 'copied'
    ? 'COPIED!'
    : copyStatus === 'failed' ? 'COPY NOT SUPPORTED' : 'COPY IMAGE'
  const saveLabel = saveStatus === 'saving'
    ? 'PREPARING...'
    : saveStatus === 'saved' ? 'SAVED!'
      : saveStatus === 'shared' ? 'SHARED!' : saveStatus === 'failed' ? 'TRY AGAIN' : 'SAVE IMAGE'

  const handleBoothCardClick = () => {
    if (!isPlaced) {
      setIsPlaced(true)
      if (!hasArchivedRef.current) {
        hasArchivedRef.current = true
        onArchive({ url: cardUrl, templateId: template.id })
      }
      return
    }
    setOpenCardUrl(cardUrl)
  }

  return (
    <main className="result-page page-enter">
      <header className="minimal-header result-header"><Brand onClick={onHome} /></header>
      <section className="result-layout">
        <div className="result-copy">
          <p className="tiny-heading">YOUR PHOTO IS READY!</p>
          <h1>Keep this<br />moment.</h1>
          <p>แตะรูปที่พิมพ์ออกมาเพื่อนำไปติดบนประตู<br />แล้วแตะอีกครั้งเพื่อดูแบบเต็มจอ</p>
          <div className="result-actions">
            <button className="figma-button" type="button" onClick={() => download()} disabled={!cardUrl || saveStatus === 'saving'}>{saveLabel}</button>
            <button className="text-button" type="button" onClick={() => copyImage()} disabled={!cardUrl}>{copyLabel}</button>
            <button className="text-button" type="button" onClick={onRetake}>TAKE AGAIN</button>
          </div>
        </div>

        <div className={`booth-wrap ${cardUrl && !isPrinted ? 'is-printing' : ''}`}>
          <BoothSurface historyCards={previousCards} />
          <button
            className={`booth-card booth-card--${template.id} ${cardUrl ? 'is-ready' : ''} ${isPlaced ? 'is-placed' : ''}`}
            type="button"
            disabled={!isPrinted}
            onClick={handleBoothCardClick}
          >
            {cardUrl ? <img src={cardUrl} alt={`การ์ดภาพถ่าย ${template.id} รูป`} /> : <span className="loader" />}
          </button>
          {isPrinted && <span className={`card-hint ${isPlaced ? 'is-placed' : ''}`}>{isPlaced ? 'CLICK PHOTO TO VIEW' : 'CLICK TO PLACE ON DOOR'}</span>}
        </div>
      </section>

      {openCardUrl && (
        <div className="photo-modal" role="dialog" aria-modal="true" aria-label="ดูรูปเต็มจอ" onClick={() => setOpenCardUrl('')}>
          <button className="modal-close" type="button" onClick={() => setOpenCardUrl('')} aria-label="ปิด">×</button>
          <img src={openCardUrl} alt={`การ์ดภาพถ่าย ${template.id} รูปแบบเต็มจอ`} onClick={(event) => event.stopPropagation()} />
          <button className="figma-button modal-copy" type="button" onClick={(event) => { event.stopPropagation(); copyImage(openCardUrl) }}>{copyLabel}</button>
          <button className="figma-button modal-download" type="button" disabled={saveStatus === 'saving'} onClick={(event) => { event.stopPropagation(); download(openCardUrl) }}>{saveLabel}</button>
        </div>
      )}
    </main>
  )
}

export default function App() {
  const [view, setView] = useState('start')
  const [template, setTemplate] = useState(null)
  const [photos, setPhotos] = useState([])
  const [sessionCards, setSessionCards] = useState([])
  const [silentMode, setSilentMode] = useState(false)

  const goHome = () => {
    setView('start')
    setTemplate(null)
    setPhotos([])
  }

  const chooseTemplate = (selected) => {
    setTemplate(selected)
    setPhotos([])
    setView('camera')
  }

  const archiveCard = (card) => {
    setSessionCards((current) => [
      ...current,
      { ...card, id: `${Date.now()}-${current.length}` },
    ])
  }

  if (view === 'templates') return <TemplatePage historyCards={sessionCards} onHome={goHome} onSelect={chooseTemplate} silentMode={silentMode} />
  if (view === 'camera' && template) {
    return <CameraPage template={template} onBack={() => setView('templates')} onComplete={(captured) => { setPhotos(captured); setView('result') }} silentMode={silentMode} setSilentMode={setSilentMode} />
  }
  if (view === 'result' && template) {
    return <ResultPage template={template} photos={photos} historyCards={sessionCards} onArchive={archiveCard} onHome={goHome} onRetake={() => { setPhotos([]); setView('camera') }} silentMode={silentMode} />
  }
  if (view === 'updates') return <UpdatesPage onHome={goHome} />
  return <StartPage onStart={() => setView('templates')} onUpdates={() => setView('updates')} />
}
