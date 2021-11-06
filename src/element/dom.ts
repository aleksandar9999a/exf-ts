import { ObjectAny, Template, TemplateElement } from './'

export class DOM {
  private changes: (() => any)[] = []

  constructor (private document: Document) {}

  private getValue (value: string|ObjectAny) {
    if (!value) {
      return value
    }

    if (typeof value === 'object') {
      if (value.isState) {
        return value.value
      }

      return value
    }

    return this.parseValue(value)
  }

  private parseTextTemplate (template: TemplateElement) {
    return this.document.createTextNode(this.getValue(template.props.textContent))
  }

  private parseValue (value: string|number) {
    if (typeof value === 'number') {
      return value
    }

    let key = value

    if (key.startsWith('"')) {
      key = key.slice(1)
    }

    if (key.endsWith('"')) {
      key = key.slice(0, key.length - 1)
    }

    return key
  }

  private parseRegularTemplate (template: TemplateElement) {
    const el = this.document.createElement(template.tag)

    this.compareProps(el, {}, template.props)

    template.children = template.children.map(child => {
      child.element = this.parseTemplate(child)
      el.appendChild(child.element)
      return child
    })

    return el
  }

  private parseTemplate (template: TemplateElement) {
    return template.tag === 'text'
      ? this.parseTextTemplate(template)
      : this.parseRegularTemplate(template)
  }

  private compareProps (element: HTMLElement|Text, oldProps: ObjectAny, props: ObjectAny) {
    if (element instanceof Text) {
      const text = this.getValue(props.textContent)

      if (element.textContent !== `${text}`) {
        this.commit(() => {
          element.textContent = text
        })
      }

      return props
    }

    Object.entries({ ...oldProps, ...props }).forEach(([key, value]) => {
      if (oldProps[key] !== value) {
        this.commit(() => {
          if (key.startsWith('on')) {
            const event = key.slice(2).toLocaleLowerCase()
            element.removeEventListener(event, oldProps[key])
            element.addEventListener(event, value)
          } else if (key === 'textContent') {
            element.textContent = this.getValue(value)
          } else if (key === 'className') {
            element.className = value
          } else {
            element.setAttribute(key, value)
          }
        }) 
      }
    })

    return props
  }

  private commit (fn: () => any) {
    this.changes.push(fn)
    return this.changes
  }

  private buildElement (parent: HTMLElement, oldTemplate: TemplateElement, template: TemplateElement): Promise<TemplateElement> {
    if (oldTemplate === template && template.element) {
      this.commit(() => {
        template.element?.remove()
      })

      return Promise.resolve(null as any)
    }

    if (!oldTemplate.element || oldTemplate.tag !== template.tag || oldTemplate.props.key !== template.props.key) {
      if (oldTemplate.element) {
        this.commit(() => {
          oldTemplate.element?.remove()
        })
      }

      const updatedTemplate = {
        ...template,
        element: this.parseTemplate(template)
      }

      this.commit(() => {
        parent.appendChild(updatedTemplate.element)
      })

      return Promise.resolve(updatedTemplate)
    }

    template.element = oldTemplate.element

    this.compareProps(template.element as HTMLElement, oldTemplate.props, template.props)

    return this.build(oldTemplate.element as HTMLElement, oldTemplate.children, template.children)
      .then(data => {
        return {
          ...template,
          children: data
        }
      })
  }

  private applyChanges () {
    if (this.changes.length <= 0) {
      return
    }

    requestAnimationFrame(() => {
      const change = this.changes.shift()

      if (change) {
        change()
      }

      this.applyChanges()
    })
  }

  build (parent: HTMLElement|ShadowRoot, oldTemplate: Template, template: Template): Promise<Template> {
    if (oldTemplate.length < template.length) {
      return Promise.all(template.map((x, i) => {
        return this.buildElement(parent as HTMLElement, oldTemplate[i] || x, x)
      }))
      .then(result => {
        this.applyChanges()
        return result
      })
    }

    return Promise.all(oldTemplate.map((x, i) => {
      return this.buildElement(parent as HTMLElement, x, template[i] || x)
    }))
    .then(result => {
      this.applyChanges()
      return result
    })
  }
}
