import type { ContentBlock, DocsContent } from "./types"

export type DocsBlockType = ContentBlock["type"]
export type DocsBlockRendererKey = string

export type DocsBlockByType<TType extends DocsBlockType> = Extract<ContentBlock, { type: TType }>

export type DocsRenderNode =
	| {
			type: "document"
			document: DocsContent
	  }
	| {
			type: "intro"
			intro: DocsContent["intro"]
	  }
	| {
			type: "section"
			section: DocsContent["sections"][number]
	  }
	| {
			type: "block"
			block: ContentBlock
	  }

export type DocsBlockRenderer<TContext, TResult, TType extends DocsBlockType = DocsBlockType> = (
	block: DocsBlockByType<TType>,
	context: TContext,
) => TResult

export type DocsBlockRendererMap<TContext, TResult> = {
	[K in DocsBlockType]: DocsBlockRenderer<TContext, TResult, K>
}

export function renderDocsBlock<TContext, TResult>(
	block: ContentBlock,
	renderers: DocsBlockRendererMap<TContext, TResult>,
	context: TContext,
): TResult {
	const renderer = renderers[block.type] as DocsBlockRenderer<TContext, TResult>
	return renderer(block as never, context)
}

export function defaultDocsBlockRendererKey(blockType: DocsBlockType): string {
	return `block.${blockType}`
}

export function resolveDocsBlockRendererKey(block: ContentBlock): DocsBlockRendererKey {
	const rendererKey = typeof block.rendererKey === "string" ? block.rendererKey.trim() : ""
	if (rendererKey.length > 0) {
		return rendererKey
	}
	return defaultDocsBlockRendererKey(block.type)
}

export function assertNeverBlockType(value: never, owner: string): never {
	const raw = value as { type?: string }
	throw new Error(
		`Unsupported docs block type '${raw.type ?? "unknown"}' in ${owner}. Add a renderer for this block type.`,
	)
}
