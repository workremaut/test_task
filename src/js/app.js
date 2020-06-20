//Polyfill (promise)
// import 'core-js/features/promise';

class App {
    constructor() {
        this._body = document.querySelector('body');
        this._linkTabs = document.querySelectorAll('.tabs__control a');
        this._itemTabs = document.querySelectorAll('.tabs__content-item');
        this._mobileNav = document.querySelector('.mobile-nav');
        this._mobileNavContainer = document.querySelector('.mobile-nav .mobile-nav__content');
        this._burger = document.querySelector('.burger');
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

    _cloneMobile() {
        let _nav = document.querySelector('.nav-top').cloneNode(true,true);
        let _user = document.querySelector('.user').cloneNode(true,true);
        this._mobileNavContainer.appendChild(_user);
        this._mobileNavContainer.appendChild(_nav);
    }

    _navMobile() {
        this._cloneMobile();
        this._burger.addEventListener('click', (e) => {
            let target = e.currentTarget;
            if (target.classList.contains('active')) {
                target.classList.remove('active');
                this._mobileNav.classList.remove('active');
                this._body.classList.remove('overflow-hidden');
            } else {
                target.classList.add('active');
                this._mobileNav.classList.add('active');
                this._body.classList.add('overflow-hidden');
            }
        });
    }

    apply() {
        this._tabs();
        this._navMobile();
    }
}

new App().apply();