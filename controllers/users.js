const mysql = require("mysql");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { promisify } = require('util');

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
});

exports.register = (req, res) => {
    const { name, phone, password, confirm_password } = req.body;
    console.log(req.body);
    db.query(
        "select PHONE from user where PHONE=?",
        [phone],
        async (error, result) => {
            if (error) {
                console.log(error);
            }
            if (result.length > 0) {
                return res.render("register", { msg: "phone already taken" });
            } else if (password !== confirm_password) {
                return res.render("register", { msg: "password dosnt match" });
            }
            let hashedPassword = await bcrypt.hash(password, 8);
            db.query(
                "insert into user set ?",
                { NAME: name, PHONE: phone, PASS: hashedPassword },
                (error, result) => {
                    if (error) {
                        console.log(error);
                    } else {

                        return res.render("register", { msg: "user regitration success please go login" });

                    }
                }
            );
        }
    );
};

exports.login = async (req, res) => {
    try {
        const { phone, password } = req.body;

        if (phone.length <= 0 || password <= 0) {
            return res
                .status(400)
                .render("login", { msg: " please enter phone number and password" });
        }
        db.query('select * from user where phone=?', [phone],
            async (error, result) => {

                if (result.length <= 0) {
                    git
                    return res
                        .status(400)
                        .render("login", { msg: " please enter phone number and password" });
                } else {
                    if (!(await bcrypt.compare(password, result[0].PASS))) {
                        return res
                            .status(400)
                            .render("login", { msg: " please enter phone number and password" });
                    }
                    else {
                        const id = result[0].PHONE;
                        const token = jwt.sign({ id: id }, process.env.JWT_SECRET, {
                            expiresIn: process.env.JWT_EXPIRE_IN,
                        });

                        const cookieOptions = {
                            expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
                            httpOnly: true
                        };
                        res.cookie("sims", token, cookieOptions);
                        res.status(200).redirect("/")


                    }
                }


            }

        );

    } catch (error) {
        console.log(error);

    }
};

exports.isLoggedIn = async (req, res, next) => {
    // console.log(req.cookies)
    if (req.cookies.sims) {
        try {
            const decode = await promisify(jwt.verify)(
                req.cookies.sims,
                process.env.JWT_SECRET
            );
            // console.log(decode)
            db.query('select * from user where PHONE=?', [decode.id],
                (err, result) => {
                    // console.log(result)
                    if(!result){
                        return next()
                    }
                    req.user = result[0];
                    console.log(req.user)
                    return next()

                });
        } catch (error) {
            console.log(error);
            return next();
        }
    } else {

        next();
    }

}

exports.logout = async(req,res)=>{
    res.cookie("sims","logout",{
        expires: new Date(Date.now()+ 2*1000),
        httpOnly:true
    });
    res.redirect("/")
    
}