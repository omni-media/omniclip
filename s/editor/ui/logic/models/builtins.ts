
type ModelMetadata = {
	label: string
	purpose: string
}

export const assistantModelId = "assistant-gemma-4-e2b"

export const builtinModelMetadata: Record<string, ModelMetadata> = {
	[assistantModelId]: {label: "Gemma 4 E2B", purpose: "AI assistant"},
	"onnx-community/whisper-tiny_timestamped": {label: "Whisper Tiny", purpose: "Automatic speech recognition"},
	"onnx-community/whisper-base_timestamped": {label: "Whisper Base", purpose: "Automatic speech recognition"},
	"onnx-community/whisper-small_timestamped": {label: "Whisper Small", purpose: "Automatic speech recognition"},
	"Xenova/modnet": {label: "MODNet", purpose: "Background removal"},
	"onnx-community/ISNet-ONNX": {label: "ISNet", purpose: "Background removal"},
	"briaai/RMBG-1.4": {label: "RMBG 1.4", purpose: "Background removal"},
}

