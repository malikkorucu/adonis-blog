"use strict";

const { post } = require("@adonisjs/framework/src/Route/Manager");

const Blog = use("App/Models/Blog");
const Database = use("Database");
const { validate } = use("Validator");

class BlogController {
  async showAddPostPage(context) {
    return context.view.render("new_post");
  }

  async getPostList({ view }) {
    const postList = await Blog.all();

    const viewData = {
      blogList: postList.toJSON(),
    };

    return view.render("blogs", viewData);
  }

  async getBlogDetail({ view, params }) {
    // const blog = Blog.find(params.id)
    const blog = await Database.from("blogs").where({ id: params.id });
    return view.render("blog_detail", { blog: blog[0] });
  }

  async save({ request, params, session, auth, response }) {
    // console.log(auth.user.username);
    const body = request.all();
    const rules = {
      title: "required",
      description: "required",
      text: "required",
    };

    const messages = {
      "title.required": "Lütfen başlık giriniz",
      "description.required": "Lütfen blog özetini giriniz",
      "text.required": "Lütfen blog yazısını giriniz",
    };

    const validation = await validate(body, rules, messages);

    if (validation.fails()) {
      session.withErrors(validation.messages()).flashAll();
      return response.redirect("back");
    }

    const blog = new Blog();

    blog.title = body.title;
    blog.description = body.description;
    blog.text = body.text;

    await blog.save();
    session.flash({ notification: "Blog başarıyla oluşturuldu..." });
    response.redirect("/Blogs");
  }

  async getUpdateForm({ view, request, params, response }) {
    // const blog = await Blog.find(params.id);
    const blog = await Database.from("blogs").where({ id: params.id });
    const blogList = await Database.from("blogs");

    return view.render("blogs", { blog:blog[0], blogList });
  }

  async updateBlog({ request, params, session ,response}){
    const body = request.all();

    const validation = await validate(body , {
      title:'required',
      description:'required',
      text:'required'
    })

    if (validation.fails()) {
      session.withErrors(validation.messages()).flashAll();
      return response.redirect("back");
    }

    const blog = await Blog.find(params.id)

    blog.title = body.title
    blog.description = body.description
    blog.text = body.text

    await blog.save()
    response.redirect('/Blogs')
    session.flash({notification:'Blog başarıyla güncellendi...'})
  
  }

  async deleteBlog({response, params , session}){
    // await Database.from("blogs").where({id:params.id}).delete()
    const blog = await Blog.find(params.id)
    await blog.delete()

    session.flash({notification:'Blog başarıyla silindi !!'})
    response.redirect('/Blogs')
  }
}

module.exports = BlogController;
