const sidebarHTML = document.querySelector("[data-sidebar]");
const openCartHTML = document.querySelector("[data-open-cart]");
const closeCartHTML = document.querySelector("[data-close-cart]");
const cartItemsHTML = sidebarHTML.querySelector("[data-cart-items]");
const cartTotalsHTML = sidebarHTML.querySelector("[data-cart-totals]");

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

for (const item of imageGalleryThumbnailsHTML) {
  item.addEventListener("click", (e) => {
    const { imageSource, imageDesc, imageAlt } = e.target.dataset;

    imageGallerySpotlightImageHTML.src = imageSource;
    imageGallerySpotlightDescHTML.textContent = imageDesc;
    imageGallerySpotlightImageHTML.alt = imageAlt;
  });
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

for (const album of albumGalleryThumbnailsHTML) {
  album.addEventListener("click", (e) => {
    const { albumTitle, albumSource, albumTracks, albumYear, albumPrice } =
      e.target.dataset;

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
  });
}

let cart = [];
const addAlbumToCartHTML = document.querySelector("[data-add-album-to-cart]");
addAlbumToCartHTML.addEventListener("click", () => {
  const title = albumGallerySpotlightTitleHTML.textContent;

  const existingIndex = cart.findIndex((r) => r.title === title);
  if (existingIndex > -1) {
    cart[existingIndex].count += 1;
  } else {
    const album = {
      title: title,
      cover: albumGallerySpotlightImageHTML.src,
      year: albumGallerySpotlightYearHTML.textContent,
      price: Number(albumGallerySpotlightPriceHTML.textContent),
      count: 1,
    };
    cart.push(album);
  }

  reDrawCart();
});

const reDrawCart = () => {
  cartItemsHTML.innerHTML = "";
  cartTotalsHTML.innerHTML = "";

  if (cart.length === 0) return;

  /* CART ITEMS */

  for (const [key, item] of cart.entries()) {
    const articleHTML = document.createElement("article");
    const itemHTML = document.createElement("div");
    itemHTML.classList.add("item");
    const deleteItemHTML = document.createElement("button");
    deleteItemHTML.textContent = "X";

    deleteItemHTML.addEventListener("click", () => {
      cart.splice(key, 1);
      reDrawCart();
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
      if (item.count <= 1) {
        cart.splice(key, 1);
        reDrawCart();
        return;
      }
      cart[key].count -= 1;
      reDrawCart();
    });

    const currentCountHTML = document.createElement("span");
    currentCountHTML.textContent = item.count;
    const increaseCountHTML = document.createElement("button");
    increaseCountHTML.textContent = "+";

    increaseCountHTML.addEventListener("click", () => {
      cart[key].count += 1;
      reDrawCart();
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

    cartItemsHTML.append(articleHTML);
  }

  const clearCartHTML = document.createElement("button");
  clearCartHTML.textContent = "Rensa varukorg";
  clearCartHTML.addEventListener("click", () => {
    cart = [];
    reDrawCart();
  });
  cartItemsHTML.append(clearCartHTML);

  /* TOTALS */

  const numberOfAlbums = cart.reduce((pre, cur) => pre + cur.count, 0);

  const albumCountHTML = document.createElement("p");
  albumCountHTML.textContent = `Antal album: ${numberOfAlbums} st`;

  const preDiscount = cart.reduce((pre, cur) => pre + cur.price * cur.count, 0);
  const totalsPreDiscountHTML = document.createElement("p");
  totalsPreDiscountHTML.textContent = `Summa före rabatt: ${preDiscount} kr`;

  const discountDecimal = numberOfAlbums >= 3 ? 0.1 : 0;
  const discount = Math.floor(preDiscount * discountDecimal);

  const totalDiscountHTML = document.createElement("p");
  totalDiscountHTML.textContent =
    discountDecimal > 0 ? `Rabatt (10 %): ${discount} kr` : "";

  const totalPostDiscountHTML = document.createElement("p");
  const totalsToPay = preDiscount - discount;

  totalPostDiscountHTML.textContent = `Totalt att betala: ${totalsToPay} kr`;

  cartTotalsHTML.append(albumCountHTML);
  cartTotalsHTML.append(totalsPreDiscountHTML);
  cartTotalsHTML.append(totalDiscountHTML);
  cartTotalsHTML.append(totalPostDiscountHTML);
};
