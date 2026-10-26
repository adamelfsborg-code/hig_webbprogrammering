const MIN_ITEMS_FOR_DISCOUNT = 3;
const DEFAULT_ACTIVE_IMAGE = 1;
const DEFAULT_ACTIVE_ALBUM = 2;

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

const clearActiveChildNodes = (container) => {
  const activeChilds = container.querySelectorAll(".active");
  for (const child of activeChilds) {
    child.classList.remove("active");
  }
};

const setActiveNode = (container, node) => {
  clearActiveChildNodes(container);
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

for (const [index, item] of imageGalleryThumbnailsHTML.entries()) {
  item.addEventListener("click", handleImageClick);

  if (index === DEFAULT_ACTIVE_IMAGE) {
    setImageInSpotlight(item.dataset);
    setActiveNode(imageGalleryHTML, item);
  }
}

const albumGalleryHTML = document.querySelector("[data-album-gallery]");
const albumGalleryThumbnailsHTML = albumGalleryHTML.querySelectorAll(
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

for (const [index, item] of albumGalleryThumbnailsHTML.entries()) {
  item.addEventListener("click", handleAlbumClick);

  if (index === DEFAULT_ACTIVE_ALBUM) {
    setAlbumInSpotlight(item.dataset);
    setActiveNode(albumGalleryHTML, item);
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
      price: Number(albumPrice),
      count: 1,
    };
    cart.push(album);
  }

  reDrawCart();
});

const reDrawCart = () => {
  cartItemsHTML.innerHTML = "";
  cartFooterHTML.innerHTML = "";

  const sums = calculateCartSums(cart);
  openCartHTML.setAttribute("data-albums-in-cart", sums.numberOfAlbums);

  if (cart.length === 0) return;

  /* CART ITEMS */

  for (const [index, item] of cart.entries()) {
    const itemHTML = getCartItemHTML(index, item);
    cartItemsHTML.append(itemHTML);
  }

  const clearCartHTML = getButton("Rensa Varukorg", () => {
    cart = [];
    reDrawCart();
  });
  cartItemsHTML.append(clearCartHTML);

  /* FOOTER */

  const sumsHTML = getCartSumsHTML(sums);
  cartFooterHTML.append(sumsHTML);

  const continueCheckoutHTML = getButton("Fortsätt med beställning", () => {});
  continueCheckoutHTML.disabled = true;
  cartFooterHTML.append(continueCheckoutHTML);
};

const getCartItemHTML = (index, item) => {
  const articleHTML = document.createElement("article");
  articleHTML.id = index;

  const itemHTML = getDiv(["item"]);
  const deleteItemHTML = getButtonWithIcon(
    "Minska antal",
    ["fa-solid", "fa-xmark"],
    () => setItemCount(index, 0),
  );
  const albumCoverHTML = document.createElement("img");
  albumCoverHTML.src = item.cover;
  albumCoverHTML.alt = item.title;

  const infoHTML = getDiv(["info"]);
  const titleHTML = getText("h3", item.title);
  const yearHTML = getParagraph(item.year);
  const priceHTML = getParagraph(
    item.count > 1
      ? `${item.price * item.count} kr (${item.price} kr/st)`
      : `${item.price} kr`,
  );

  const countHTML = getDiv(["count"]);
  const decreaseCountHTML = getButtonWithIcon(
    "Minska antal",
    ["fa-solid", "fa-circle-minus"],
    () => setItemCount(index, item.count - 1),
  );
  const currentCountHTML = getText("span", item.count);
  const increaseCountHTML = getButtonWithIcon(
    "Öka antal",
    ["fa-solid", "fa-circle-plus"],
    () => setItemCount(index, item.count + 1),
  );

  infoHTML.append(titleHTML, yearHTML, priceHTML);
  countHTML.append(decreaseCountHTML, currentCountHTML, increaseCountHTML);
  itemHTML.append(deleteItemHTML, albumCoverHTML, infoHTML);
  articleHTML.append(itemHTML, countHTML);

  return articleHTML;
};

const calculateCartSums = (cart) => {
  const numberOfAlbums = cart.reduce((pre, cur) => pre + cur.count, 0);
  const preDiscount = cart.reduce((pre, cur) => pre + cur.price * cur.count, 0);
  const discountDecimal = numberOfAlbums >= MIN_ITEMS_FOR_DISCOUNT ? 0.1 : 0;
  const discount = Math.round(preDiscount * discountDecimal);
  const totalsToPay = preDiscount - discount;
  return { numberOfAlbums, preDiscount, discount, totalsToPay };
};

const getCartSumsHTML = (sums) => {
  const sumsHTML = document.createElement("div");

  const albumCountHTML = getParagraph(`Antal album: ${sums.numberOfAlbums} st`);
  const totalsPreDiscountHTML = getParagraph(
    sums.discount > 0 ? `Summa före rabatt: ${sums.preDiscount} kr` : "",
  );
  const totalDiscountHTML = getParagraph(
    sums.discount > 0 ? `Rabatt (10 %): ${sums.discount} kr` : "",
  );
  const totalPostDiscountHTML = getParagraph(
    `Totalt att betala: ${sums.totalsToPay} kr`,
  );

  sumsHTML.append(
    albumCountHTML,
    totalsPreDiscountHTML,
    totalDiscountHTML,
    totalPostDiscountHTML,
  );
  return sumsHTML;
};

const setItemCount = (index, count) => {
  cart[index].count = count;
  if (cart[index].count === 0) {
    cart.splice(index, 1);
  }
  reDrawCart();
};

const getParagraph = (label) => {
  return getText("p", label);
};

const getText = (element, label) => {
  if (!["h1", "h2", "h3", "h4", "h5", "h6", "p", "span"].includes(element))
    return;
  const el = document.createElement(element);
  el.textContent = label;
  return el;
};

const getDiv = (cls) => {
  const div = document.createElement("div");
  div.classList.add(...cls);
  return div;
};

const getButton = (label, cb) => {
  const buttonHTML = document.createElement("button");
  buttonHTML.textContent = label;
  buttonHTML.ariaLabel = label;
  buttonHTML.addEventListener("click", cb);
  return buttonHTML;
};

const getButtonWithIcon = (label, cls, cb) => {
  const buttonHTML = getButton(label, cb);
  buttonHTML.textContent = "";
  const iconHTML = document.createElement("i");
  iconHTML.classList.add(...cls);
  iconHTML.ariaHidden = true;
  buttonHTML.append(iconHTML);
  return buttonHTML;
};
