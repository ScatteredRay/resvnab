const puppeteer = require('puppeteer');

function PageLib() {
    let exports = {};
    exports.XPathMap = function (path, doc, fn) {
        let ar = [];
        let res = doc.evaluate(path, doc, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
        let n = res.iterateNext();
        while(n) {
            ar.push(fn(n));
            n = res.iterateNext();
        }
        return ar
    }
    exports.$x = function(path) {
        return exports.XPathMap(path, document, (x)=>x);
    }
    exports.NodeValue = (n) => n.nodeValue;
    exports.NodeURL = (n) => new URL(n.nodeValue, n.baseURI).href;
    return exports;
}

async function GetEnv(page) {
    let env = await page.evaluateHandle(PageLib);
    return env;
}

async function check() {
    const browser = await puppeteer.launch({
        headless: false,
        args: []
    });
    const page = await browser.newPage();
    await page.goto("https://www.exploretock.com/lazybearsf");
    let env = GetEnv(page);
    if(env.$x("/html/body//*[contains(@class, 'OfferingsStatusMessage-heading')]")[0].textContent.match("sold out") === null) {
        console.log("Avaliable!!!");
    }
    else {
        console.log("Sold out");
    }
    await page.waitFor(1000);
    await page.close();
    await browser.close();
}

check();