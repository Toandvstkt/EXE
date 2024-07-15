const mongoose = require("mongoose");
try {
  mongoose.connect("mongodb+srv://thehoang1722:hoang12345@cluster.vfvwbe3.mongodb.net/Shop", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });
  console.log("Database Connected Successfully");
} catch (err) {
  console.log("Database Not Connected");
}
