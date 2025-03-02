import  { MongoClient } from 'mongodb'


export default async function handler(req, res){
    if(req.method === 'POST'){
        const data = req.body;
        console.log(data)
        try{
        const client = await MongoClient.connect('mongodb+srv://adelinojusto911:qwKXFfLG0CIzm06n@cluster0.ozcth.mongodb.net/meetups?retryWrites=true&w=majority&appName=Cluster0');
        const db = client.db();
        const meetupCollection = db.collection('meetups');

        const result = await meetupCollection.insertOne(data)
        console.log(result);
        client.close()
        res.status(200).json({ message: "Successfully inserted meetup", result });
        }
        catch(e){
            console.log(e.message);
            res.status(500).json({ message: "Error inserting meetup", error: e.message }); // Proper error response
        }
    }

}