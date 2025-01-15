// pages/api/mapbox.ts
import type { NextApiRequest, NextApiResponse } from 'next';

const MAPBOX_BASE_URL = "https://api.mapbox.com/geocoding/v5/mapbox.places";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { query } = req;

    // Ensure the request has the required query parameters
    if (!query.input) {
        res.status(400).json({ error: "Input parameter is required" });
        return;
    }

    const input = query.input as string;
    const bbox = query.bbox || "-124.409591,32.534156,-114.131211,42.009518"; // Default bounding box (e.g., California)
    const proximity = query.proximity || "-119.270329,37.271875"; // Default proximity (e.g., California center)

    try {
        const response = await fetch(
            `${MAPBOX_BASE_URL}/${encodeURIComponent(input)}.json?` +
            `access_token=${process.env.MAPBOX_ACCESS_TOKEN}` +
            `&country=US` +
            `&types=address` +
            `&bbox=${bbox}` +
            `&proximity=${proximity}`
        );

        if (!response.ok) {
            throw new Error("Failed to fetch data from Mapbox");
        }

        const data = await response.json();
        res.status(200).json(data);
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ error: error.message || "Internal Server Error" });
    }
}
