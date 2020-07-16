import { bootstrap } from './../bootstrap/bootstrap';
import { IModuleContainer, IExFModule } from '../interfaces/interfaces';


const container: IModuleContainer = {
  components: {},
  bootstraps: {}
}

function register(target: any, cmp: any,) {
  const selector = Reflect.getMetadata('component:selector', cmp);
  if (target[selector]) {
    throw new Error(`Component ${selector} is already registered!`);
  }
  target[selector] = cmp;
}

function registerBootstraps(cmp: any) {
  register(container.bootstraps, cmp);
  bootstrap(cmp, 'app');
}

export function ExFModule({ components, modules, bootstraps }: IExFModule) {
  if (!!components) { components.forEach(register.bind(undefined, container.components)); }
  if (!!modules) { modules.forEach(ExFModule); }
  if (!!bootstraps) { bootstraps.forEach(registerBootstraps); }
}
