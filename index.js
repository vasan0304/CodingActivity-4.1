import express from "express";
import { graphqlHTTP } from "express-graphql";
import { buildSchema } from "graphql";

const app = express();

/* Initial Restaurant Data matching assignment screenshots */
let restaurants = [
  {
    id: "1",
    name: "The Spice Garden",
    description: "Authentic Indian cuisine with a modern twist, featuring aromatic spices and rich flavors.",
    cuisine: "Indian",
    rating: 4.7,
    address: "12 Marina Beach Road, Chennai, Tamil Nadu"
  },
  {
    id: "2",
    name: "Bella Italia",
    description: "A classic Italian trattoria serving handmade pasta, wood-fired pizzas, and fine wines.",
    cuisine: "Italian",
    rating: 4.5,
    address: "45 Church Street, Bangalore, Karnataka"
  },
  {
    id: "3",
    name: "Dragon Palace",
    description: "Exquisite Chinese and Pan-Asian dishes prepared by award-winning chefs.",
    cuisine: "Chinese",
    rating: 4.3,
    address: "78 Connaught Place, New Delhi"
  },
  {
    id: "4",
    name: "Petit Bistro",
    description: "Charming French bistro offering classic dishes, pastries, and fine wine.",
    cuisine: "French",
    rating: 4.6,
    address: "22 Bandra West, Mumbai, Maharashtra"
  },
  {
    id: "5",
    name: "Taco Fiesta",
    description: "Vibrant Mexican street food with bold flavors, fresh ingredients, and handcrafted margaritas.",
    cuisine: "Mexican",
    rating: 4.2,
    address: "9 Indiranagar, Bangalore, Karnataka"
  }
];

/* GraphQL Schema */
const schema = buildSchema(`
  type Restaurant {
    id: String
    name: String
    description: String
    cuisine: String
    rating: Float
    address: String
  }

  input RestaurantInput {
    name: String
    description: String
    cuisine: String
    rating: Float
    address: String
  }

  type DeleteResponse {
    ok: Boolean
    id: String
    message: String
  }

  type Query {
    restaurant(id: String!): Restaurant
    restaurants: [Restaurant]
  }

  type Mutation {
    setrestaurant(
      input: RestaurantInput,
      name: String,
      description: String,
      cuisine: String,
      rating: Float,
      address: String
    ): Restaurant

    Deleterestaurant(id: String!): DeleteResponse

    editrestaurant(
      id: String!,
      input: RestaurantInput,
      name: String,
      description: String,
      cuisine: String,
      rating: Float,
      address: String
    ): Restaurant
  }
`);

/* Root Resolvers */
const root = {
  // Query 1: Get single restaurant by ID
  restaurant: ({ id }) => {
    return restaurants.find(r => r.id === id);
  },

  // Query 2: Get all restaurants
  restaurants: () => {
    return restaurants;
  },

  // Mutation 1: Create a restaurant
  setrestaurant: (args) => {
    const data = args.input || args;
    const newRestaurant = {
      id: String(restaurants.length + 1),
      name: data.name || "",
      description: data.description || "",
      cuisine: data.cuisine || "",
      rating: data.rating !== undefined ? data.rating : 0.0,
      address: data.address || ""
    };
    restaurants.push(newRestaurant);
    return newRestaurant;
  },

  // Mutation 2: Delete a restaurant by ID
  Deleterestaurant: ({ id }) => {
    const index = restaurants.findIndex(r => r.id === id);
    if (index === -1) {
      return { ok: false, id, message: `Restaurant with id "${id}" not found.` };
    }
    restaurants.splice(index, 1);
    return { ok: true, id, message: `Restaurant with id "${id}" deleted successfully.` };
  },

  // Mutation 3: Edit a restaurant by ID
  editrestaurant: ({ id, input, ...rest }) => {
    const index = restaurants.findIndex(r => r.id === id);
    if (index === -1) {
      return null;
    }
    const update = input || rest;
    restaurants[index] = {
      ...restaurants[index],
      ...update,
      id
    };
    return restaurants[index];
  }
};

/* GraphQL Endpoint */
app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true
  })
);

/* Redirect root to /graphql */
app.get("/", (req, res) => {
  res.redirect("/graphql");
});

/* Start Server */
const PORT = process.env.PORT || 4000;
const server = app.listen(PORT, () => {
  console.log(`\n🚀 GraphQL Server running at http://localhost:${PORT}/graphql`);
  console.log(`   Open your browser to: http://localhost:${PORT}/graphql\n`);
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`\n❌ Error: Port ${PORT} is already in use.`);
  } else {
    throw err;
  }
});
