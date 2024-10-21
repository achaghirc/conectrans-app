import { getProvincesByCountryCode } from "@/lib/data/geolocate";
import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";


export default async function handler(req: NextApiRequest, res: NextApiResponse){
    const { countryCode } = req.query;

    if (!countryCode) {
        return res.status(400).json([]);
    }

    const countryCodeStr = countryCode.toString();
    try {
        const provinces = await getProvincesByCountryCode(countryCodeStr);
        return res.status(200).json(provinces);
    } catch(e){
        console.log(e);
        return res.status(500).json({ message: 'Error getting provinces', e});
    }


}