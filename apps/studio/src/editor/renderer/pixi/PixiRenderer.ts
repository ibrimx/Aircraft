import * as PIXI from 'pixi.js'
import type { Doc, TextNode } from '../../state/doc'
import type { Point } from '../../state/types'

/**
 * PixiRenderer
 *
 * R4 ✅ renderer only draws from doc state
 * R6 ✅ requestAnimationFrame rendering
 */
export class PixiRenderer {
  private app: PIXI.Application | null = null
  private root: PIXI.Container | null = null
  private textObjects = new Map<string, PIXI.Text>()

  init(host: HTMLElement) {
    this.destroy()

    const app = new PIXI.Application()
    this.app = app

    void app
      .init({
        resizeTo: host,
        backgroundAlpha: 0,
        antialias: true,
      })
      .then(() => {
        const canvas = (app as { canvas?: HTMLCanvasElement; view?: HTMLCanvasElement }).canvas ??
          (app as { canvas?: HTMLCanvasElement; view?: HTMLCanvasElement }).view
        if (!canvas) throw new Error('Pixi canvas/view missing after init')
        host.appendChild(canvas)

        const stage = new PIXI.Container()
        this.root = stage
        app.stage.addChild(stage)
      })
      .catch((err) => {
        console.error('Pixi init failed', err)
      })
  }

  destroy() {
    if (this.app) {
      const candidate = this.app as { canvas?: HTMLCanvasElement; view?: HTMLCanvasElement }
      const canvas = candidate.canvas ?? candidate.view
      if (canvas && canvas.parentNode) {
        canvas.parentNode.removeChild(canvas)
      }
      this.app.destroy(true)
    }
    this.app = null
    this.root = null
    this.textObjects.clear()
  }

  clientToWorld(host: HTMLElement, e: PointerEvent): Point {
    const r = host.getBoundingClientRect()
    return { x: e.clientX - r.left, y: e.clientY - r.top }
  }

  render(doc: Doc) {
    if (!this.root) return

    const keep = new Set(doc.order)
    for (const [id, obj] of this.textObjects.entries()) {
      if (!keep.has(id)) {
        obj.destroy()
        this.textObjects.delete(id)
      }
    }

    for (const id of doc.order) {
      const node = doc.nodes[id]
      if (!node || !node.visible) continue
      if (node.type === 'text') this.drawText(node)
    }
  }

  private drawText(node: TextNode) {
    if (!this.root) return

    const existing = this.textObjects.get(node.id)
    const content = node.text.length ? node.text : ' '
    const style = new PIXI.TextStyle({
      fontFamily: node.style.fontFamily,
      fontSize: node.style.fontSize,
      fontWeight: String(node.style.fontWeight),
      fill: node.style.fill,
      align: node.style.align === 'start' ? 'left' : node.style.align === 'end' ? 'right' : 'center',
    })

    let txt = existing
    if (!txt) {
      txt = new PIXI.Text({ text: content, style })
      txt.resolution = window.devicePixelRatio || 1
      this.root.addChild(txt)
      this.textObjects.set(node.id, txt)
    } else {
      txt.text = content
      txt.style = style
    }

    txt.x = node.position.x
    txt.y = node.position.y
  }
}
