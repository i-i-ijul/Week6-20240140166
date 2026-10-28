    /**
 * Uji coba fetch 10 produk dari dummyjson, hasilnya dicetak ke console.
 * @returns {Promise<void>}
 */
async function testFetchAPI() {
  const testUrl = "https://dummyjson.com/products?limit=10";
  try {
    const response = await fetch(testUrl);
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }
    const data = await response.json();
    console.log("Test fetch successful:", data);
  } catch (error) {
    console.error("Test fetch error:", error);
  }
}

testFetchAPI();