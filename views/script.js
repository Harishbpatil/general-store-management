let ul = document.querySelector(".display ul");

window.addEventListener("load", renderElements);

document
  .querySelector(".addItem form")
  .addEventListener("submit", handleSubmit);

ul.addEventListener("click", handleClick);

function createLi(data, id) {
  let li = document.createElement("li");
  li.setAttribute("data-id", id); // Add this line to set data-id attribute

  const text = document.createElement("div");
  text.textContent = `Item name: ${data["item"]} Description: ${data["description"]} Price: ${data["price"]} Quantity: ${data["quantity"]}`;

  let span = document.createElement("span");
  span.textContent = `${data["quantity"]}`;
  li.appendChild(text);
  li.appendChild(span);

  const buttons = document.createElement("div");

  const buy1 = document.createElement("button");
  buy1.classList.add("buy1");
  buy1.textContent = "Buy1";
  buy1.id = id;

  const buy2 = document.createElement("button");
  buy2.classList.add("buy2");
  buy2.textContent = "Buy2";
  buy2.id = id;

  const buy3 = document.createElement("button");
  buy3.classList.add("buy3");
  buy3.textContent = "Buy3";
  buy3.id = id;

  buttons.appendChild(buy1);
  buttons.appendChild(buy2);
  buttons.appendChild(buy3);
  li.appendChild(buttons);

  return li;
}

async function handleSubmit(e) {
  try {
    e.preventDefault();

    const itemName = e.target["item-name"].value.trim();
    const itemDesc = e.target["item-description"].value.trim();
    const itemPrice = e.target["item-price"].value;
    const itemQty = e.target["item-qty"].value;

    if (
      itemName.trim().length === 0 ||
      itemDesc.trim().length === 0 ||
      Number(itemPrice) <= 0 ||
      Number(itemQty) <= 0
    ) {
      alert("Wrong input");
    } else {
      const data = {
        item: itemName,
        description: itemDesc,
        price: itemPrice,
        quantity: itemQty,
      };

      console.log("Request data:", data);

      let res = await fetch("http://localhost:3000/generalstore", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        let id = (await res.json()).id;
        let li = createLi(data, id);
        ul.appendChild(li);

        e.target["item-name"].value = "";
        e.target["item-description"].value = "";
        e.target["item-price"].value = "";
        e.target["item-qty"].value = "";
      } else {
        console.error(`Failed to add item: ${res.statusText}`);
        console.error(await res.text()); // Log the response body for more details
      }
    }
  } catch (e) {
    console.log(e);
  }
}

async function renderElements() {
  try {
    // Fetch data directly from MySQL database
    let res = await fetch("http://localhost:3000/generalstore");
    if (res.ok) {
      let data = await res.json();
      ul.innerHTML = ""; // Clear existing list
      data.forEach((item) => {
        let id = item.id;
        let li = createLi(item, id);
        ul.appendChild(li);
      });
    } else {
      console.error(`Failed to fetch items: ${res.statusText}`);
      console.error(await res.text()); // Log the response body for more details
    }
  } catch (e) {
    console.log(e);
  }
}

async function handleClick(e) {
  try {
    const itemId = e.target.id;
    const action = e.target.classList[0]; // Assumes classes like "buy1," "buy2," etc.

    let res = await fetch(`http://localhost:3000/generalstore/${itemId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ action }),
    });

    if (res.ok) {
      let updatedItem = await res.json();
      // Update the displayed quantity in the UI
      let li = ul.querySelector(`[data-id="${itemId}"]`);
      let span = li.querySelector("span");
      span.textContent = updatedItem.quantity;
    } else {
      console.error(`Failed to update item quantity: ${res.statusText}`);
      console.error(await res.text());
    }
  } catch (e) {
    console.log(e);
  }
}
