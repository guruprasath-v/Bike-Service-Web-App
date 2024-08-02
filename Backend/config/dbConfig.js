import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port:process.env.DB_PORT,
    ssl: {
        rejectUnauthorized: true // This ensures the connection is secure
    }
  });


try{
    await connection.connect();
    console.log("Connected to the database");
}catch(e){
    throw new Error("Error connecting to the database",);
}

export default connection;