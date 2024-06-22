const express = require('express')
const app = express()
const cors = require('cors')
const port = process.env.PORT || 3000
const jwt = require('jsonwebtoken')
require('dotenv').config()

app.use(cors())
app.use(express.json())

//database connection setup 

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.vybo3pc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection
    const userCollection = client.db('delivery-service').collection('users')
    const bookedParcelCollection = client.db('delivery-service').collection('booked-Parcel')
    const reviewCollection = client.db('delivery-service').collection('reviews')
    //post users to database upon login

    app.post('/user', async(req,res)=>{
        const data = req.body
        console.log(req.body)
        const result = await userCollection.insertOne(data)
        res.send(result)
    })
    //get all the users 

    //make an user a delivery rider 
    app.patch("/user/deliveryMan/:id", async (req, res) => {
        const id = req.params.id;
        const filter = { _id: new ObjectId(id) };
        const updatedDoc = {
          $set: {
            role: "delivery",
          },
        };
        const result = await userCollection.updateOne(filter, updatedDoc);
        res.send(result);
      });
// make an user an admin
      app.patch("/user/admin/:id", async (req, res) => {
        const id = req.params.id;
        const filter = { _id: new ObjectId(id) };
        const updatedDoc = {
          $set: {
            role: "admin",
          },
        };
        const result = await userCollection.updateOne(filter, updatedDoc);
        res.send(result);
      });

    app.get('/user', async(req,res)=>{
        const result = await userCollection.find().toArray()
        res.send(result)
    })
    app.get('/user', async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1; // Current page number, default to 1 if not provided
            const pageSize = parseInt(req.query.pageSize) || 5; // Number of users per page, default to 5 if not provided
    
            const skip = (page - 1) * pageSize;
    
            const users = await userCollection.find().skip(skip).limit(pageSize).toArray();
    
            const totalUsers = await userCollection.countDocuments();
    
            res.status(200).json({ users, totalUsers });
        } catch (error) {
            console.error('Error fetching users:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });
    
    //get users with role delivery ? 
    app.get('/user/delivery', async (req, res) => {
        const result = await userCollection.find({ role: 'delivery' }).toArray();
        res.send(result);
    });
    
   // get a user info by email 
   app.get('/user/:email', async (req, res) => {
    const email = req.params.email;
    try {
        const result = await userCollection.findOne({ email });
        if (result) {
            res.send({ role: result.role }); // Assuming role is stored in result
        } else {
            res.status(404).send({ error: "User not found" });
        }
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).send({ error: "Internal server error" });
    }
});

// user related api ----------------------------------
// booking a parcel 

app.post('/parcelBookingData', async (req, res) => {
    try {
        const parcelBookingData = req.body;
        parcelBookingData.requested_Delivery_Date = new Date(parcelBookingData.requested_Delivery_Date);
        parcelBookingData.booking_Date = new Date(parcelBookingData.booking_Date);

        const result = await bookedParcelCollection.insertOne(parcelBookingData);
        res.status(201).json({ insertedId: result.insertedId });
    } catch (error) {
        console.error('Error occurred while booking parcel:', error);
        res.status(500).json({ error: 'Failed to book your parcel. Please try again later.' });
    }
});

//get parcels based on specific user email
app.get('/parcelBookingData', async (req, res) => {
    const email = req.query.email;  
    const query = {
        user_Email: email
    };
    const result = await bookedParcelCollection.find(query).toArray();
    res.send(result);
});
app.get('/allBookedParcel', async(req,res) =>{
    const data = await bookedParcelCollection.find().toArray()
    res.send(data)
})
//get delivery riders orders based on id  

app.get('/myParcels/:deliveryRiderId', async (req, res) => {
    const deliveryRiderId = req.params.deliveryRiderId;

    try {
        const parcels = await bookedParcelCollection.find({ delivery_Rider_Id: deliveryRiderId }).toArray();
        res.status(200).json(parcels);
    } catch (error) {
        console.error('Error fetching parcels:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
// get specific parcel id 
app.get('/parcelBookingData/:id', async(req,res) =>{
    const id = req.params.id
    const query = {
        _id : new ObjectId(id)
    }
    const result = await bookedParcelCollection.findOne(query)
    res.send(result)
})

//update and assign riders 

app.get('/allParcels' , async(req,res) => {
    const data = await bookedParcelCollection.find().toArray()
    res.send(data)
})
app.patch('/allParcels/:id', async (req, res) => {
    const id = req.params.id;
    const data = req.body;
    console.log(req.body, id);

    try {
        const filter = { _id: new ObjectId(id) };
        const updatedDoc = {
            $set: {
                approximate_Delivery_Date: new Date(data.approximate_Delivery_Date), // Ensure this is a Date object
                delivery_Rider_Id: data.delivery_Rider_Id,
                status: data.status
            }
        };
        const result = await bookedParcelCollection.updateOne(filter, updatedDoc);
        res.send(result);
    } catch (error) {
        console.error('Error updating parcel:', error);
        res.status(500).send('Internal Server Error');
    }
});
// show parcel data based on date 
app.get('/allParcelData', async (req, res) => {
    try {
        const { from, to } = req.query;
        console.log(req.query)
        let filter = {};

        if (from && to) {
            filter.requested_Delivery_Date = {
                $gte: new Date(from),
                $lte: new Date(to)
            };
        }

        const parcels = await bookedParcelCollection.find(filter).toArray();
        res.status(200).json(parcels);
    } catch (error) {
        console.error('Error fetching parcels:', error);
        res.status(500).json({ error: error.message });
    }
});





app.patch('/parcelBookingData/:id', async (req, res) => {
    const id = req.params.id;
    const data = req.body;

    console.log("Data to be updated:", data);

    const filter = { _id: new ObjectId(id) };
    const updatedDoc = {
        $set: {
            user_Name: data.user_Name,
            user_Email: data.user_Email,
            user_Photo: data.user_Photo,
            user_Phone_Number: data.user_Phone_Number,
            requested_Delivery_Date: new Date(data.requested_Delivery_Date), // Ensure this is a Date object
            price: data.price,
            receiver_Name: data.receiver_Name,
            receivers_Phone: data.receivers_Phone,
            package_Type: data.package_Type,
            location_Latitude: data.location_Latitude,
            location_Longitude: data.location_Longitude,
            delivery_Address: data.delivery_Address,
            weight: data.weight,
            status: data.status
        }
    };

    console.log("Filter:", filter);
    console.log("Updated Document:", updatedDoc);

    try {
        const result = await bookedParcelCollection.updateOne(filter, updatedDoc);
        console.log("Update Result:", result);
        res.send(result);
    } catch (error) {
        console.error("Error updating document:", error);
        res.status(500).send({ message: "Error updating document", error });
    }
});




app.patch('/parcelBookingData/:id/status', async (req, res) => {
    const id = req.params.id;
    const { status } = req.body;
    console.log(req.body)
    console.log(id)

    try {
        const filter = { _id: new ObjectId(id) };
        const updateDoc = {
            $set: {
                status: status
            }
        };
        const result = await bookedParcelCollection.updateOne(filter, updateDoc);
        
        if (result.modifiedCount === 1) {
            res.status(200).json({ message: 'Order status updated successfully' });
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// give review 
// Give review 
app.post('/reviews', async (req, res) => {
    const data = req.body;
    const result = await reviewCollection.insertOne(data);
    res.send(result);
});

// Get reviews based on specific delivery rider's id 
app.get('/reviews/:deliveryRiderId', async (req, res) => {
    const deliveryRiderId = req.params.deliveryRiderId;

    try {
        const parcels = await reviewCollection.find({ delivery_Rider_Id: deliveryRiderId }).toArray();
        res.status(200).json(parcels);
    } catch (error) {
        console.error('Error fetching parcels:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
app.get('/parcels/delivered/:deliveryManId', async (req, res) => {
    const deliveryManId = req.params.deliveryManId;
    try {
        const parcels = await bookedParcelCollection.find({ delivery_Rider_Id: deliveryManId, status: 'delivered' }).toArray();
        res.status(200).json(parcels);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Fetch reviews for a specific delivery man
app.get('/reviews/:deliveryManId', async (req, res) => {
    const deliveryManId = req.params.deliveryManId;
    try {
        const reviews = await reviewCollection.find({ delivery_Rider_Id: deliveryManId }).toArray();
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});





    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/',(req,res) => {
    res.send('Server is running')
})

app.listen(port, () =>{
    console.log('server is running on port' , port)
})
