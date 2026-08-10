/**
 * CDP tabanlı ekran görüntüsü aracı (yalnızca geliştirme/denetim için).
 *
 * `--screenshot` bayrağı yetmiyor: viewport boyunda kadraj alıyor ve
 * `svh` tabanlı hero'yu bozuyor (pencereyi uzatınca hero da uzuyor).
 * `captureBeyondViewport` ise viewport'u 900px'te tutup belgeyi baştan
 * sona çekiyor — `svh` doğru, tam sayfa elde.
 *
 * Kullanım:
 *   node tools/shoot.mjs <url> <çıktı.png> [genişlik] [yükseklik] [mobil?] [script]
 */
import { spawn } from 'node:child_process'
import { writeFile } from 'node:fs/promises'

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const PORT = 9333

// mode: 'full' (varsayılan) tüm belgeyi, 'view' yalnızca viewport'u çeker.
// Modal gibi `position: fixed` katmanlarda 'view' şart — tam sayfa kadrajda
// sabit öğe kaydırma başlangıcına çizilip içerikten kopuyor.
const [url, out, w = '1440', h = '900', mobile = '0', script = '', mode = 'full'] = process.argv.slice(2)

const chrome = spawn(
  CHROME,
  [
    '--headless=new',
    '--disable-gpu',
    '--hide-scrollbars',
    '--no-first-run',
    `--remote-debugging-port=${PORT}`,
    '--user-data-dir=' + process.env.TEMP + '/dy-shoot-profile',
    'about:blank',
  ],
  { stdio: 'ignore' },
)

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function browserWs() {
  for (let i = 0; i < 60; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/json/version`)
      return (await res.json()).webSocketDebuggerUrl
    } catch {
      await sleep(250)
    }
  }
  throw new Error('Chrome DevTools portu açılmadı')
}

const ws = new WebSocket(await browserWs())
await new Promise((r) => (ws.onopen = r))

let seq = 0
const pending = new Map()
/** Sayfadan gelen konsol çıktıları ve yakalanmamış hatalar. */
const logs = []
ws.onmessage = (event) => {
  const msg = JSON.parse(event.data)
  if (msg.id && pending.has(msg.id)) {
    pending.get(msg.id)(msg.result ?? {})
    pending.delete(msg.id)
    return
  }
  if (msg.method === 'Runtime.consoleAPICalled') {
    const text = (msg.params.args ?? [])
      .map((a) => a.value ?? a.description ?? a.unserializableValue ?? '')
      .join(' ')
    logs.push(`[${msg.params.type}] ${text}`)
  }
  if (msg.method === 'Runtime.exceptionThrown') {
    const d = msg.params.exceptionDetails
    logs.push(`[exception] ${d.exception?.description ?? d.text}`)
  }
}

function send(method, params = {}, sessionId) {
  const id = ++seq
  return new Promise((resolve) => {
    pending.set(id, resolve)
    ws.send(JSON.stringify({ id, method, params, sessionId }))
  })
}

const { targetId } = await send('Target.createTarget', { url: 'about:blank' })
const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true })

await send('Page.enable', {}, sessionId)
await send('Runtime.enable', {}, sessionId)
await send('Emulation.setDeviceMetricsOverride', {
  width: Number(w),
  height: Number(h),
  deviceScaleFactor: 1,
  mobile: mobile === '1',
}, sessionId)

await send('Page.navigate', { url }, sessionId)
// Yazı tipleri, görseller ve reveal geçişleri otursun.
await sleep(3500)

if (script) {
  const result = await send(
    'Runtime.evaluate',
    { expression: script, awaitPromise: true, returnByValue: true },
    sessionId,
  )
  // Sonucu yazdır: aynı araç hem kadraj hem inceleme için kullanılıyor.
  if (result?.result?.value !== undefined) console.log(JSON.stringify(result.result.value, null, 2))
  if (result?.exceptionDetails) console.log('HATA:', result.exceptionDetails.text)
  await sleep(1200)
}

// Belge yüksekliği; viewport 900'de kalıyor, kadraj belgeyi kapsıyor.
const metrics = await send('Page.getLayoutMetrics', {}, sessionId)
const size = metrics.cssContentSize ?? metrics.contentSize

const shot = await send(
  'Page.captureScreenshot',
  mode === 'view'
    ? { format: 'png' }
    : {
        format: 'png',
        captureBeyondViewport: true,
        clip: { x: 0, y: 0, width: size.width, height: size.height, scale: 1 },
      },
  sessionId,
)

await writeFile(out, Buffer.from(shot.data, 'base64'))
console.log(`${out}  ${size.width}x${Math.round(size.height)}`)

if (logs.length) {
  console.log('\n--- sayfa konsolu ---')
  for (const line of logs.slice(0, 40)) console.log(line)
}

ws.close()
chrome.kill()
process.exit(0)
