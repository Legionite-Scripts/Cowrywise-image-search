import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/home.vue"; // Import your Home component

// Define routes
const routes = [
  {
    path: "/",
    name: "Home",
    component: Home, // This will be your default page
  },
  // Other routes go here
];

// Create the router instance
const router = createRouter({
  history: createWebHistory(), // Use HTML5 history mode
  routes,
});

export default router;
