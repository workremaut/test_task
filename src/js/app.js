//Polyfill (promise)
// import 'core-js/features/promise';

class App {
    constructor() {
        this._linkTabs = document.querySelectorAll('.tabs__control a');
        this._itemTabs = document.querySelectorAll('.tabs__content-item');
    }

    _tabs() {
        for(let [i, item] of this._linkTabs.entries()) {
            item.addEventListener('click', (e) => {
                e.preventDefault();

                let target = e.target;
                let id_item = target.getAttribute('href');
                
                this._tabsRemoveClass(this._linkTabs);
                this._tabsRemoveClass(this._itemTabs);
                target.classList.add('active');

                document.querySelector(id_item).classList.add('active');
            });
        }
    }

    _tabsRemoveClass(el) {
        for(let i = 0; i < el.length; i++) {
            el[i].classList.remove('active');
        }
    }

    apply() {
        this._tabs()
    }
}

new App().apply();