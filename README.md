# GraphQL Restaurant Data Exercise

Full Stack Development - Coding Assignment 4.1

## Overview
A Node.js and Express application demonstrating a GraphQL API for managing restaurant data. Built with `express-graphql` and `graphql`, providing an interactive GraphiQL playground.

## Features
- **Queries:**
  - `restaurant(id)`: Fetch a single restaurant by ID.
  - `restaurants`: Fetch all restaurants.
- **Mutations:**
  - `setrestaurant(input)`: Add a new restaurant.
  - `Deleterestaurant(id)`: Delete a restaurant by ID.
  - `editrestaurant(id, input)`: Update restaurant details.

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Server
```bash
npm start
```

### 3. Open GraphiQL
Open your browser and navigate to:
```
http://localhost:4000/graphql
```
