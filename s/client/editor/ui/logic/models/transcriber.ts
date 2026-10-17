
export const transcriberModels = [
	{id: "onnx-community/whisper-tiny_timestamped", name: "Whisper Tiny"},
	{id: "onnx-community/whisper-base_timestamped", name: "Whisper Base"},
	{id: "onnx-community/whisper-small_timestamped", name: "Whisper Small"},
] as const

export type TranscriberModel = typeof transcriberModels[number]["id"]
