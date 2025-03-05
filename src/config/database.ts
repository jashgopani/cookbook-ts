import path from "path";
import { Connection, createConnection } from "typeorm";
import { Category } from "../models/Category";
import { Recipe } from "../models/Recipe";

// Create connection configuration
const connectionConfig = {
    type: "sqlite" as const,
    database: path.join(__dirname, "../../database.sqlite"),
    synchronize: true, // Set to false in production
    logging: false,
    entities: [Category, Recipe],
    migrations: [],
    subscribers: []
};

// Export the connection configuration
export const initializeDatabase = async (): Promise<Connection> => {
    try {
        const connection = await createConnection(connectionConfig);
        return connection;
    } catch (err) {
        console.error("Database connection error:", err);
        throw err;
    }
};

// Export a function to get the repositories
export const getRepositories = async () => {
    const connection = await createConnection(connectionConfig);
    return {
        categoryRepository: connection.getRepository(Category),
        recipeRepository: connection.getRepository(Recipe)
    };
};
