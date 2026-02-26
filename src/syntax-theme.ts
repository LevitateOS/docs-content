import type { ThemeRegistration } from "shiki"

export const INDUSTRIAL_PASTEL_1984_THEMES = {
	light: {
		name: "industrial-pastel-1984-light",
		type: "light",
		colors: {
			"editor.foreground": "#44515e",
			"editor.background": "#00000000",
		},
		tokenColors: [
			{
				scope: [
					"comment",
					"punctuation.definition.comment",
					"comment.block.documentation",
				],
				settings: { foreground: "#7b808d", fontStyle: "italic" },
			},
			{
				scope: [
					"keyword",
					"keyword.control",
					"keyword.operator",
					"storage",
					"storage.type",
					"storage.modifier",
					"keyword.operator.word",
				],
				settings: { foreground: "#7c658f" },
			},
			{
				scope: [
					"string",
					"string.quoted",
					"string.template",
					"string.regexp",
				],
				settings: { foreground: "#4d7c72" },
			},
			{
				scope: [
					"constant.numeric",
					"constant.language",
					"constant.character",
					"constant.character.escape",
					"constant.other",
				],
				settings: { foreground: "#b2665f" },
			},
			{
				scope: [
					"entity.name.function",
					"entity.name.function.member",
					"support.function",
					"support.function.builtin",
					"meta.function-call",
					"variable.function",
				],
				settings: { foreground: "#5e77a0" },
			},
			{
				scope: [
					"entity.name.type",
					"entity.name.class",
					"entity.name.namespace",
					"support.type",
					"support.class",
				],
				settings: { foreground: "#7b9371" },
			},
			{
				scope: [
					"variable",
					"variable.parameter",
					"variable.other.readwrite",
					"variable.other.property",
					"support.variable",
					"meta.definition.variable.name",
					"meta.object-literal.key",
					"meta.property-name",
					"entity.name.variable",
				],
				settings: { foreground: "#394b58" },
			},
			{
				scope: [
					"punctuation",
					"meta.brace",
					"meta.delimiter",
				],
				settings: { foreground: "#6f7482" },
			},
			{
				scope: ["invalid", "invalid.illegal"],
				settings: { foreground: "#fff5f4", background: "#9f6e6a" },
			},
		],
	},
	dark: {
		name: "industrial-pastel-1984-dark",
		type: "dark",
		colors: {
			"editor.foreground": "#d8cebc",
			"editor.background": "#00000000",
		},
		tokenColors: [
			{
				scope: [
					"comment",
					"punctuation.definition.comment",
					"comment.block.documentation",
				],
				settings: { foreground: "#9aa5ba", fontStyle: "italic" },
			},
			{
				scope: [
					"keyword",
					"keyword.control",
					"keyword.operator",
					"storage",
					"storage.type",
					"storage.modifier",
					"keyword.operator.word",
				],
				settings: { foreground: "#c5a8d9" },
			},
			{
				scope: [
					"string",
					"string.quoted",
					"string.template",
					"string.regexp",
				],
				settings: { foreground: "#98c5b4" },
			},
			{
				scope: [
					"constant.numeric",
					"constant.language",
					"constant.character",
					"constant.character.escape",
					"constant.other",
				],
				settings: { foreground: "#e1a08f" },
			},
			{
				scope: [
					"entity.name.function",
					"entity.name.function.member",
					"support.function",
					"support.function.builtin",
					"meta.function-call",
					"variable.function",
				],
				settings: { foreground: "#a9bce5" },
			},
			{
				scope: [
					"entity.name.type",
					"entity.name.class",
					"entity.name.namespace",
					"support.type",
					"support.class",
				],
				settings: { foreground: "#b8c7a1" },
			},
			{
				scope: [
					"variable",
					"variable.parameter",
					"variable.other.readwrite",
					"variable.other.property",
					"support.variable",
					"meta.definition.variable.name",
					"meta.object-literal.key",
					"meta.property-name",
					"entity.name.variable",
				],
				settings: { foreground: "#ece2d1" },
			},
			{
				scope: [
					"punctuation",
					"meta.brace",
					"meta.delimiter",
				],
				settings: { foreground: "#b3bdd2" },
			},
			{
				scope: ["invalid", "invalid.illegal"],
				settings: { foreground: "#fff6f5", background: "#b9827e" },
			},
		],
	},
} satisfies Record<"light" | "dark", ThemeRegistration>
