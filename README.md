<p align="center">
	<img src="https://firebasestorage.googleapis.com/v0/b/exf-ts.appspot.com/o/logo-exf.png?alt=media&token=37da74eb-d4bc-4a4d-83a2-5b283fa8374d" height="200" />
</p>

<h1 align="center">ExF - TS</h1>

<p align="center">ExF - TS is TypeScript/JavaScript Library for building Custom Web Components. Its purpose is to refine Web Components and present a cool way for their composing.</p>

<br><br>

<h2 align="center">Introduction</h2>

<p align="center">
In the next few lines I will list some of the features that ExF combines to gain his super powers.
</p>

<br><br>

- [Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components) - This is a technology with which help I manage to combine the super powers of technologies listed below.

- [Shadow DOM](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM) - Important part of ExF is encapsulation and here the Shadow DOM intervenes.

- [Virtual DOM](https://bitsofco.de/understanding-the-virtual-dom/) - To make things easier, more sustainable and more dynamic, ExF uses Virtual Dom and updates only what is necessary.

- [TSX](https://www.typescriptlang.org/docs/handbook/jsx.html) - It's actually JSX.

- etc...


<br /><br />

<h2 align="center">How to install ExF</h2>

<br />

<p>Just clone this repository:</p>

https://github.com/aleksandar9999a/exf-template

<p>And run:</p>

```bash
	yarn install
	yarn start
```

<p>This will create webpack server, after this write what you want in src folder</p>

<br/><br/>

<h2 align="center">Documentation</h2>

<br/>

<h3>API</h3>

<br/><br/>

<h4>Runtime</h4>

```javascript
const runtime = createRuntime()

/* We pass rules to runtime so platforms which pass that rules will be mounted */ 
const rules = {}

runtime.createPlatform({
  name: 'ex',
  providers: {
    service: {
      type: 'singleton',
      value: () => import('./Service')
    }
  },
  components: [
    { tag: 'app', element: () => import('./Component') }
  ],
  bootstrap: {
    element: 'app',
    container: 'body'
  },
  global: {
    style: `
      .bg-red {
        background: red;
      }
    `
  },
  conditions (rules) {
    return true
  }
})

runtime.run(rules)
```

Runtime looks a little bit as micro front-ends. You can image that platforms are as different apps which can be lazy loaded depending on certain conditions.

<br/><br/>

<h4>Platform</h4>

```javascript
const platform = createPlatform({
  name: 'ex',
  providers: {
    service: {
      type: 'singleton',
      value: () => import('./Service')
    }
  },
  components: [
    { tag: 'app', element: () => import('./Component') }
  ],
  bootstrap: {
    element: 'app',
    container: 'body'
  },
  global: {
    style: `
      .bg-red {
        background: red;
      }
    `
  }
})

platform.mount()
```
Platform is actually app configuration. It registered services, components, global properties and etc.
Platform provides 5 basic options:

- Name -> This is the name of platform and also prefix for components, registered to that platform
- Providers -> The purpose of providers is to provide component access to services as services can be lazy loaded, singletons or multitons
- Components -> It provide easy way to register your components. As you see component can be lazy loaded or not. Platform name is 'ex' so name of component will be 'ex-app'
- Bootstrap -> Provides easy way to say which component to where should be mounted
- Global -> Properties thats are available in every component. You can also provide styles in it, so this styles will be attached to header. If you decide to use shadow-dow, it will be required manually to add them into component

<br/><br/>

<h4>Component</h4>

```javascript
export default (element: Element, dep: { service: () => Promise<{}>}) => {
  const counter = element.observe(0)

  const interval = setInterval(() => {
    counter.value++
  }, 1000)

  element.onUnmount(() => {
    clearInterval(interval)
  })

  return () => {
    return (
      <div className="bg-red">
        <slot><div>{counter}</div></slot>
      </div>
    )
  }
}

/* or */

export default createElement('ex-app', (element: Element, dep: { service: () => Promise<{}>}) => {
  const counter = element.observe(0)

  const interval = setInterval(() => {
    counter.value++
  }, 1000)

  element.onUnmount(() => {
    clearInterval(interval)
  })

  return () => {
    return (
      <div className="bg-red">
        <slot><div>{counter}</div></slot>
      </div>
    )
  }
})

/* or */

class Service {
  get (id: string) {
    return Promise.resolve({ id })
  }
}

export default async (element: Element, dep: { service: () => Promise<Service>}) => {
  const counter = element.observe(0)
  const service = await dep.service()

  service.get(5)
    .then(console.debug)
    .catch(console.debug)

  const interval = setInterval(() => {
    counter.value++
  }, 1000)

  element.onUnmount(() => {
    clearInterval(interval)
  })

  return () => {
    return (
      <div className="bg-red">
        <slot><div>{counter.value}</div></slot>
      </div>
    )
  }
}

```

Actually component is very simple. It is a function which receive element and providers, it can be async and return function which return jsx.

- Element.observe -> Make value reactive. It create proxy with format
```javascript
{
  value: T,
  pipe (fn: (value: T, oldValue: T) => any) => any,
  watch (fn: (value: T, oldValue: T) => any) => any,
}
```

You can make different magic with it. For example you can watch changes on that value as you pass function to watch or you can transform value via pipe, so when you set value, pipes are executed and result at the end will be set as value

- Element.props -> Props that you pass to component, they have the some format as above.
- Element.onMount, Element.onUnmount -> Function which are executed when component is mounted/unmounted
- Element.onError -> Handle errors on component
- dep -> Second argument to function are providers. They are async so they can we lazy loaded or whatever, element is async at all so you can make anything
