import express from "express";
import expressLayouts from 'express-ejs-layouts';
import methodOverride from 'method-override';
import path from "path";
import "reflect-metadata";
import { initializeDatabase } from "./config/database";
import routes from './routes';

console.log('server.ts');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method')); // For PUT and DELETE methods in forms

// View engine and layouts setup
app.set("view engine", "ejs");
// Point to src/views instead of dist/views
app.set("views", path.join(__dirname, "../src/views"));
app.use(expressLayouts);
app.set('layout', 'layouts/main'); // Set default layout
app.set("layout extractScripts", true); // Extract scripts to appropriate place in layout
app.set("layout extractStyles", true); // Extract styles to appropriate place in layout

// Static files
app.use(express.static(path.join(__dirname, "../public")));

// Routes
app.use('/', routes);

// Initialize database and start server
initializeDatabase()
    .then(() => {
        console.log("Database connection established");
        
        app.listen(port, () => {
            console.log(`Server running at http://localhost:${port}`);
        });
    })
    .catch((error: Error) => {
        console.error("Error during initialization:", error);
    });
