import { runBuild } from "./build"

async function main() {
	await runBuild({ validateOnly: true })
}

main().catch((err) => {
	console.error("Syntax validation failed:", err)
	process.exit(1)
})
