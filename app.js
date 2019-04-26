/* One way data binding
 * - Proxy object for custom set behaviour
 * - render page on state update
 * - fetch data from API and update state
 */

const getElement = element => {
  return document.querySelector(element);
};

const thumbnail = getElement("img");
const email = getElement("#email");
const name = getElement("#name");
const city = getElement("#city");

// Add custom behavior to setting object prop
const createState = state => {
  return new Proxy(state, {
    set(target, prop, value) {
      target[prop] = value;
      render();
      return true;
    }
  });
};

// Initialize state
const state = createState({});

// Re-render DOM with new data based on bindings
const render = () => {
  const bindings = [...document.querySelectorAll("[data-binding]")].map(
    element => element.dataset.binding
  );
  bindings.forEach(binding => {
    if (binding === "thumbnail") {
      getElement("img").src = state[binding];
    } else {
      document.querySelector(`[data-binding='${binding}']`).textContent =
        state[binding];
    }
  });
};

// Fetch user from API and update state
const source = "https://randomuser.me/api/";

const getRandomUser = () => {
  fetch(source)
    .then(handleErrors)
    .then(parseJSON)
    .then(updateProfile)
    .catch(printError);
};

const handleErrors = res => {
  if (!res.ok) {
    throw Error(res.status);
  }
  return res;
};

const parseJSON = async res => {
  res = await res.json();
  const data = res.results[0];
  return data;
};

const updateProfile = data => {
  const { first, last } = data.name;
  const { city } = data.location;
  const { email } = data;
  const thumbnail = data.picture.medium;

  Object.assign(state, {
    name: `${first} ${last}`,
    thumbnail,
    email,
    city
  });
};

const printError = e => {
  console.log(`There was a problem: ${e}`);
};

// Bind data on button click
const button = getElement("button");
button.addEventListener("click", getRandomUser);

//Bind data on initial page load
window.addEventListener("load", getRandomUser);
