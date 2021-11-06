import ExF, { ObjectAny, Element, createComponent } from './../element'

export default createComponent('inline-style', (element: Element) => {
  if (!element.props.css) {
    element.props.css = element.observe<string>('')
  }

  element.props.css.pipe((value: string|ObjectAny) => {
    if (typeof value === 'string') {
      return value
    }

    return ''
  })

  return () => <style>{element.props.css}</style>
})