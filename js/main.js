'use strict'
let gElCanvas
let gCtx
let gCurrShape = ''
let gPen = { pos: null, isDown: false }
let gLine = []
const TOUCH_EVENTS = ['touchstart', 'touchmove', 'touchend']

function onInit() {
    gElCanvas = document.querySelector('canvas')
    gCtx = gElCanvas.getContext('2d')
    addListeners()
}

function setColors() {
    gElCanvas = document.querySelector('canvas')
    const elBgColor = document.querySelector('[name="color"]')
    const elColor = document.querySelector('[name="colorTxt"]')
    gElCanvas.style.backgroundColor = elBgColor.value
    gCtx.strokeStyle = elColor.value
    gCtx.fillStyle = elColor.value
}

function drawLine(x, y, xEnd = 250, yEnd = 250) {
    gCtx.moveTo(x, y)
    gCtx.lineTo(xEnd, yEnd)

    gCtx.lineWidth = 6
    gCtx.strokeStyle = setColors()

    gCtx.stroke()
}

function drawRect(x, y) {
    gCtx.beginPath()

    gCtx.strokeStyle = setColors()
    gCtx.lineWidth = 4
    gCtx.strokeRect(x, y, 80, 80)

    gCtx.fillStyle = setColors()
    gCtx.fillRect(x, y, 80, 80)
}

function drawTriangle(x, y) {
    gCtx.beginPath()
    gCtx.moveTo(x, y)

    gCtx.lineTo(130, 330)
    gCtx.lineTo(50, 400)

    gCtx.closePath()

    gCtx.strokeStyle = setColors()
    gCtx.lineWidth = 3
    gCtx.stroke()

    gCtx.fillStyle = setColors()
    gCtx.fill()
}

function drawText(text, x, y) {
    gCtx.lineWidth = 2
    gCtx.strokeStyle = 'black'

    gCtx.fillStyle = setColors()

    gCtx.font = '45px Arial'
    gCtx.textAlign = 'center'
    gCtx.textBaseline = 'middle'

    gCtx.fillText(text, x, y)
    gCtx.strokeText(text, x, y)
}

function onStartLine(ev) {
    gPen.pos = { x: ev.offsetX, y: ev.offsetY }
    gPen.isDown = true

    gLine = []
    gLine.push(gPen.pos)

    gCtx.beginPath()
    gCtx.moveTo(gPen.pos.x, gPen.pos.y)
}

function onDrawLine(ev) {
    if (!gPen.isDown) return
    if (gCurrShape === 'rect') {
        const { offsetX, offsetY } = ev
        gPen.pos = { x: offsetX, y: offsetY }
        gCtx.strokeStyle = setColors()
        gCtx.lineWidth = 2
        gCtx.strokeRect(gPen.pos.x, gPen.pos.y, 45, 45)
        if (TOUCH_EVENTS.includes(ev.type)) {

            ev.preventDefault()         // Prevent triggering the mouse events
            ev = ev.changedTouches[0]   // Gets the first touch point

            // Calc pos according to the touch screen
            gPen.pos = {
                x: ev.pageX - ev.target.offsetLeft - ev.target.clientLeft,
                y: ev.pageY - ev.target.offsetTop - ev.target.clientTop,
            }
        }
        gCtx.fillStyle = setColors()
        gCtx.fillRect(gPen.pos.x, gPen.pos.y, 45, 45)
        gLine.push(gPen.pos)
    }
    if (gCurrShape === '') {
        const { offsetX, offsetY } = ev

        gPen.pos = { x: offsetX, y: offsetY }
        if (TOUCH_EVENTS.includes(ev.type)) {

            ev.preventDefault()         // Prevent triggering the mouse events
            ev = ev.changedTouches[0]   // Gets the first touch point

            // Calc pos according to the touch screen
            gPen.pos = {
                x: ev.pageX - ev.target.offsetLeft - ev.target.clientLeft,
                y: ev.pageY - ev.target.offsetTop - ev.target.clientTop,
            }
        }
        gLine.push(gPen.pos)

        gCtx.lineTo(gPen.pos.x, gPen.pos.y)
        gCtx.stroke()
    }
}

function onEndLine(ev) {
    gPen.isDown = false
    gCtx.closePath()
}

function onSetShape(shape) {
    gCurrShape = shape
}

function onDraw(ev) {
    const { offsetX, offsetY } = ev
    switch (gCurrShape) {
        case 'line':
            drawLine(offsetX, offsetY)
            break

        case 'rect':
            drawRect(offsetX, offsetY)
            break

        case 'triangle':
            drawTriangle(offsetX, offsetY)
            break

        case 'text':
            drawText('Coding', offsetX, offsetY)
            break
    }
}

function onClearCanvas() {
    gLine = []
    gCtx.clearRect(0, 0, gElCanvas.width, gElCanvas.height)
}

function onSave() {
    saveToStorage('canvas', gLine)
}

function onLoad() {
    gLine = loadFromStorage('canvas')

    gCtx.moveTo(gLine[0].x, gLine[0].y)
    gCtx.beginPath()

    gLine.forEach(pos => gCtx.lineTo(pos.x, pos.y))

    gCtx.stroke()
}

function downloadImg(elLink) {
    const imgContent = gElCanvas.toDataURL('image/jpeg')
    elLink.href = imgContent
}

function addListeners() {
    addTouchListeners()
}

function addTouchListeners() {
    gElCanvas.addEventListener('touchstart', onStartLine)
    gElCanvas.addEventListener('touchmove', onDrawLine)
    gElCanvas.addEventListener('touchend', onEndLine)
}



