module.exports.renderSignupForm =  (req, res) => {
    res.render("./users/signup.ejs");
}

module.exports.signup = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);

        req.login(registeredUser, ((err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "welcome to wanderlust!");
            res.redirect("/list");
        }))

        console.log(registeredUser)
    }
    catch (e) {
        req.flash('error', e.message);
        res.redirect("/signup");
    }
}

module.exports.renderLogin = (req, res) => {
    res.render("users/login.ejs")
}

module.exports.login = async (req, res) => {
    req.flash('success', "Welcome to Wanderlust Page")
   let redirectUrl = res.locals.redirectUrl || "/list";
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res) => {
    req.logout((err) => {
        if (err) {
            next(err);
        }
        req.flash("success", "you are logged out now");
        res.redirect("/list");
    })
}