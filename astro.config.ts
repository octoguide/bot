import starlight from "@astrojs/starlight";
import { konamiEmojiBlast } from "@konami-emoji-blast/astro";
import { defineConfig, fontProviders } from "astro/config";
import starlightLinksValidator from "starlight-links-validator";

export default defineConfig({
	experimental: {
		fonts: [
			{
				cssVariable: "--font-varela-round",
				name: "Varela Round",
				provider: fontProviders.google(),
			},
		],
		responsiveImages: true,
	},
	integrations: [
		konamiEmojiBlast(),
		starlightLinksValidator(),
		starlight({
			components: {
				Footer: "./src/components/Footer.astro",
				Head: "./src/components/Head.astro",
				TwoColumnContent: "./src/components/TwoColumnContent.astro",
			},
			customCss: ["./src/styles/global.css"],
			favicon: "favicon.ico",
			logo: {
				src: "./src/assets/favicon.png",
			},
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
					autogenerate: {
						directory: "docs",
					},
					collapsed: true,
					label: "Technical Docs",
				},
			],
			social: [
				{
					href: "https://github.com/JoshuaKGoldberg/OctoGuide",
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
	outDir: "dist-site",
	publicDir: "./site/public",
	root: "./site",
	site: "https://create.bingo",
	srcDir: "./site/src",
	trailingSlash: "never",
});
