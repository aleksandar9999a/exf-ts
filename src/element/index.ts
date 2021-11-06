import { ObjectAny, Template, TemplateElement } from './interfaces'

export * from './interfaces'
export * from './element'
export * from './dom'
export * from './component'

type Children = (TemplateElement|string|number|undefined|null)[]

function convertChildren (children: Children) {
  return children.reduce((acc: Template, child) => {
    if (Array.isArray(child)) {
      acc = [...acc, ...convertChildren(child)]
    } else if (child && typeof child === 'object' && child.tag) {
      acc.push(child)
    } else {
      acc.push({ tag: 'text', props: { textContent: child }, children: [] })
    }

    return acc
  }, [])
}

function getSlots (children: Template) {
  const slots: { [key: string]: TemplateElement} = {
    default: {
      tag: 'slot',
      props: {},
      children
    }
  }

  children.forEach(child => {
    if (child.tag === 'slot') {
      slots[child.props.name] = child
    }
  })

  return slots
}

export default function ExF (tag: string, props: ObjectAny|null, ...children: Children) {
  const updatedChildren = convertChildren(children)

  if (tag === 'template') {
    return updatedChildren
  }

  const updatedProps = props || {}

  if (tag.includes('-')) {
    updatedProps.slots = getSlots(updatedChildren)
    return [{ tag, props: updatedProps, children: [] }]
  }

  return [{ tag, props: updatedProps, children: updatedChildren }] as Template
}
