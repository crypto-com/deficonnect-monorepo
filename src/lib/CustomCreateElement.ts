const SvgTags:string[] = [
  'svg',
  'g',
  'path',
  'mask',
  'defs',
  'stop',
  'linearGradient',
  'filter',
  'feFlood',
  'feOffset',
  'feGaussianBlur',
  'feColorMatrix',
  'feBlend',
];

const NeedUnderlineOfAttrName:string[] = [
  'floodOpacity',
];

const EVENT_HANDLERS = {
  onClick: 'click',
}

const makeSVG = (tag: string):SVGElement => {
  const ns = 'http://www.w3.org/2000/svg'
  const xlinkns = 'http://www.w3.org/1999/xlink'
  const el = document.createElementNS(ns, tag)
  if(tag === 'svg') {
    el.setAttribute('xmlns:xlink', xlinkns)
  }
  return el
}

export function createElement(tagName:any, props:{ style?: any } = {}, ...childNodes:[]):HTMLElement {
  if (typeof tagName === 'function') {
    return tagName(props);
  }
  if (props === null) {
    props = {}
  }
  const el = SvgTags.includes(tagName) ? makeSVG(tagName) : document.createElement(tagName)
  Object.keys(props).forEach(prop => {
    if (prop in EVENT_HANDLERS) {
      el.addEventListener(EVENT_HANDLERS[prop], props[prop])
    } else {
      if(NeedUnderlineOfAttrName.includes(prop)) {
        el.setAttribute(prop.replace(/([A-Z])/g, "-$1").toLowerCase(), props[prop])
      } else {
        el.setAttribute(prop, props[prop])
      }
    }
  })
  if ('style' in props) {
    const styles = props.style
    Object.keys(styles).forEach(prop => {
      const value = styles[prop]
      if (typeof value === 'number') {
        el.style[prop] = `${value}`
      } else if (typeof value === 'string') {
        el.style[prop] = value
      } else {
        throw new Error(`Expected "number" or "string" but received "${typeof value}"`)
      }
    })
  }
  childNodes.forEach(childNode => {
    if (typeof childNode === 'object') {
      el.appendChild(childNode)
    } else if (typeof childNode === 'string') {
      el.appendChild(document.createTextNode(childNode))
    } else {
      throw new Error(`Expected "object" or "string" but received "${typeof childNode}"`)
    }
  })
  return el
}