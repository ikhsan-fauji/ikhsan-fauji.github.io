import M from 'materialize-css';

const material = {
  initializeSideNav: (callback) => {
    const elems = document.querySelectorAll('.sidenav');
    M.Sidenav.init(elems);

    let page = '';
    const links = document.querySelectorAll(".sidenav a, .topnav a");
    links.forEach(function (elm) {
      elm.addEventListener("click", function(event) {
        const sidenav = document.querySelector(".sidenav");
        M.Sidenav.getInstance(sidenav).close();

        page = event.target.getAttribute("href").substr(1);
        callback(page)
      });
    });
  },
  initializeTabs: () => {
    const element = document.querySelector('.tabs')
    M.Tabs.init(element)
  },
  initializeTooltip: () => {
    const elems = document.querySelectorAll('.tooltipped');
    M.Tooltip.init(elems);
  },
  toast: (message) => {
    M.toast({html: message});
  },
  preLoader: () => {
    return `
    <div id="pre-loader" class="preloader-wrapper big active">
      <div class="spinner-layer spinner-blue-only">
        <div class="circle-clipper left">
          <div class="circle"></div>
        </div><div class="gap-patch">
          <div class="circle"></div>
        </div><div class="circle-clipper right">
          <div class="circle"></div>
        </div>
      </div>
    </div>
    `;
  },
  closePreLoader () {
    const preLoaders = document.querySelectorAll('#pre-loader');
    preLoaders.forEach(loader => {
      loader.style.display = 'none'
    })
  }
}

export default material;