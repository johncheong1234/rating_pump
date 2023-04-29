import clientPromise from "../../../lib/mongodb";

export default async (req, res) => {
    try {
        const client = await clientPromise;
        const db = client.db("lalgo");
        console.log("db", db)
        const algorithms = await db
            .collection("algorithms")
            .find({})
            .toArray();
 
        res.json(algorithms);
    } catch (e) {
        console.error(e);
    }
 };