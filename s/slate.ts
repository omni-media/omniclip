import {SlateFor} from "@benev/slate"
import {slate, Context} from "@benev/construct/x/mini.js"

export class OmniContext extends Context {}

export const omnislate = slate as SlateFor<OmniContext>
