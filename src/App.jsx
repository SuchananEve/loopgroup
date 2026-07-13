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
  { left: '3%', top: '73%', width: '20%', rotate: '7deg' },
  { left: '57%', top: '72%', width: '17%', rotate: '-5deg' },
]

function Brand({ onClick }) {
  return (
    <button className="brand" type="button" onClick={onClick} aria-label="กลับหน้าแรก">
      <img src={logo} alt="LoopGroup" />
    </button>
  )
}

function BoothSurface({ historyCards = [] }) {
  return (
    <div className="booth-surface" role="img" aria-label="ตู้พิมพ์รูป LoopGroup">
      <div className="stamp-pic-area" aria-hidden="true">
        {historyCards.map((card, index) => {
          const position = HISTORY_POSITIONS[index % HISTORY_POSITIONS.length]
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
      <div className="booth-door" />
      <div className="booth-print-slot" />
    </div>
  )
}

function StartPage({ onStart }) {
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
      </div>
      <p className="privacy-note">PHOTOS STAY ON THIS DEVICE ONLY</p>
    </main>
  )
}

function TemplatePage({ historyCards, onHome, onSelect }) {
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const handleSelect = (template) => {
    if (selectedTemplate) return

    setSelectedTemplate(template)

    window.setTimeout(() => {
      onSelect(template)
    }, 750)
  }
  return (
    <main className="template-page page-enter">
      <div className="template-booth-layout" aria-hidden="true">
        <div className="booth-wrap">
          <BoothSurface historyCards={historyCards} />
        </div>
      </div>
      <header className="minimal-header"><Brand onClick={onHome} /></header>
      <section className="template-content">
        <div className="figma-template-grid">
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
      {selectedTemplate && (
        <div className="template-zoom-overlay" aria-hidden="true">
          <img src={selectedTemplate.asset} alt="" />
        </div>
      )}
    </main>
  )
}

function CameraPage({ template, onBack, onComplete }) {
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
  const [timerEnabled, setTimerEnabled] = useState(true)
  const [countdown, setCountdown] = useState(null)
  const [isFlashing, setIsFlashing] = useState(false)

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
    context.filter = selectedFilter.css
    if (facingMode === 'user') {
      context.translate(canvas.width, 0)
      context.scale(-1, 1)
    }
    context.drawImage(video, sx, sy, sourceWidth, sourceHeight, 0, 0, canvas.width, canvas.height)
    context.restore()

    setIsFlashing(true)
    window.setTimeout(() => setIsFlashing(false), 300)
    const photo = canvas.toDataURL('image/jpeg', .94)
    const nextPhotos = [...photos, photo]
    setPhotos(nextPhotos)
    if (nextPhotos.length === template.id) {
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
          <div className={`live-camera ${isFlashing ? 'is-flashing' : ''}`}>
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

function ResultPage({ template, photos, historyCards, onArchive, onHome, onRetake }) {
  const [cardUrl, setCardUrl] = useState('')
  const [isPrinted, setIsPrinted] = useState(false)
  const [isPlaced, setIsPlaced] = useState(false)
  const [openCardUrl, setOpenCardUrl] = useState('')
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
    const timer = window.setTimeout(() => setIsPrinted(true), 2850)
    return () => window.clearTimeout(timer)
  }, [cardUrl])

  useEffect(() => {
    const closeOnEscape = (event) => event.key === 'Escape' && setOpenCardUrl('')
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [])

  const download = (source = cardUrl) => {
    if (!source) return
    const link = document.createElement('a')
    link.href = source
    link.download = `loopgroup-${template.id}-photos-${Date.now()}.png`
    link.click()
  }

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
            <button className="figma-button" type="button" onClick={download} disabled={!cardUrl}>DOWNLOAD</button>
            <button className="text-button" type="button" onClick={onRetake}>TAKE AGAIN</button>
          </div>
        </div>

        <div className="booth-wrap">
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
          <button className="figma-button modal-download" type="button" onClick={(event) => { event.stopPropagation(); download(openCardUrl) }}>DOWNLOAD</button>
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

  if (view === 'templates') return <TemplatePage historyCards={sessionCards} onHome={goHome} onSelect={chooseTemplate} />
  if (view === 'camera' && template) {
    return <CameraPage template={template} onBack={() => setView('templates')} onComplete={(captured) => { setPhotos(captured); setView('result') }} />
  }
  if (view === 'result' && template) {
    return <ResultPage template={template} photos={photos} historyCards={sessionCards} onArchive={archiveCard} onHome={goHome} onRetake={() => { setPhotos([]); setView('camera') }} />
  }
  return <StartPage onStart={() => setView('templates')} />
}
