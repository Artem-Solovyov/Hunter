// ibg image
function ibg() {
  let ibg = document.querySelectorAll("._ibg");
  for (var i = 0; i < ibg.length; i++) {
    if (ibg[i].querySelector("img")) {
      ibg[i].style.backgroundImage = "url(" + ibg[i].querySelector("img").getAttribute("src") + ")";
    }
  }
}
ibg();
// Menu burger
let bodyUnlock = (delay = 500) => {
  let body = document.querySelector("body");
  if (bodyLockStatus) {
    let lock_padding = document.querySelectorAll("[data-lp]");
    setTimeout(() => {
      for (let index = 0; index < lock_padding.length; index++) {
        const el = lock_padding[index];
        el.style.paddingRight = "0px";
      }
      body.style.paddingRight = "0px";
      document.documentElement.classList.remove("lock");
    }, delay);
    bodyLockStatus = false;
    setTimeout(function () {
      bodyLockStatus = true;
    }, delay);
  }
};
let bodyLock = (delay = 500) => {
  let body = document.querySelector("body");
  if (bodyLockStatus) {
    let lock_padding = document.querySelectorAll("[data-lp]");
    for (let index = 0; index < lock_padding.length; index++) {
      const el = lock_padding[index];
      el.style.paddingRight = window.innerWidth - document.querySelector(".wrapper").offsetWidth + "px";
    }
    body.style.paddingRight = window.innerWidth - document.querySelector(".wrapper").offsetWidth + "px";
    document.documentElement.classList.add("lock");

    bodyLockStatus = false;
    setTimeout(function () {
      bodyLockStatus = true;
    }, delay);
  }
};
let bodyLockStatus = true;
let bodyLockToggle = (delay = 500) => {
  if (document.documentElement.classList.contains("lock")) {
    bodyUnlock(delay);
  } else {
    bodyLock(delay);
  }
};
function menuInit() {
  if (document.querySelector(".icon-menu")) {
    document.addEventListener("click", function (e) {
      if (bodyLockStatus && e.target.closest(".icon-menu")) {
        bodyLockToggle();
        document.documentElement.classList.toggle("menu-open");
      }
    });
  }
}
menuInit();

// Spollers

