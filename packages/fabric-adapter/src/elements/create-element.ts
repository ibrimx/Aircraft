import type { CanvasElement, CreateElementOptions } from '../types'

let elementCounter = 0

function generateId(): string {
  return `element_${Date.now()}_${++elementCounter}`
}

export function createRectangle(options: CreateElementOptions = {}): CanvasElement {
  return {
    id: generateId(),
    type: 'rectangle',
    name: 'Rectangle',
    x: options.x ?? 100,
    y: options.y ?? 100,
    width: options.width ?? 200,
    height: options.height ?? 150,
    rotation: 0,
    scaleX: 1,
    scaleY: 1,
    fill: options.fill ?? '#e0e0e0',
    stroke: options.stroke ?? null,
    strokeWidth: options.strokeWidth ?? 0,
    opacity: 1,
    visible: true,
    locked: false,
    cornerRadius: 0,
  }
}

export function createEllipse(options: CreateElementOptions = {}): CanvasElement {
  return {
    id: generateId(),
    type: 'ellipse',
    name: 'Ellipse',
    x: options.x ?? 100,
    y: options.y ?? 100,
    width: options.width ?? 150,
    height: options.height ?? 150,
    rotation: 0,
    scaleX: 1,
    scaleY: 1,
    fill: options.fill ?? '#e0e0e0',
    stroke: options.stroke ?? null,
    strokeWidth: options.strokeWidth ?? 0,
    opacity: 1,
    visible: true,
    locked: false,
  }
}

export function createText(options: CreateElementOptions = {}): CanvasElement {
  return {
    id: generateId(),
    type: 'text',
    name: 'Text',
    x: options.x ?? 100,
    y: options.y ?? 100,
    width: options.width ?? 200,
    height: options.height ?? 50,
    rotation: 0,
    scaleX: 1,
    scaleY: 1,
    fill: options.fill ?? '#000000',
    stroke: null,
    strokeWidth: 0,
    opacity: 1,
    visible: true,
    locked: false,
    text: options.text ?? 'Text',
    fontSize: options.fontSize ?? 24,
    fontFamily: options.fontFamily ?? 'Inter',
    fontWeight: 'normal',
    textAlign: 'left',
  }
}

export function createFrame(options: CreateElementOptions = {}): CanvasElement {
  return {
    id: generateId(),
    type: 'frame',
    name: 'Frame',
    x: options.x ?? 50,
    y: options.y ?? 50,
    width: options.width ?? 375,
    height: options.height ?? 667,
    rotation: 0,
    scaleX: 1,
    scaleY: 1,
    fill: options.fill ?? '#ffffff',
    stroke: '#cccccc',
    strokeWidth: 1,
    opacity: 1,
    visible: true,
    locked: false,
    cornerRadius: 0,
    children: [],
  }
}
