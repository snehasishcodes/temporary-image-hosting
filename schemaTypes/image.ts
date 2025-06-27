import { defineType, defineField } from "sanity";

export const tempImage = defineType({
    name: "tempImage",
    title: "Temporary Image",
    type: "document",
    fields: [
        defineField({
            name: "title",
            title: "Title",
            type: "string",
            validation: (Rule) => Rule.min(1).max(100),
            description: "Give your image a descriptive title (optional)",
        }),
        defineField({
            name: "image",
            title: "Image",
            type: "image",
            options: {
                hotspot: true,
            },
            validation: (Rule) => Rule.required(),
          }),
        defineField({
            name: "expiresAt",
            title: "Expires At",
            type: "datetime",
            description: "When this image will expire and be removed",
            validation: (Rule) => Rule.required(),
          }),
    ],
});
