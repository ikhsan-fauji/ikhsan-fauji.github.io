const process = {
  startProcess: () => {
    const process = document.getElementById('data-process');
    const notFound = document.getElementById('data-not-found');
    if (process && notFound) {
      process.style.display = 'block';
      notFound.style.display = 'none';
    }
  },
  finishProcess: () => {
    const process = document.getElementById('data-process');
    const notFound = document.getElementById('data-not-found');
    if (process && notFound) {
      process.style.display = 'none';
      notFound.style.display = 'block';
    }
  }
}

export default process;