import { getProvincesByCountryId } from "@/lib/data/geolocate";
import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";


export default async function handler(req: NextApiRequest, res: NextApiResponse){
    const { countryId } = req.query;

    if (!countryId) {
        return res.status(400).json([]);
    }

    const countryIdStr = countryId.toString();
    try {
        const provinces = await getProvincesByCountryId(parseInt(countryIdStr));
        return res.status(200).json(provinces);
    } catch(e){
        console.log(e);
        return res.status(500).json({ message: 'Error getting provinces', e});
    }


}