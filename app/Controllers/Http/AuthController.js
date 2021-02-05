"use strict";

const { validate } = use("Validator");
const Validator = use("Validator");
const User = use("App/Models/User");

class AuthController {
  async showLoginPage(context) {
    return context.view.render("login");
  }

  async showRegisterPage({ view }) {
    return view.render("register");
  }

  async login({ request, response, session, auth }) {

    const body = request.all();

    const rules = {
      email: "required|email",
      password: "required|min:5",
    };

    const messages = {
      "email.required": "Lütfen email adresini giriniz",
      "password.required": "Lütfen parolayı giriniz",
      "email.email": "Lütfen geçerli bir email adresi giriniz",
    };

    const validation = await validate(body, rules, messages);

    if (validation.fails()) {
      session.withErrors(validation.messages()).flashAll();
      return response.redirect("back");
    }

    await auth.attempt(body.email, body.password);
    session.flash({ notification: "Başarıyla giriş yaptınız" });
    return response.redirect("/");
    
  }

  async register({ request, response, session }) {
    const body = request.all();
    // console.log(body.confirmPassword);

    const comparePassword = async (data) => {
      let message = "Parolalar uyuşmuyor, lütfen kontrol ediniz."
      if (data.password !== data.confirmPassword) throw message;
    };

    Validator.extend("compare", comparePassword);

    const rules = {
      email: "required|email|unique:users",
      username: "required|unique:users",
      password: "required|min:5|compare",
    };

    const messages = {
      "email.required": "Lütfen mail adresi giriniz",
      "username.required": "Lütfen kullanıcı adı giriniz",
      "password.required": "Lütfen parola giriniz",
      "email.unique": "Bu mail adresi zaten mevcut",
      "email.email": "Lütfen geçerli bir email adresi giriniz",
      "username.unique": "Bu kullanıcı adı zaten kullanımda",
      "password.min": "Parola en az 5 karakter olmalıdır",
      "password.compare": "Parolalar uyuşmuyor, lütfen kontrol ediniz.",
    };

    const validation = await validate(body, rules, messages);

    if (validation.fails()) {
      session.withErrors(validation.messages()).flashAll();
      return response.redirect("back");
    }

    const newUser = await new User();
    newUser.username = body.username;
    newUser.email = body.email;
    newUser.password = body.password;
    await newUser.save();
    await auth.attempt(newUser.email, body.password);
    session.flash({ notification: "Başarıyla kayıt olundu ve giriş yapıldı" });
    return response.redirect("/");
  }

  async logout({ auth, response, session }) {
    auth.logout();
    session.flash({ notification: "Başarıyla çıkış yaptınız" });
    response.redirect("/");
  }
}

module.exports = AuthController;
