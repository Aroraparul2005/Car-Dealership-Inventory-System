import http from 'http';
import app from './app.js';

const PORT=process.env.PORT;

const server=http.createServer(app);

const connectDatabase = async () => {
    try {
        console.log("Connecting to database...");
        await mongoose.connect(process.env.MONGO_URI);
    } catch (error) {
        console.error("Database connection failure:", error);
        process.exit(1);
    }
};

const start=async ()=>{
    await connectDatabase();
    
    server.listen(PORT,()=>{
        console.log(`server running on http://localhost:${PORT}`);
    });
};
start();