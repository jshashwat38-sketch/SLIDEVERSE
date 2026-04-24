
import { getCategories } from "./src/actions/adminActions";

async function checkCategories() {
  const categories = await getCategories();
  console.log(JSON.stringify(categories, null, 2));
}

checkCategories();
