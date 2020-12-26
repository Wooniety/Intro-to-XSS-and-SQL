const app = require("./controllers/app");
const https = require("https");
const { keys } = require("mysql2/lib/constants/charset_encodings");

app.listen(3000, () => {
    console.log(`Hosted at http://localhost:3000`);
});


//dk if u wan or not
// https.createServer({
//     cert: "./certs/cert.pem",
//     key:"./certs/key.pem"
// },app).listen(3000, () => {
//     console.log(`Hosted at http://localhost:3000`);
// });