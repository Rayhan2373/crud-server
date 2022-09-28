const express = require('express')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.json())

app.get('/', (req,  res)=>{
    res.send('Hello from get')
})

const uri = `mongodb+srv://${process.env.user_name}:${process.env.user_pass}@cluster0.guzcczi.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run(){
    try{
        await client.connect()
        const peopleCollection = client.db('people').collection('peoples-info')
        app.get('/people',async(req , res)=>{
                const query = {}
                const people = peopleCollection.find(query)
                const result = await people.toArray()
                res.send(result)
        })
        app.get('/people/:id',async(req , res)=>{
            const id = req.params.id;
            const query = {_id : ObjectId(id)}
            const people = peopleCollection.find(query)
            const result = await people.toArray()
            res.send(result)
    })
        app.post('/people', async(req, res)=>{
            const people = req.body;
            console.log(people)
            const result = await peopleCollection.insertOne(people)
            res.send(result)
        })

        app.put('/people/:id', async(req, res)=>{
            const id = req.params.id;
            const updatedPerson = req.body;
            const query = {_id : ObjectId(id)}
            const options = {upsert : true}
            const updatedDoc ={
                $set : {
                    name : updatedPerson.name,
                    email: updatedPerson.email
                }
            }
            const result = await peopleCollection.updateOne(query, updatedDoc, options)
            res.send(result)
        })
        app.delete('/people/:id', async(req, res)=>{
            const id = req.params.id;
            const query = {_id : ObjectId(id)}
            const result = peopleCollection.deleteOne(query)
            res.send(result)
            console.log(result)

        })
    }
    catch{

    }
}
run().catch(console.error())
app.listen(5000, ()=>{
    console.log('Successfully Done')
})