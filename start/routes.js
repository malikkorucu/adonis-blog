"use strict";

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use("Route");

Route.on("/").render("home");

Route.get("/login", "AuthController.showLoginPage");
Route.get("/register", "AuthController.showRegisterPage");
Route.post("/register", "AuthController.register");
Route.post("/login", "AuthController.login");
Route.get("/logout", "AuthController.logout");
Route.get("/newPost", "BlogController.showAddPostPage");
Route.get("Blogs", "BlogController.getPostList");
Route.get("Blogs/:id", "BlogController.getBlogDetail");
Route.get("Blogs/Update/:id", "BlogController.getUpdateForm");
Route.put("Blogs/Update/:id", "BlogController.updateBlog");
Route.delete("Blogs/Delete/:id", "BlogController.deleteBlog");
Route.post("Blog/Save", "BlogController.save");
Route.post("login", "AuthController.login");
// Route.get("users/:id", "UserController.show")
