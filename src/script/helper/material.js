import M from 'materialize-css';

const material = {
  initializeSideNav: () => {
    const elems = document.querySelectorAll('.sidenav');
    M.Sidenav.init(elems);
  },
  closeSideNav: () => {
    const sidenav = document.querySelector(".sidenav");
    M.Sidenav.getInstance(sidenav).close();
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
    <div class="preloader-wrapper big active">
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
  }
}

export default material;