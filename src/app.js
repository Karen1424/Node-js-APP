const express = require("express");
const config = require("config");
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const bookRoutes = require("./routes/book.routes");
const authMiddleware = require("./middleware/auth.middleware");
const db = require("./database/db");
const { json } = require("express");
const {createClient} = require("redis");

const app = express();

// pares request on content-type-application/json
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({extended: true}));
// connect auth routes
app.use("/api/v1/auth",authRoutes);
// connect user routes
app.use("/api/v1/users",authMiddleware,userRoutes);
// connect book routes
app.use("/api/v1/fields", authMiddleware, bookRoutes);
// GET /api/v1/userToBook get book and Author name
app.get('/api/v1/userToBook', (req, res) => {
  
    let uId = [];
    let bId = [];
    let obj = {
        AuthorName:"",
        BookName:""
    };

    const userBookRelation = "SELECT * FROM user_book_relation";
    const book = "SELECT * from books WHERE id=?";
    const user = "SELECT * from users WHERE id=?"; 
    db.query(userBookRelation,  (err, rows, fields) => {
       
        for(let key in rows)
        {
            uId.push(rows[key].user_id);
            bId.push(rows[key].book_id);
        }

        db.query(book,bId[0],(err,rows,fields) => {
            obj.BookName = rows[0].title; 
            db.query(user,uId[0], (err,rows,fields) => {
                obj.AuthorName = rows[0].first_name;

                // redis create connection in default host 6379
                (async () => {
                    const clinet = createClient();
                    clinet.on("error",(err) => console.log("redis client error",err));
                    await clinet.connect();
                    await clinet.set((obj.AuthorName),(obj.BookName));
                })();

                res.status(200).send({ title: 'User book relation', userData: obj});
            });
            
        });
        
    });
});

// connect db
db.connect((error) => {
    if(error) {
        throw error;
    }
    console.log("Successfully connected to the database")
    //run server 
    const PORT = config.get("PORT") || 8080;
    app.listen(PORT,() => {
        console.log("App has been started on port: " + PORT)
    });
});
