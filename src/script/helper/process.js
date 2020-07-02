import material from "./material";

const process = {
  startProcess: () => {
    const process = document.querySelectorAll('#data-process');
    const notFound = document.querySelectorAll('#data-not-found');
    if (process && notFound) {
      process.forEach(el => {
        el.style.display = 'block';
        el.innerHTML = material.preLoader();
      });
      notFound.forEach(el => {
        el.style.display = 'none';
      });
    }
  },
  finishProcess: () => {
    const process = document.querySelectorAll('#data-process');
    const notFound = document.querySelectorAll('#data-not-found');
    if (process && notFound) {
      process.forEach(el => {
        el.style.display = 'none';
      });
      notFound.forEach(el => {
        el.style.display = 'block';
      });
    }
  }
}

export default process;