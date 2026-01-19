import { useState, useCallback } from "react"

export function useCopyToClipboard(timeout = 2000) {
	const [copied, setCopied] = useState(false)

	const copy = useCallback(
		async (text: string) => {
			if (typeof navigator !== "undefined" && navigator.clipboard) {
				await navigator.clipboard.writeText(text)
				setCopied(true)
				setTimeout(() => setCopied(false), timeout)
			}
		},
		[timeout],
	)

	return { copied, copy }
}
