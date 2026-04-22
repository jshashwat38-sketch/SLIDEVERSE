const fs = require('fs').promises;
const path = require('path');

const USERS_PATH = path.join(process.cwd(), "src", "data", "users.json");

async function test() {
    try {
        console.log("Reading users from:", USERS_PATH);
        const data = await fs.readFile(USERS_PATH, "utf8");
        const users = JSON.parse(data);
        console.log("Current users count:", users.length);
        
        if (users.length === 0) {
            console.log("No users to delete. Adding a dummy user first.");
            users.push({ id: "test-id", name: "Test" });
            await fs.writeFile(USERS_PATH, JSON.stringify(users, null, 2));
        }
        
        const idToDelete = users[0].id;
        console.log("Attempting to delete user with ID:", idToDelete);
        
        const filtered = users.filter(u => u.id !== idToDelete);
        await fs.writeFile(USERS_PATH, JSON.stringify(filtered, null, 2));
        
        const newData = await fs.readFile(USERS_PATH, "utf8");
        const newUsers = JSON.parse(newData);
        console.log("New users count:", newUsers.length);
        
        if (newUsers.length < users.length) {
            console.log("Deletion successful.");
        } else {
            console.log("Deletion failed - count remains same.");
        }
    } catch (err) {
        console.error("Error during test:", err);
    }
}

test();
