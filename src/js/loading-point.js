export default class LoadingPoint {
    constructor({ selector, hidden = false }) {
       this.refs = this.getRefs(selector);
      hidden && this.hide();
    }
    getRefs(selector) {
        const refs = {};
    
        refs.loadingPoint = document.querySelector(selector);
        
        return refs;
      }
    show() {
      this.refs.loadingPoint.classList.remove('is-hidden');
    }
  
    hide() {
      this.refs.loadingPoint.classList.add('is-hidden');
    }
  }
  