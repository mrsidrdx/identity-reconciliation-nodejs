import { ContactController } from "./controller/ContactController"

export const Routes = [{
    method: "post",
    route: "/identify",
    controller: ContactController,
    action: "identify"
}]