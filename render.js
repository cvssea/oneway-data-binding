// Re-render DOM with new data based on bindings
const render = (state) => {
  const bindings = [...document.querySelectorAll("[data-binding]")].map(
    element => element.dataset.binding
  );
  bindings.forEach(binding => {
    if (binding === "thumbnail") {
      document.querySelector("img").src = state[binding];
    } else {
      document.querySelector(`[data-binding='${binding}']`).textContent =
        state[binding];
    }
  });
};

export default render;