const { app, BrowserWindow } = require('electron')
const path = require('path')

async function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            plugins: true,
            nodeIntegration: true,
            nodeIntegrationInWorker: true,
            nodeIntegrationInSubFrames: false,
            contextIsolation: false,
            backgroundThrottling: false,
            webviewTag: true,
            webSecurity: false, // Disable CORS
            allowRunningInsecureContent: true, // Disable CORS
        },
    })
    mainWindow.maximize()

    // Open DevTools automatically
    mainWindow.webContents.openDevTools()

    // check if cushy is running
    let viteStarted = false
    const sleep = (duration) => new Promise((resolve) => setTimeout(resolve, duration))
    do {
        console.log('waiting for cushy to start')
        try {
            res = await fetch('http://localhost:8288', { method: 'HEAD' })
            if (res.status !== 200) await sleep(1000)
            else viteStarted = true
        } catch (error) {
            await sleep(1000)
        }
    } while (!viteStarted)

    // load cushy
    mainWindow.loadURL('http://localhost:8288', { extraHeaders: 'pragma: no-cache\n' }) // Load your localhost URL

    // Open DevTools (optional)
    // mainWindow.webContents.openDevTools();
}

app.whenReady().then(() => {
    createWindow()
    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', function () {
    console.log('window-all-closed')
    app.quit()
    // if (process.platform !== 'darwin')
})