let _slideToggle = (target, duration = 500) => {
  if (target.hidden) {
    return _slideDown(target, duration);
  } else {
    return _slideUp(target, duration);
  }
};
let _slideDown = (target, duration = 500, showmore = 0) => {
  if (!target.classList.contains("_slide")) {
    target.classList.add("_slide");
    target.hidden = target.hidden ? false : null;
    showmore ? target.style.removeProperty("height") : null;
    let height = target.offsetHeight;
    target.style.overflow = "hidden";
    target.style.height = showmore ? `${showmore}px` : `0px`;
    target.style.paddingTop = 0;
    target.style.paddingBottom = 0;
    target.style.marginTop = 0;
    target.style.marginBottom = 0;
    target.offsetHeight;
    target.style.transitionProperty = "height, margin, padding";
    target.style.transitionDuration = duration + "ms";
    target.style.height = height + "px";
    target.style.removeProperty("padding-top");
    target.style.removeProperty("padding-bottom");
    target.style.removeProperty("margin-top");
    target.style.removeProperty("margin-bottom");
    window.setTimeout(() => {
      target.style.removeProperty("height");
      target.style.removeProperty("overflow");
      target.style.removeProperty("transition-duration");
      target.style.removeProperty("transition-property");
      target.classList.remove("_slide");
      // Создаем событие
      document.dispatchEvent(
        new CustomEvent("slideDownDone", {
          detail: {
            target: target,
          },
        })
      );
    }, duration);
  }
};
let _slideUp = (target, duration = 500, showmore = 0) => {
  if (!target.classList.contains("_slide")) {
    target.classList.add("_slide");
    target.style.transitionProperty = "height, margin, padding";
    target.style.transitionDuration = duration + "ms";
    target.style.height = `${target.offsetHeight}px`;
    target.offsetHeight;
    target.style.overflow = "hidden";
    target.style.height = showmore ? `${showmore}px` : `0px`;
    target.style.paddingTop = 0;
    target.style.paddingBottom = 0;
    target.style.marginTop = 0;
    target.style.marginBottom = 0;
    window.setTimeout(() => {
      target.hidden = !showmore ? true : false;
      !showmore ? target.style.removeProperty("height") : null;
      target.style.removeProperty("padding-top");
      target.style.removeProperty("padding-bottom");
      target.style.removeProperty("margin-top");
      target.style.removeProperty("margin-bottom");
      !showmore ? target.style.removeProperty("overflow") : null;
      target.style.removeProperty("transition-duration");
      target.style.removeProperty("transition-property");
      target.classList.remove("_slide");
      // Создаем событие
      document.dispatchEvent(
        new CustomEvent("slideUpDone", {
          detail: {
            target: target,
          },
        })
      );
    }, duration);
  }
};
const spollersArray = document.querySelectorAll("[data-spollers]");
if (spollersArray.length > 0) {
  // Получение обычных спойлеров
  const spollersRegular = Array.from(spollersArray).filter(function (item, index, self) {
    return !item.dataset.spollers.split(",")[0];
  });
  // Инициализация обычных спойлеров
  if (spollersRegular.length) {
    initSpollers(spollersRegular);
  }
  // Получение слойлеров с медиа запросами
  let mdQueriesArray = dataMediaQueries(spollersArray, "spollers");
  if (mdQueriesArray && mdQueriesArray.length) {
    mdQueriesArray.forEach((mdQueriesItem) => {
      // Событие
      mdQueriesItem.matchMedia.addEventListener("change", function () {
        initSpollers(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
      });
      initSpollers(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
    });
  }
  // Инициализация
  function initSpollers(spollersArray, matchMedia = false) {
    spollersArray.forEach((spollersBlock) => {
      spollersBlock = matchMedia ? spollersBlock.item : spollersBlock;
      if (matchMedia.matches || !matchMedia) {
        spollersBlock.classList.add("_spoller-init");
        initSpollerBody(spollersBlock);
        spollersBlock.addEventListener("click", setSpollerAction);
      } else {
        spollersBlock.classList.remove("_spoller-init");
        initSpollerBody(spollersBlock, false);
        spollersBlock.removeEventListener("click", setSpollerAction);
      }
    });
  }
  // Работа с контентом
  function initSpollerBody(spollersBlock, hideSpollerBody = true) {
    let spollerTitles = spollersBlock.querySelectorAll("[data-spoller]");
    if (spollerTitles.length) {
      spollerTitles = Array.from(spollerTitles).filter((item) => item.closest("[data-spollers]") === spollersBlock);
      spollerTitles.forEach((spollerTitle) => {
        if (hideSpollerBody) {
          spollerTitle.removeAttribute("tabindex");
          if (!spollerTitle.classList.contains("_spoller-active")) {
            spollerTitle.nextElementSibling.hidden = true;
          }
        } else {
          spollerTitle.setAttribute("tabindex", "-1");
          spollerTitle.nextElementSibling.hidden = false;
        }
      });
    }
  }
  function setSpollerAction(e) {
    const el = e.target;
    if (el.closest("[data-spoller]")) {
      const spollerTitle = el.closest("[data-spoller]");
      const spollersBlock = spollerTitle.closest("[data-spollers]");
      const oneSpoller = spollersBlock.hasAttribute("data-one-spoller");
      const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;
      if (!spollersBlock.querySelectorAll("._slide").length) {
        if (oneSpoller && !spollerTitle.classList.contains("_spoller-active")) {
          hideSpollersBody(spollersBlock);
        }
        spollerTitle.classList.toggle("_spoller-active");
        _slideToggle(spollerTitle.nextElementSibling, spollerSpeed);
      }
      e.preventDefault();
    }
  }
  function hideSpollersBody(spollersBlock) {
    const spollerActiveTitle = spollersBlock.querySelector("[data-spoller]._spoller-active");
    const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;
    if (spollerActiveTitle && !spollersBlock.querySelectorAll("._slide").length) {
      spollerActiveTitle.classList.remove("_spoller-active");
      _slideUp(spollerActiveTitle.nextElementSibling, spollerSpeed);
    }
  }
  // Закрытие при клике вне спойлера
  const spollersClose = document.querySelectorAll("[data-spoller-close]");
  if (spollersClose.length) {
    document.addEventListener("click", function (e) {
      const el = e.target;
      if (!el.closest("[data-spollers]")) {
        spollersClose.forEach((spollerClose) => {
          const spollersBlock = spollerClose.closest("[data-spollers]");
          const spollerSpeed = spollersBlock.dataset.spollersSpeed
            ? parseInt(spollersBlock.dataset.spollersSpeed)
            : 500;
          spollerClose.classList.remove("_spoller-active");
          _slideUp(spollerClose.nextElementSibling, spollerSpeed);
        });
      }
    });
  }
}
// Обработа медиа запросов из атрибутов
function dataMediaQueries(array, dataSetValue) {
  // Получение объектов с медиа запросами
  const media = Array.from(array).filter(function (item, index, self) {
    if (item.dataset[dataSetValue]) {
      return item.dataset[dataSetValue].split(",")[0];
    }
  });
  // Инициализация объектов с медиа запросами
  if (media.length) {
    const breakpointsArray = [];
    media.forEach((item) => {
      const params = item.dataset[dataSetValue];
      const breakpoint = {};
      const paramsArray = params.split(",");
      breakpoint.value = paramsArray[0];
      breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : "max";
      breakpoint.item = item;
      breakpointsArray.push(breakpoint);
    });
    // Получаем уникальные брейкпоинты
    let mdQueries = breakpointsArray.map(function (item) {
      return "(" + item.type + "-width: " + item.value + "px)," + item.value + "," + item.type;
    });
    mdQueries = uniqArray(mdQueries);
    const mdQueriesArray = [];

    if (mdQueries.length) {
      // Работаем с каждым брейкпоинтом
      mdQueries.forEach((breakpoint) => {
        const paramsArray = breakpoint.split(",");
        const mediaBreakpoint = paramsArray[1];
        const mediaType = paramsArray[2];
        const matchMedia = window.matchMedia(paramsArray[0]);
        // Объекты с нужными условиями
        const itemsArray = breakpointsArray.filter(function (item) {
          if (item.value === mediaBreakpoint && item.type === mediaType) {
            return true;
          }
        });
        mdQueriesArray.push({
          itemsArray,
          matchMedia,
        });
      });
      return mdQueriesArray;
    }
  }
}

// Swiper
new Swiper(".info-hero", {
  speed: 800,
  autoplay: {
    delay: 2000,
    pauseOnMouseEnter: true,
  },
  spaceBetween: 16,
  slidesPerView: "auto",
});

const thumbSlider = new Swiper(".thumbs__swiper", {
  // freeMode: true,
  spaceBetween: 12,

  slidesPerView: "auto",
  breakpoints: {
    320: {
      slidesPerView: 4,
    },
    1199: {
      slidesPerView: "auto",
    },
  },
});

new Swiper(".slider-sell__swiper ", {
  slideToClickedSlide: true,
  autoHeight: false,
  autoplay: {
    delay: 5000,
    pauseOnMouseEnter: true,
  },
  loop: true,
  thumbs: {
    swiper: thumbSlider,
  },
});

const swiper = () => {
  new Swiper(".recommendation__swiper", {
    speed: 800,
    spaceBetween: 40,
    slidesPerView: "auto",
    watchOverflow: false,
    observer: true,
    observeParents: true,
    observeSlideChildren: true,
    simulateTouch: true,
    // Navigation arrows
    navigation: {
      nextEl: ".button-recommendation__arrow--next",
      prevEl: ".button-recommendation__arrow--prev",
    },
  });
};
swiper();
// Filter
const list = document.querySelector(".nav-recommendation__list");
const items = document.querySelectorAll(".filter");
const listItems = document.querySelectorAll(".nav-recommendation__item");
const title = document.querySelector(".recommendation__title");

function filter() {
  list.addEventListener("click", (e) => {
    const targetId = e.target.dataset.id;
    const target = e.target;

    if (target.classList.contains("nav-recommendation__item")) {
      listItems.forEach((listItem) => listItem.classList.remove("active"));
      target.classList.add("active");
    }
    switch (targetId) {
      case "house":
        getItems(targetId);
        swiper();
        title.innerHTML = "Featured House";
        break;
      case "villa":
        getItems(targetId);
        swiper();
        title.innerHTML = "Featured Villa";
        break;
      case "apartment":
        getItems(targetId);
        swiper();
        title.innerHTML = "Featured Apartment";
        break;
    }
  });
}
filter();
getItems("house");
function getItems(className) {
  items.forEach((item) => {
    if (item.classList.contains(className)) {
      item.style.display = "block";
    } else {
      item.style.display = "none";
    }
  });
}

// popup
const popupLinks = document.querySelectorAll("[data-popup]");
const body = document.querySelector("body");
const lockPadding = document.querySelectorAll(".lock-padding");

let unlock = true;
const timeout = 800;

if (popupLinks.length > 0) {
  popupLinks.forEach((popupLink) => {
    popupLink.addEventListener("click", function (e) {
      const popupName = popupLink.getAttribute("data-popup").replace("#", "");
      const curentPopup = document.getElementById(popupName);
      popupOpen(curentPopup);
      e.preventDefault();
    });
  });
}

const popupCloseIcon = document.querySelectorAll(".close-popup");
if (popupCloseIcon.length > 0) {
  popupCloseIcon.forEach((el) => {
    el.addEventListener("click", function (e) {
      popupClose(el.closest(".popup"));
      e.preventDefault();
    });
  });
}

function popupOpen(curentPopup) {
  if (curentPopup && unlock) {
    const popupActive = document.querySelector(".popup.open");
    if (popupActive) {
      popupClose(popupActive, false);
    } else {
      bodyLock01();
    }
    curentPopup.classList.add("open");
    curentPopup.addEventListener("click", function (e) {
      if (!e.target.closest(".popup__content")) {
        popupClose(e.target.closest(".popup"));
      }
    });
  }
}
function bodyLock01() {
  const lockPaddingValue = window.innerWidth - document.querySelector(".wrapper").offsetWidth + "px";
  if (lockPadding.length > 0) {
    lockPadding.forEach((el) => {
      el.style.paddingRight = lockPaddingValue;
    });
  }
  body.style.paddingRight = lockPaddingValue;
  body.classList.add("lock");
  unlock = false;
  setTimeout(function () {
    unlock = true;
  }, timeout);
}
function popupClose(popupActive, doUnlock = true) {
  if (unlock) {
    popupActive.classList.remove("open");
    if (doUnlock) {
      bodyUnLock();
    }
  }
}
function bodyUnLock() {
  setTimeout(function () {
    if (lockPadding.length > 0) {
      lockPadding.forEach((el) => {
        el.style.paddingRight = "0px";
      });
    }
    body.style.paddingRight = "0px";
    body.classList.remove("lock");
  }, timeout);
  unlock = false;
  setTimeout(function () {
    unlock = true;
  }, timeout);
}
document.addEventListener("keydown", function (e) {
  if (e.which === 27) {
    const popupActive = document.querySelector(".popup.open");
    popupClose(popupActive);
  }
});
