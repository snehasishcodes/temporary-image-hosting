import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./schemaTypes";

export default defineConfig({
	name: "default",
	title: "i.snehasish.xyz",

	projectId: "qip2n2c0",
	dataset: "production",

	plugins: [structureTool(), visionTool()],

	schema: {
		types: schemaTypes,
	},
})
