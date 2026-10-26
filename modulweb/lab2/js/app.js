const sidebarHTML = document.querySelector("[data-sidebar]");
const openCartHTML = document.querySelector("[data-open-cart]");
const closeCartHTML = document.querySelector("[data-close-cart]");
const cartItemsHTML = sidebarHTML.querySelector("[data-cart-items]");
const cartFooterHTML = sidebarHTML.querySelector("[data-cart-footer]");

openCartHTML.addEventListener("click", () => {
  sidebarHTML.classList.add("open");
});

closeCartHTML.addEventListener("click", () => {
  sidebarHTML.classList.remove("open");
});

const imageGalleryHTML = document.querySelector("[data-image-gallery]");
const imageGalleryThumbnailsHTML = imageGalleryHTML.querySelectorAll(
  "[data-image-thumbnail]",
);

const imageGallerySpotlightHTML =
  imageGalleryHTML.querySelector("[data-spotlight]");
const imageGallerySpotlightImageHTML = imageGallerySpotlightHTML.querySelector(
  "[data-spotlight-image]",
);
const imageGallerySpotlightDescHTML = imageGallerySpotlightHTML.querySelector(
  "[data-spotlight-desc]",
);

const clearActiveChilNodes = (container) => {
  const activeChils = container.querySelectorAll(".active");
  for (const child of activeChils) {
    child.classList.remove("active");
  }
};

const setActiveNode = (container, node) => {
  clearActiveChilNodes(container);
  node.classList.add("active");
};

const handleImageClick = (e) => {
  setImageInSpotlight(e.target.dataset);
  setActiveNode(imageGalleryHTML, e.target);
};

const setImageInSpotlight = (dataset) => {
  const { imageSource, imageDesc, imageAlt } = dataset;
  imageGallerySpotlightImageHTML.src = imageSource;
  imageGallerySpotlightDescHTML.textContent = imageDesc;
  imageGallerySpotlightImageHTML.alt = imageAlt;
};

for (const [key, item] of imageGalleryThumbnailsHTML.entries()) {
  item.addEventListener("click", handleImageClick);

  if (key === 0) {
    setImageInSpotlight(item.dataset);
  }
}

const albumGalleryHTML = document.querySelector("[data-album-gallery]");
const albumGalleryThumbnailsHTML = document.querySelectorAll(
  "[data-album-thumbnail]",
);

const albumGallerySpotlightHTML =
  albumGalleryHTML.querySelector("[data-spotlight]");

const albumGallerySpotlightImageHTML = albumGallerySpotlightHTML.querySelector(
  "[data-spotlight-image]",
);
const albumGallerySpotlightTracksHTML = albumGallerySpotlightHTML.querySelector(
  "[data-spotlight-tracks]",
);
const albumGallerySpotlightTitleHTML = albumGallerySpotlightHTML.querySelector(
  "[data-spotlight-title]",
);
const albumGallerySpotlightYearHTML = albumGallerySpotlightHTML.querySelector(
  "[data-spotlight-year]",
);
const albumGallerySpotlightPriceHTML = albumGallerySpotlightHTML.querySelector(
  "[data-spotlight-price]",
);

const handleAlbumClick = (e) => {
  setAlbumInSpotlight(e.target.dataset);
  setActiveNode(albumGalleryHTML, e.target);
};

let activeAlbum = {};
const setAlbumInSpotlight = (dataset) => {
  const { albumTitle, albumSource, albumTracks, albumYear, albumPrice } =
    dataset;
  activeAlbum = dataset;

  albumGallerySpotlightImageHTML.src = albumSource;
  albumGallerySpotlightImageHTML.alt = albumTitle;
  albumGallerySpotlightTitleHTML.textContent = albumTitle;
  albumGallerySpotlightYearHTML.textContent = albumYear;
  albumGallerySpotlightPriceHTML.textContent = albumPrice;

  const tracksList = albumTracks.split(",");

  albumGallerySpotlightTracksHTML.innerHTML = "";
  for (const track of tracksList) {
    const listTrackElementHTML = document.createElement("li");
    listTrackElementHTML.textContent = track.trim();

    albumGallerySpotlightTracksHTML.append(listTrackElementHTML);
  }
};

for (const [key, item] of albumGalleryThumbnailsHTML.entries()) {
  item.addEventListener("click", handleAlbumClick);

  if (key === 0) {
    setAlbumInSpotlight(item.dataset);
  }
}

let cart = [];
const addAlbumToCartHTML = document.querySelector("[data-add-album-to-cart]");
addAlbumToCartHTML.addEventListener("click", () => {
  const { albumTitle, albumPrice, albumSource, albumYear } = activeAlbum;

  const existingIndex = cart.findIndex((r) => r.title === albumTitle);
  if (existingIndex > -1) {
    cart[existingIndex].count += 1;
  } else {
    const album = {
      title: albumTitle,
      cover: albumSource,
      year: albumYear,
      price: albumPrice,
      count: 1,
    };
    cart.push(album);
  }

  reDrawCart();
});

