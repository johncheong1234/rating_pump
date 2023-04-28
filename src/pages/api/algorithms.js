import clientPromise from "../../../lib/mongodb";

export default async (req, res) => {
    try {
        const client = await clientPromise;
        const db = client.db("lalgo");
 
        const algorithms = await db
            .collection("algorithms")
            .find({})
            .toArray();
 
        res.json(algorithms);
    } catch (e) {
        console.error(e);
    }
 };