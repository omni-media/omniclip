
import type {TranscriberSpec} from "@omnimedia/omnitool"

export type AiDevice = TranscriberSpec["device"]
export type AiDtype = TranscriberSpec["dtype"]

export const AI_DEVICES = [
	["webgpu", "WebGPU"],
	["wasm", "WASM"],
	["auto", "Auto"],
	["cpu", "CPU"],
	["webnn", "WebNN"],
	["webnn-gpu", "WebNN GPU"],
	["webnn-npu", "WebNN NPU"],
	["webnn-cpu", "WebNN CPU"],
	["gpu", "GPU"],
	["cuda", "CUDA"],
	["dml", "DML"],
] as const satisfies readonly (readonly [AiDevice, string])[]

export const AI_DTYPES = [
	["auto", "Auto"],
	["fp32", "FP32"],
	["fp16", "FP16"],
	["q8", "Q8"],
	["int8", "INT8"],
	["uint8", "UINT8"],
	["q4", "Q4"],
	["bnb4", "BNB4"],
	["q4f16", "Q4F16"],
] as const satisfies readonly (readonly [AiDtype, string])[]

export const formatProgress = (n: number, label: string) =>
	Number.isFinite(n) ? `${label} ${n}%` : `${label}...`