const reDrawCart = () => {
  cartItemsHTML.innerHTML = "";
  cartFooterHTML.innerHTML = "";

  if (cart.length === 0) return;

  /* CART ITEMS */

  for (const [key, item] of cart.entries()) {
    const itemHTML = getCartItemHTML(key, item);
    cartItemsHTML.append(itemHTML);
  }

  const clearCartHTML = document.createElement("button");
  clearCartHTML.textContent = "Rensa varukorg";
  clearCartHTML.addEventListener("click", () => {
    cart = [];
    reDrawCart();
  });
  cartItemsHTML.append(clearCartHTML);

  /* FOOTER */

  const sums = calculateCartSums(cart);
  const sumsHTML = getCartSumsHTML(sums);
  cartFooterHTML.append(sumsHTML);

  const continueCheckoutHTML = document.createElement("button");
  continueCheckoutHTML.disabled = true;
  continueCheckoutHTML.textContent = "Fortsätt med beställning";
  cartFooterHTML.append(continueCheckoutHTML);
};

const getCartItemHTML = (pos, item) => {
  const articleHTML = document.createElement("article");
  articleHTML.id = pos;

  const itemHTML = document.createElement("div");
  itemHTML.classList.add("item");

  const deleteItemHTML = document.createElement("button");
  deleteItemHTML.textContent = "X";

  deleteItemHTML.addEventListener("click", () => {
    changeItemCount(pos, "delete");
  });

  const albumCoverHTML = document.createElement("img");
  albumCoverHTML.src = item.cover;

  const infoHTML = document.createElement("div");
  infoHTML.classList.add("info");

  const titleHTML = document.createElement("h3");
  titleHTML.textContent = item.title;

  const yearHTML = document.createElement("p");
  yearHTML.textContent = item.year;

  const priceHTML = document.createElement("p");
  priceHTML.textContent =
    item.count > 1
      ? `${item.price * item.count} kr (${item.price} kr/st)`
      : `${item.price} kr`;

  const countHTML = document.createElement("div");
  countHTML.classList.add("count");

  const decreaseCountHTML = document.createElement("button");
  decreaseCountHTML.textContent = "-";

  decreaseCountHTML.addEventListener("click", () => {
    changeItemCount(pos, "decreaase");
  });

  const currentCountHTML = document.createElement("span");
  currentCountHTML.textContent = item.count;

  const increaseCountHTML = document.createElement("button");
  increaseCountHTML.textContent = "+";

  increaseCountHTML.addEventListener("click", () => {
    changeItemCount(pos, "increase");
  });

  infoHTML.append(titleHTML);
  infoHTML.append(yearHTML);
  infoHTML.append(priceHTML);

  countHTML.append(decreaseCountHTML);
  countHTML.append(currentCountHTML);
  countHTML.append(increaseCountHTML);

  itemHTML.append(deleteItemHTML);
  itemHTML.append(albumCoverHTML);
  itemHTML.append(infoHTML);

  articleHTML.append(itemHTML);
  articleHTML.append(countHTML);

  return articleHTML;
};

const calculateCartSums = (cart) => {
  const numberOfAlbums = cart.reduce((pre, cur) => pre + cur.count, 0);
  const preDiscount = cart.reduce((pre, cur) => pre + cur.price * cur.count, 0);
  const discountDecimal = numberOfAlbums >= 3 ? 0.1 : 0;
  const discount = Math.floor(preDiscount * discountDecimal);
  const totalsToPay = preDiscount - discount;
  return { numberOfAlbums, preDiscount, discount, totalsToPay };
};

const getCartSumsHTML = (sums) => {
  const sumsHTML = document.createElement("div");
  const albumCountHTML = document.createElement("p");
  albumCountHTML.textContent = `Antal album: ${sums.numberOfAlbums} st`;

  const totalsPreDiscountHTML = document.createElement("p");
  totalsPreDiscountHTML.textContent = `Summa före rabatt: ${sums.preDiscount} kr`;

  const totalDiscountHTML = document.createElement("p");
  totalDiscountHTML.textContent =
    sums.discount > 0 ? `Rabatt (10 %): ${sums.discount} kr` : "";

  const totalPostDiscountHTML = document.createElement("p");

  totalPostDiscountHTML.textContent = `Totalt att betala: ${sums.totalsToPay} kr`;

  sumsHTML.append(albumCountHTML);
  sumsHTML.append(totalsPreDiscountHTML);
  sumsHTML.append(totalDiscountHTML);
  sumsHTML.append(totalPostDiscountHTML);
  return sumsHTML;
};

const changeItemCount = (index, action) => {
  switch (action) {
    case "increase":
      cart[index].count += 1;
      break;
    case "decreaase":
      if (cart[index].count <= 1) {
        deleteItemFromCart(index);
        break;
      }
      cart[index].count -= 1;
      break;
    case "delete":
      deleteItemFromCart(index);
      break;
  }

  reDrawCart();
};

const deleteItemFromCart = (pos) => {
  cart.splice(pos, 1);
};
