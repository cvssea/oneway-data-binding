/* One way data binding
 * - Proxy object for custom set behaviour
 * - render page on state update
 * - fetch data from API and update state
 */

import render from './render.js';

// Add custom behavior to setting object prop
const createState = (state) => {
  return new Proxy(state, {
    set(target, prop, value) {
      target[prop] = value;
      render(state);
      return true;
    }
  });
};

// Initialize state
const state = createState({});

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
const button = document.querySelector("button");
button.addEventListener("click", getRandomUser);

//Bind data on initial page load
window.addEventListener("load", getRandomUser);
