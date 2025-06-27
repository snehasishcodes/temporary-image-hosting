import fs from "fs";
import path from "path";
import sanity from "../sanity";

export default async function upload(
    filePath: string,
    expiresAt: string,
    title?: string
) {
    const imageStream = fs.createReadStream(filePath);
    const asset = await sanity.assets.upload("image", imageStream, {
        filename: path.basename(filePath),
    });

    const doc = await sanity.create({
        _type: "tempImage",
        image: {
            _type: "image",
            asset: {
                _type: "reference",
                _ref: asset._id,
            },
        },
        expiresAt,
        title
    });

    return doc;
}