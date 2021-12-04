const reporter = require('@wdio/allure-reporter').default;
const { email, password } = require('../../credentials');
const { Makeup } = require('../pages/Makeup');
const { expect } = require('chai');

describe('Testing login', function () {
    let page;
    let makeup = new Makeup();
    this.timeout(12000);
    before(async () => {
        page = await makeup.openMakeup('https://makeup.com.ua/');
    });
    it('Typed email', async function () {
        reporter.addStep('Testing login');
        reporter.addDescription('testing login to makeup');
        reporter.startStep('entering email and password');

        const loginPage = await makeup.loginPage(page);
        const login = await loginPage.login(email, password);
        reporter.endStep();

        await login.waitForTimeout(300);
        const cab = await login.evaluate(() => {
            return document.querySelector(
                'body > div.site-wrap > div.main-wrap > header > div.header-top > div > div:nth-child(3) > a'
            ).innerText;
        });
        reporter.startStep('check if logged in');

        console.log(cab);
        expect(cab === 'Кабинет');
        reporter.endStep();
    });
    this.afterAll(async () => {
        await makeup.endTest();
    });
});

describe('Testing Search', async function () {
    let page;
    let makeup = new Makeup();
    const searchString = 'makeup revolution';
    this.timeout(12000);
    before(async () => {
        page = await makeup.openMakeup('https://makeup.com.ua/');
    });
    it('Entering Search Keywords', async function () {
        reporter.addStep('Testing search');
        reporter.addDescription('Testing search on makeup.com');
        reporter.startStep('Entering keywords');

        const search = await makeup.search(page);
        const { searchByName } = search;
        const searchResults = await searchByName(searchString);
        await searchResults.waitForTimeout(300);
        const cab = await searchResults.evaluate(() => {
            return document.querySelector(
                'body > div.site-wrap > div.main-wrap > div > div > div.search-results.info-text'
            ).innerText;
        });
        console.log(cab);

        expect(cab.includes(searchString));
        reporter.endStep();
    });
    this.afterAll(async () => {
        await makeup.endTest();
    });
});

describe('Testing Adding To Cart', async function () {
    let page;
    let makeup = new Makeup();
    const searchString = 'makeup revolution';
    this.timeout(12000);
    before(async () => {
        page = await makeup.openMakeup('https://makeup.com.ua/');
    });
    it('Searching for a product and adding it to the cart', async function () {
        reporter.addStep('Testing adding to cart');
        reporter.addDescription('Testing adding searched item to cart');
        reporter.startStep('search keywords');

        const search = await makeup.search(page);
        const { searchByName } = search;
        const searchResults = await searchByName(searchString);
        const addCart = await makeup.addToCart(searchResults);

        const cab = await addCart.evaluate(() => {
            return document.querySelector(
                'body > div.popup.cart.ng-animate.ng-hide-animate > div > div.popup-content > div.page-header'
            ).innerHTML;
        });

        console.log(cab);
        expect(cab.includes('Корзина'));
        reporter.endStep();
    });
    this.afterAll(async () => {
        await makeup.endTest();
    });
});

describe('Testing Adding To Favourites', async function () {
    let page;
    let makeup = new Makeup();
    const searchString = 'makeup revolution';
    this.timeout(20000);
    before(async () => {
        page = await makeup.openMakeup('https://makeup.com.ua/');
    });
    it('Searching for a product and adding it to favourites', async function () {
        reporter.addStep('Testing adding to favourites');
        reporter.addDescription('testing adding searched item to favourites');
        reporter.startStep('entering keywords');
        const { login } = await makeup.loginPage(page);
        const loggedPage = await login(email, password);

        const search = await makeup.search(loggedPage);
        const { searchByName } = search;
        const searchResults = await searchByName(searchString);
        // await searchResults.waitForTimeout(300);
        const { addToFavourites } = await makeup.search(searchResults);
        const fav = await addToFavourites();

        const cab = await fav.evaluate(() => {
            return document.querySelector(
                '#popup__window > div.popup-content > div > div.confirm-wish-list-changes.specify-message-block'
            ).textContent;
        });

        console.log(cab);
        expect(cab.includes('получать'));
        reporter.endStep();
    });
    this.afterAll(async () => {
        await makeup.endTest();
    });
});
