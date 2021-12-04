const puppeteer = require('puppeteer');

class Makeup {
    async openMakeup(url) {
        this.browser = await puppeteer.launch({
            headless: false,
        });
        const page = await this.browser.newPage();

        await page.setViewport({ width: 1440, height: 900 });
        await page.goto(url);
        return page;
    }

    async loginPage(makeupPage) {
        async function login(email, password) {
            await makeupPage.waitForSelector(
                'body > div.site-wrap > div.main-wrap > header > div.header-top > div > div:nth-child(3) > div'
            );
            await makeupPage.click(
                'body > div.site-wrap > div.main-wrap > header > div.header-top > div > div:nth-child(3) > div'
            );
            await makeupPage.waitForTimeout(300);
            await makeupPage.waitForSelector(
                '#form-auth > div > div.form-inner-wrap > div:nth-child(2) > div > input'
            );
            await makeupPage.type(
                '#form-auth > div > div.form-inner-wrap > div:nth-child(2) > div > input',
                email,
                { delay: 200 }
            );
            await makeupPage.waitForSelector(
                '#form-auth > div > div.form-inner-wrap > div:nth-child(3) > div > input'
            );
            await makeupPage.type(
                '#form-auth > div > div.form-inner-wrap > div:nth-child(3) > div > input',
                password,
                { delay: 200 }
            );
            await makeupPage.click(
                '#form-auth > div > div.form-inner-wrap > div:nth-child(4) > button'
            );
            await makeupPage.waitForTimeout(1000);
            return makeupPage;
        }

        async function mainPageLoggedIn(email, password) {
            const loginP = login(email, password);
            // return await this.mainPage(loginP);
        }

        return {
            login: login,

            mainPageLoggedIn: mainPageLoggedIn,
        };
    }
    async mainPage(makeupPage) {
        await makeupPage.click(
            'body > div.site-wrap > div.main-wrap > header > div.header-middle > div > a'
        );

        return makeupPage;
    }
    async addToCart(makeupPage) {
        await makeupPage.waitForSelector(
            'body > div.site-wrap > div.main-wrap > div > div > div.catalog > div.catalog-content > div > div.catalog-products > ul > li:nth-child(1) > div.simple-slider-list__link'
        );

        await makeupPage.click(
            'body > div.site-wrap > div.main-wrap > div > div > div.catalog > div.catalog-content > div > div.catalog-products > ul > li:nth-child(1) > div.simple-slider-list__link'
        );

        await console.log('wait for buy button');

        await makeupPage.waitForSelector(
            'body > div.site-wrap > div.main-wrap > div > div > div:nth-child(2) > div.product-item > div > div.product-item__buy > div.product-item__button > div'
        );
        await console.log('click at buy button');

        await makeupPage.click(
            'body > div.site-wrap > div.main-wrap > div > div > div:nth-child(2) > div.product-item > div > div.product-item__buy > div.product-item__button > div'
        );
        await console.log('wait for popup');

        await makeupPage.waitForSelector(
            'body > div.popup.cart.ng-animate.ng-hide-animate'
        );
        return makeupPage;
    }

    async search(makeupPage) {
        async function searchByName(name) {
            await makeupPage.click('#search-input');
            await makeupPage.type('#search-input', name);
            await makeupPage.keyboard.press('Enter');
            await makeupPage.waitForSelector(
                'body > div.site-wrap > div.main-wrap > div > div > div.search-results.info-text'
            );

            return makeupPage;
        }
        async function orderByPrice() {
            await makeupPage.waitForSelector('#filter-sort');

            await makeupPage.waitForSelector('#col-content');
            await makeupPage.click('#filter-sort');
            await makeupPage.click('#sort-3');
            return makeupPage;
        }
        async function addToFavourites() {
            await makeupPage.waitForTimeout(1000);

            await makeupPage.waitForSelector(
                'body > div.site-wrap > div.main-wrap > div > div > div.catalog > div.catalog-content > div > div.catalog-products > ul > li:nth-child(1) > div.simple-slider-list__link'
            );
            await makeupPage.click(
                'body > div.site-wrap > div.main-wrap > div > div > div.catalog > div.catalog-content > div > div.catalog-products > ul > li:nth-child(1) > div.simple-slider-list__link'
            );
            await makeupPage.waitForSelector(
                'body > div.site-wrap > div.main-wrap > div > div > div:nth-child(2) > div.product-item > div > div.product-item__buy > div.product-item__button > div.product__to-favourite'
            );
            await makeupPage.click(
                'body > div.site-wrap > div.main-wrap > div > div > div:nth-child(2) > div.product-item > div > div.product-item__buy > div.product-item__button > div.product__to-favourite'
            );
            await makeupPage.waitForSelector('#popup__window');
            return makeupPage;
        }

        return {
            searchByName: searchByName,
            orderByPrice: orderByPrice,
            addToFavourites: addToFavourites,
        };
    }
    async showSales(makeupPage) {
        await makeupPage.waitForSelector(
            'div._3_jd-z3Nu-tJuU03tddE2B._2T3S1Jgb_rsSUnXe5qSkEn > div._1jCjQvInPzXO06694Sapn- > div:nth-child(3) > a > div'
        );
        await makeupPage.click(
            'div._3_jd-z3Nu-tJuU03tddE2B._2T3S1Jgb_rsSUnXe5qSkEn > div._1jCjQvInPzXO06694Sapn- > div:nth-child(3) > a > div'
        );

        return makeupPage;
    }

    async endTest() {
        this.browser.close();
    }
}

module.exports.Makeup = Makeup;
