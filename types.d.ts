import "oak/mod.ts";
import { Accepts } from "accepts/mod.ts";
declare module "oak/mod.ts" {
  export interface Context {
    accepts: Accepts;
  }
}
