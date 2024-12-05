const db = require("./config/database");

(async () => {
  try {
    console.log("Testing database connection...");
    const [rows] = await db.query("SELECT 1 + 1 AS result");
    console.log("Database connection successful. Test result:", rows);
  } catch (err) {
    console.error("Error testing database connection:", err.message);
  }
})();
