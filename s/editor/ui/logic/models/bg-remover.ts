
export const backgroundRemoverModels = [
	{id: "Xenova/modnet", name: "MODNet"},
	{id: "onnx-community/ISNet-ONNX", name: "ISNet"},
	{id: "briaai/RMBG-1.4", name: "RMBG 1.4"},
] as const

export type BgRemoverModel = typeof backgroundRemoverModels[number]["id"]
