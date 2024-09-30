import React, { useEffect, useState } from "react";

const EcommercePage = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [cart, setCart] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // State for search input

  // Fetch data from API
  useEffect(() => {
    fetch(
      "https://cdn.shopify.com/s/files/1/0564/3685/0790/files/multiProduct.json"
    )
      .then((response) => response.json())
      .then((data) => setCategories(data.categories))
      .catch((error) => console.error("Error fetching data: ", error));
  }, []);

  // Handle category filtering
  const handleCategoryClick = (categoryName) => {
    setSelectedCategory(categoryName);
  };

  // Handle adding product to cart
  const handleAddToCart = (product) => {
    const existingProduct = cart.find((item) => item.id === product.id);
    if (existingProduct) {
      const updatedCart = cart.map((item) =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      setCart(updatedCart);
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  // Handle removing product from cart
  const handleRemoveFromCart = (product) => {
    const updatedCart = cart.filter((item) => item.id !== product.id);
    setCart(updatedCart);
  };

  // Handle increasing quantity
  const increaseQuantity = (product) => {
    const updatedCart = cart.map((item) =>
      item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
    );
    setCart(updatedCart);
  };

  // Handle decreasing quantity
  const decreaseQuantity = (product) => {
    const updatedCart = cart.map((item) =>
      item.id === product.id && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    );
    setCart(updatedCart);
  };

  // Calculate total price
  const getTotalPrice = () => {
    return cart.reduce((total, product) => {
      return total + product.price * product.quantity;
    }, 0);
  };

  // Handle search
  const handleSearch = () => {
    const formattedQuery = searchQuery.toLowerCase();
    const categoriesMap = {
      men: "Men",
      women: "Women",
      kids: "Kids",
    };

    if (categoriesMap[formattedQuery]) {
      setSelectedCategory(categoriesMap[formattedQuery]);
    } else {
      setSelectedCategory("All");
    }
  };

  return (
    <div style={styles.pageContainer}>
      {/* Navigation Bar */}
      <nav style={styles.navbar}>
        <ul style={styles.navList}>
          <li style={styles.navItem}>Home</li>
          <li style={styles.navItem}>Products</li>
          <li style={styles.navItem}>About</li>
          <li style={styles.navItem}>
            Cart ({cart.length}) - ₹{getTotalPrice()}
          </li>
        </ul>
        <div style={styles.authButtons}>
          <button style={styles.authButton}>Login</button>
          <button style={styles.authButton}>Signup</button>
        </div>
      </nav>

      <header style={styles.header}>
        <h1>Shopping Product</h1>
        <div>
          <input
            type="text"
            placeholder="Search for products"
            style={styles.searchBar}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button onClick={handleSearch} style={styles.searchButton}>
            Search
          </button>
        </div>
        <h2>Categories</h2>
        <div style={styles.buttons}>
          <button
            onClick={() => handleCategoryClick("All")}
            style={styles.button}
          >
            All
          </button>
          <button
            onClick={() => handleCategoryClick("Men")}
            style={styles.button}
          >
            Men
          </button>
          <button
            onClick={() => handleCategoryClick("Women")}
            style={styles.button}
          >
            Women
          </button>
          <button
            onClick={() => handleCategoryClick("Kids")}
            style={styles.button}
          >
            Kids
          </button>
        </div>
      </header>

      <main style={styles.productContainer}>
        {categories.map((category) => {
          if (
            selectedCategory === "All" ||
            category.category_name === selectedCategory
          ) {
            return (
              <div key={category.category_name}>
                <h3>{category.category_name}</h3>
                <div style={styles.productGrid}>
                  {category.category_products.map((product) => (
                    <div key={product.id} style={styles.productCard}>
                      <img
                        src={product.image}
                        alt={product.title}
                        style={styles.productImage}
                      />
                      <h4>{product.title}</h4>
                      <p>Price: ₹{product.price}</p>
                      <p>Compare at: ₹{product.compare_at_price}</p>
                      <p>Vendor: {product.vendor}</p>
                      {/* Add to Cart Button */}
                      <button
                        onClick={() => handleAddToCart(product)}
                        style={styles.cartButton}
                      >
                        Add to Cart
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          }
          return null;
        })}

        {/* Cart Section */}
        <section style={styles.cartSection}>
          <h2>Your Cart</h2>
          {cart.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <ul style={styles.cartList}>
              {cart.map((product) => (
                <li key={product.id} style={styles.cartItem}>
                  <span>{product.title}</span>
                  <div style={styles.cartButtons}>
                    <button onClick={() => decreaseQuantity(product)}>-</button>
                    <span>{product.quantity}</span>
                    <button onClick={() => increaseQuantity(product)}>+</button>
                    <button
                      onClick={() => handleRemoveFromCart(product)}
                      style={styles.removeButton}
                    >
                      Remove
                    </button>
                  </div>
                  <span>₹{product.price * product.quantity}</span>
                </li>
              ))}
            </ul>
          )}
          <h3>Total: ₹{getTotalPrice()}</h3>
        </section>
      </main>

      <footer style={styles.footer}>
        <p>ALL COPYRIGHT © RESERVED 2024 SHOPPING CART</p>
      </footer>
    </div>
  );
};

// Styles for the page with background addition
const styles = {
  pageContainer: {
    backgroundImage: "url('https://via.placeholder.com/1500x1000')",
    backgroundSize: "cover",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  navbar: {
    backgroundColor: "goldenrod",
    color: "black",
    padding: "5px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  navList: {
    display: "flex",
    listStyleType: "none",
    gap: "20px",
  },
  navItem: {
    cursor: "pointer",
    fontWeight: "bold",
  },
  authButtons: {
    display: "flex",
    gap: "10px",
  },
  authButton: {
    backgroundColor: "black",
    color: "white",
    padding: "8px 16px",
    border: "none",
    cursor: "pointer",
    borderRadius: "4px",
  },
  header: {
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    color: "white",
    padding: "20px",
    textAlign: "center",
  },
  searchBar: {
    padding: "8px",
    marginBottom: "6px",
    borderRadius: "5px",
    width: "70%",
  },
  searchButton: {
    backgroundColor: "black",
    color: "white",
    padding: "8px 16px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    marginLeft: "10px",
  },
  buttons: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
  },
  button: {
    backgroundColor: "green",
    color: "white",
    padding: "8px 18px",
    borderRadius: "6px",
    cursor: "pointer",
  },
  productContainer: {
    padding: "20px",
  },
  productGrid: {
    display: "flex",
    justifyContent: "space-around",
    gap: "20px",
    marginBottom: "40px",
  },
  productCard: {
    border: "1px solid #ddd",
    padding: "20px",
    textAlign: "center",
    backgroundColor: "white",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
  },
  productImage: {
    width: "150px",
    height: "150px",
    objectFit: "cover",
    marginBottom: "10px",
  },
  cartSection: {
    margin: "20px 0",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    padding: "20px",
    borderRadius: "8px",
  },

  cartButton: {
    backgroundColor: "orange",
    color: "white",
    padding: "8px",
    marginTop: "8px",
    borderRadius: "6px",
    cursor: "pointer",
  },

  cartList: {
    listStyleType: "none",
    padding: "0",
  },
  cartItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
  },
  cartButtons: {
    display: "flex",
    gap: "10px",
  },
  removeButton: {
    backgroundColor: "red",
    color: "white",
    padding: "5px",
    cursor: "pointer",
  },
  footer: {
    backgroundColor: "black",
    color: "white",
    textAlign: "center",
    padding: "20px 0",
  },
};

export default EcommercePage;