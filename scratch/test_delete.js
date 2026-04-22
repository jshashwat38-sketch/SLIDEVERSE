import { registerUser, getUsers, deleteUser } from "./src/actions/authActions.js";

async function testDelete() {
  console.log("Registering dummy user...");
  const res = await registerUser({
    name: "Test User",
    email: "test@example.com",
    phone: "1234567890",
    password: "password123"
  });
  
  if (!res.success) {
    console.error("Failed to register:", res.error);
    return;
  }
  
  const userId = res.user.id;
  console.log("User registered with ID:", userId);
  
  const usersBefore = await getUsers();
  console.log("Users count before delete:", usersBefore.length);
  
  console.log("Deleting user...");
  const delRes = await deleteUser(userId);
  
  if (!delRes.success) {
    console.error("Failed to delete:", delRes.error);
    return;
  }
  
  const usersAfter = await getUsers();
  console.log("Users count after delete:", usersAfter.length);
  
  if (usersBefore.length - 1 === usersAfter.length) {
    console.log("SUCCESS: User deleted correctly.");
  } else {
    console.log("FAILURE: User count did not decrease as expected.");
  }
}

testDelete();
