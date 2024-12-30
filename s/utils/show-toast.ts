// styles for it are inside index.css
export function showToast(message: string, type: "error" | "warning" | "info") {
	const toast = document.createElement("div")
	toast.textContent = message
	toast.className = `toast ${type}`
	document.body.appendChild(toast)
	setTimeout(() => document.body.removeChild(toast), 5000)
}
