
import type {AssistantDtype, AssistantSettings} from "../../models/assistant.js"

type Runtime = Pick<AssistantSettings, "device" | "dtype">

const PRECISION_PRIORITY = ["q4f16", "q4", "q8", "fp16", "fp32"] as const

function resolvePrecision(
	availableDtypes: AssistantDtype[],
	requestedDtype: Runtime["dtype"],
	allowFp16: boolean,
): AssistantDtype | undefined {
	const candidates = availableDtypes.filter(dtype =>
		allowFp16 || !(dtype === "fp16" || dtype.endsWith("f16"))
	)

	if (requestedDtype !== "auto")
		return candidates.includes(requestedDtype) ? requestedDtype : undefined
	return PRECISION_PRIORITY.find(candidate => candidates.includes(candidate)) ?? candidates[0]
}

async function resolveDevice(device: Runtime["device"]) {
	const adapter = device === "auto" || device === "webgpu"
		? await navigator.gpu?.requestAdapter()
		: undefined
	if (device === "auto") device = adapter ? "webgpu" : "wasm"
	return {device, adapter}
}

export async function resolveRuntime(
	dtypes: AssistantDtype[],
	{device, dtype}: Runtime,
): Promise<Runtime> {
	if (device !== "auto" && dtype !== "auto") return {device, dtype}

	const resolved = await resolveDevice(device)

	const fp16 = resolved.device === "webgpu" && !!resolved.adapter?.features.has("shader-f16")
	const precision = resolvePrecision(dtypes, dtype, fp16)
	if (!precision) throw new Error("No compatible precision")
	return {device: resolved.device, dtype: precision}
}

