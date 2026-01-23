import starlight from "@astrojs/starlight";
import { konamiEmojiBlast } from "@konami-emoji-blast/astro";
import { defineConfig, fontProviders } from "astro/config";
import starlightLinksValidator from "starlight-links-validator";
import starlightTypeDoc from "starlight-typedoc";

export default defineConfig({
	experimental: {
		fonts: [
			{
				cssVariable: "--font-varela-round",
				name: "Varela Round",
				provider: fontProviders.google(),
			},
		],
	},
	image: {
		responsiveStyles: true,
	},
	integrations: [
		konamiEmojiBlast(),
		starlightLinksValidator(),
		starlight({
			components: {
				Footer: "./src/components/Footer.astro",
				Head: "./src/components/Head.astro",
				SiteTitle: "./src/components/SiteTitle.astro",
				TwoColumnContent: "./src/components/TwoColumnContent.astro",
			},
			customCss: ["./src/styles/global.css"],
			favicon: "favicon.ico",
			logo: {
				src: "./src/assets/favicon.png",
			},
			plugins: [
				starlightTypeDoc({
					entryPoints: ["../src/index.ts"],
					output: "generated/api",
					sidebar: {
						label: "API",
					},
					tsconfig: "../tsconfig.json",
					typeDoc: {
						cleanOutputDir: true,
						disableSources: true,
						entryFileName: "index",
						excludeInternal: true,
						excludePrivate: true,
						groupOrder: ["Functions", "Interfaces", "*"],
						indexFormat: "table",
						name: "API",
						readme: "none",
						sort: ["source-order"],
					},
				}),
			],
			sidebar: [
				{
					label: "Get Started",
					link: "get-started",
				},
				{
					label: "Preset Configs",
					link: "configs",
				},
				{
					autogenerate: {
						directory: "rules",
					},
					label: "Rules",
				},
				{
					label: "Standalone CLI",
					link: "cli",
				},
				{
					collapsed: true,
					items: [
						{
							autogenerate: {
								directory: "docs",
							},
							label: "Guides",
						},
						{ label: "API", link: "generated/api" },
					],
					label: "Technical Docs",
				},
			],
			social: [
				{
					href: "https://github.com/OctoGuide/bot",
					icon: "github",
					label: "GitHub",
				},
			],
			tableOfContents: {
				maxHeadingLevel: 4,
			},
			title: "OctoGuide",
		}),
	],
	outDir: "../dist-site",
	site: "https://octo.guide",
	trailingSlash: "ignore",
});
