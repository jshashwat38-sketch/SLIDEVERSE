import { addProduct } from "./src/actions/productActions";

async function test() {
  const formData = new FormData();
  formData.append("title", "Test Product");
  formData.append("description", "Test Description");
  formData.append("price", "100");
  formData.append("features", "Feature 1, Feature 2");
  formData.append("driveLink", "https://google.com");
  formData.append("categoryId", "cat-1");
  
  const res = await addProduct(formData);
  console.log(res);
}

test();
