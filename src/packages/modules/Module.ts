import { bootstrap } from './../bootstrap/bootstrap';
import { IModuleContainer, IExFModule } from '../interfaces/interfaces';


const container: IModuleContainer = {
  components: {},
  services: {},
  bootstraps: {}
}

function register(target: any, instance: boolean, cmp: any,) {
  const selector = Reflect.getMetadata('component:selector', cmp);
  const isThereSomeone = Reflect.getMetadata(selector, target);
  if (isThereSomeone) { throw new Error(`Component ${selector} is already registered!`); }
  const c = instance ? new cmp() : cmp;
  Reflect.defineMetadata(selector, c, target);
}

function registerModules(module: IExFModule) {
  return ExFModule(module)
}

function registerBootstraps(cmp: any) {
  register(container.bootstraps, false, cmp);
  bootstrap(cmp, 'app');
}

export function ExFModule({ components, services, modules, bootstraps }: IExFModule) {
  if (!!services) { services.forEach(register.bind(undefined, container.services, true)); }
  if (!!components) { components.forEach(register.bind(undefined, container.components, false)); }
  if (!!modules) { modules.forEach(registerModules); }
  if (!!bootstraps) { bootstraps.forEach(registerBootstraps); }
}

export function getServices() {
  return container.services;
}
