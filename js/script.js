 const categoriesEl = document.getElementById("categories");
  const plantsEl = document.getElementById("plants");
  const spinner = document.getElementById("spinner");
  const cartList = document.getElementById("cartList");
  const cartTotalEl = document.getElementById("cartTotal");
  const modal = document.getElementById("modal");

  let cart = [];
  let total = 0;

 // Fetch categories
async function loadCategories() {
  const res = await fetch("https://openapi.programming-hero.com/api/categories");
  const data = await res.json();
  categoriesEl.innerHTML = "";
  data.categories.forEach(cat => {
    const li = document.createElement("li");
    li.className = "cursor-pointer px-3 py-2 rounded-lg hover:bg-green-200 hover:text-green-700 transition";
    li.textContent = cat.category_name;
    li.onclick = () => loadPlants(cat.id, li);
    categoriesEl.appendChild(li);
  });

  // After loading categories → load ALL plants
  loadAllPlants(data.categories);
}


  // Fetch all plants from all categories
  async function loadAllPlants(categories) {
    spinner.classList.remove("hidden");
    plantsEl.innerHTML = "";

    for (let cat of categories) {
      const res = await fetch(`https://openapi.programming-hero.com/api/category/${cat.id}`);
      const data = await res.json();

      data.plants.forEach(p => {
        const card = document.createElement("div");
        card.className = "bg-white rounded-xl shadow-md p-4 text-center hover:shadow-lg transition";
        card.innerHTML = `
          <img src="${p.image}" class="h-32 w-full object-cover rounded-lg">
          <h4 onclick="showModal(${p.id})" class="font-semibold mt-4 cursor-pointer text-green-700 underline">${p.name}</h4>
          <p class="text-sm text-gray-500">${p.description.slice(0,60)}...</p>
          <p class="font-bold mt-2">৳${p.price}</p>
          <button onclick="addToCart('${p.name}', ${p.price})" 
                  class="mt-3 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 hover:scale-105 transition">
            Add to Cart
          </button>
        `;
        plantsEl.appendChild(card);
      });
    }

    spinner.classList.add("hidden");
  }

  // Single category plants (optional if you still want category filter)
  async function loadPlants(catId = 1, el = null) {
    spinner.classList.remove("hidden");
    plantsEl.innerHTML = "";
    const res = await fetch(`https://openapi.programming-hero.com/api/category/${catId}`);
    const data = await res.json();
    spinner.classList.add("hidden");

    if (el) {
      [...categoriesEl.children].forEach(c => c.classList.remove("text-green-700", "font-bold"));
      el.classList.add("text-green-700", "font-bold");
    }

    data.plants.forEach(p => {
      const card = document.createElement("div");
      card.className = "bg-white rounded-xl shadow-md p-4 text-center hover:shadow-lg transition";
      card.innerHTML = `
        <img src="${p.image}" class="h-32 w-full object-cover rounded-lg">
        <h4 onclick="showModal(${p.id})" class="font-semibold mt-4 cursor-pointer text-green-700 underline">${p.name}</h4>
        <p class="text-sm text-gray-500">${p.description.slice(0,60)}...</p>
        <p class="font-bold mt-2">৳${p.price}</p>
        <button onclick="addToCart('${p.name}', ${p.price})" 
                class="mt-3 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 hover:scale-105 transition">
          Add to Cart
        </button>
      `;
      plantsEl.appendChild(card);
    });
  }

  // Modal
  async function showModal(id) {
    const res = await fetch(`https://openapi.programming-hero.com/api/plant/${id}`);
    const data = await res.json();
    const p = data.plants;
    document.getElementById("modalImg").src = p.image;
    document.getElementById("modalTitle").textContent = p.name;
    document.getElementById("modalDesc").textContent = p.description;
    document.getElementById("modalCat").textContent = "Category: " + p.category;
    document.getElementById("modalPrice").textContent = "৳" + p.price;
    modal.classList.remove("hidden");
    modal.classList.add("flex");
  }
  function closeModal() {
    modal.classList.add("hidden");
  }

  // Cart
  function addToCart(name, price) {
    cart.push({ name, price });
    total += price;
    renderCart();
  }
  function removeFromCart(index) {
    total -= cart[index].price;
    cart.splice(index, 1);
    renderCart();
  }
  function renderCart() {
    cartList.innerHTML = "";
    cart.forEach((item, i) => {
      cartList.innerHTML += `<li class="flex justify-between">${item.name} <span>৳${item.price}</span> <button onclick="removeFromCart(${i})" class="text-red-500 ml-2 hover:text-red-700">❌</button></li>`;
    });
    cartTotalEl.textContent = "৳" + total;
  }

  // Init
  loadCategories();