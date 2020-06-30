import { App } from "../../App";
import  module  from "../../Module";

export function bootstrap() {
    return new (App as any)(module);
}