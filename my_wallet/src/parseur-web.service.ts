import { Injectable } from '@nestjs/common';
import puppeteer, { Browser, Page } from 'puppeteer';
import * as cheerio from 'cheerio';
import * as launcher from 'chrome-launcher';
import { UtilsService } from './commons/utils.service';
import TrxCompteCourant from './entities/trxCompteCourant';
import Categorie from './entities/categorie';
import TrxCarteCredit from './entities/trxCarteCredit';
import { findBestMatch } from 'string-similarity';

@Injectable()
export class ParseurWebService {
    ouvrirChrome: boolean;

    questionsReponsesDic = new Map<string, string>([]);

    constructor(private utilsService: UtilsService) { }

    async lancerChromeAsync(ouvrirChrome: boolean = true): Promise<string> {

        this.ouvrirChrome = ouvrirChrome;
        if (ouvrirChrome === false) {
            return await this.recuprerUrlWsChrome(9222, null);
        }
        console.log('👌 chrome launched ......');

        // chromePath:'/mnt/c/Program Files/Google/Chrome/Application/chrome.exe',
        let chrome = await launcher.launch({ startingUrl: 'https://google.com', chromeFlags: ['--start-maximized'], userDataDir: 'C:\\Users\\Levio\\AppData\\Local\\Google\\Chrome\\User Data\\Profile 1' });
        console.log('👌 chrome launched');
        let chromePort = chrome.port;
        return await this.recuprerUrlWsChrome(chromePort, chrome);
    }

    private async recuprerUrlWsChrome(chromePort: number, chrome: launcher.LaunchedChrome) {
        console.log("🚀 ~ file: parseur-web.service.ts:27 ~ ParseurWebService ~ recuprerUrlWsChrome ~ recuprerUrlWsChrome");

        const browser = await puppeteer.launch({ debuggingPort: chromePort, headless: true });
        const page = await browser.newPage();

        let ws = '';

        const chromeDebuggerWs = `http://127.0.0.1:${chromePort}/json/version`;

        page.on('response', async (response) => {
            if (response.request().url().startsWith(chromeDebuggerWs) && response.status() == 200) {
                ws = (await response.json())['webSocketDebuggerUrl'];
            }

        });



        let maxTentative = 5;
        let tentativeEnCours = 1;
        let attenteParTentativeEnSecondes = (2 * 1000);

        do {
            console.log(`Tentative ${tentativeEnCours}/${maxTentative}: Attente réponse du ${chromeDebuggerWs} ...`);
            await page.goto(chromeDebuggerWs, { waitUntil: 'networkidle0' });
            await this.utilsService.sleepAsync(attenteParTentativeEnSecondes);
            tentativeEnCours++;
        } while (tentativeEnCours <= maxTentative && ws.length === 0);


        await browser.close();

        if (ws.length > 0) {
            console.log(`Coool ${ws} ...`);
        } else {
            console.log(`Impossible de se connecter au chrome-debugger`);
            if (chrome) {
                chrome.kill();
            }
        }
        return ws;
    }


    async recuprerHtmlCartesAsync(ws: string): Promise<{ credit: string, debit: string }> {


        const browser = await puppeteer.connect({
            browserWSEndpoint: ws,
            defaultViewport: { width: 1920, height: 930 }

        });

        const page = await browser.newPage();

        // await this.getElementByText(page,'a','test');
        // return null;

        if (this.ouvrirChrome === true) {

            let estConnecte = await this.seConnecterAuBanqueAsync(page);

            if (estConnecte === false) {
                return null;
            }
        }

        let carteCredit: string = await this.recuprerHtmlCarteCreditAsync(page);
        let carteDebit: string = await this.recuprerHtmlCarteDebitAsync(page);

        await this.seDeconnecterAuBanqueAsync(browser, page);

        return { credit: carteCredit ?? null, debit: carteDebit ?? null };

    }

    async seDeconnecterAuBanqueAsync(browser: Browser, page: Page) {

        if (this.ouvrirChrome === false) {
            return;
        }

        console.log(`🚀 DÉCONNEXION`);
        await page.goto('https://accweb.mouv.desjardins.com/identifiantunique/autologout?urlSpecifique=', { waitUntil: 'networkidle0' });
        page.waitForNetworkIdle();
        await browser.close();
    }


    async getElementByText(page: Page, elementType: string, text: string) {


        const elems = await page.$$(elementType)
        for (var i = 0; i < elems.length; i++) {
            let valueHandle = await elems[i].getProperty('innerText');
            let linkText = (await valueHandle.jsonValue()).toString().toLowerCase().trim();
            if (linkText !== text) continue;

            console.log("🚀 ~ linkText found:", linkText)
            return elems[i]
            // return links[i].click();
        }
        return null;
    }

    async seConnecterAuBanqueAsync(page: Page): Promise<boolean> {

        let maxTentative = 3;
        let tentativeEnCours = 1;
        let result = false;

        do {

            try {


                console.log(`🚀 Tentative ${tentativeEnCours}/${maxTentative}:  CONNEXION`);

                if (await page.$('a[href*="autologout"]') != null) {

                    console.log("👌 déja connecté");
                    result = true;
                } else {

                    await page.goto('https://accweb.mouv.desjardins.com/identifiantunique/securite-garantie/authentification/auth/manuel?domaineVirtuel=desjardins&langueCible=fr', { waitUntil: 'networkidle0' });

                    await page.waitForNetworkIdle();

                    await (await page.waitForSelector('#codeUtilisateur')).type('numCarte');

                    await (await page.waitForSelector('#motDePasse')).type('passwd');


                    await (await page.waitForSelector('#form-identifiant > div.auth-login-actions > button')).click();


                    
                    // selectionner btn "Autres moyens de vérification":
                    await this.utilsService.sleepAsync(3000)
                    //await page.waitForNetworkIdle();
                    let elem= await this.getElementByText(page,'span','Autres moyens de vérification'.toLowerCase());
                    if(elem ===null){
                        return null;
                    }

                    elem.click();
                    
                    //Pour cliquer sur la radio btn "Questions de sécurité":
                    await this.utilsService.sleepAsync(3000)
                    elem= await this.getElementByText(page,'div','Questions de sécurité'.toLowerCase());
                    if(elem ===null){
                        return null;
                    }

                    elem.click();
                    
                    
                    //     //pour cliquer sur le boutton ''continuer'
                    
                    elem= await this.getElementByText(page,'div','Continuer'.toLowerCase());
                    if(elem ===null){
                        return null;
                    }

                    elem.click();
                   
                    await this.utilsService.sleepAsync(5000)
                    //await page.waitForNetworkIdle();

                    //     //Pour lire la question:

                    let labelQuestion = await page.waitForSelector('form label');
                    let question = await page.evaluate(el => el.textContent, labelQuestion);

                    console.log("🚀 ~  question dans web ", question);

                    const questions = Array.from(this.questionsReponsesDic.keys());

                    let questionBestMatch = findBestMatch(question.toLocaleLowerCase(), questions);
                    let questionDansDic = questions[questionBestMatch.bestMatchIndex];

                    console.log("🚀 ~  seConnecterAuBanqueAsync ~ questionDansDic", questionDansDic)


                    let reponseALaQuestion = this.questionsReponsesDic.get(questionDansDic);

                    console.log("🚀 ~  reponseALaQuestion", reponseALaQuestion)

                   // repondre 

                   await (await page.waitForSelector('#reponseQuestionSecurite')).type(reponseALaQuestion);

                   


                   //     //pour cliquer sur le boutton ''continuer'
                    elem= await this.getElementByText(page,'div','Continuer'.toLowerCase());
                    if(elem ===null){
                        return null;
                    }

                    elem.click();
                    
                    result = true;
                }

            } catch (error) {
                console.log("🚀 seConnecterAuBanqueAsync ~ error", error)

                tentativeEnCours++;
            }

        } while (tentativeEnCours <= maxTentative && !result);

        return result;

    }


    async recuprerHtmlCarteDebitAsync(page: Page): Promise<string> {

        let maxTentative = 3;
        let tentativeEnCours = 1;
        let result = null;


        do {
            try {
                console.log(`🚀 CARTE_DÉBIT: Tentative ${tentativeEnCours}/${maxTentative}`);
                await page.goto('https://accesd.mouv.desjardins.com/sommaire-perso/sommaire/detention', { waitUntil: 'networkidle0' });
                page.waitForNetworkIdle();

                const compteCourant = await page.waitForSelector('tiroir-comptes-bancaires titre-produit a');
                await compteCourant.click();
                // await page.select('#select_dernieresoperations', 'P31'); //mois en cours

                // await page.waitForNetworkIdle();


                //await page.waitForNetworkIdle();

                const h = await page.waitForSelector('#dernieresoperations thead');
                console.log("🚀 h OK");
                const headers = await (h).evaluate(ele => ele.innerHTML);
                console.log("🚀 headers OK");

                const b = await page.waitForSelector('#dernieresoperations tbody');
                console.log("🚀 b OK");
                const bodies = await (b).evaluate(ele => ele.innerHTML);
                console.log("🚀 bodies OK");

                result = `<table><thead>${headers}</thead><tbody>${bodies}<tbody></table>`;

            } catch (error) {
                console.log("🚀 recuprerHtmlCarteDebitAsync ~ error", error)
                tentativeEnCours++;

            }
        } while (tentativeEnCours <= maxTentative && result.length === 0);


        return result;

    }

    async recuprerHtmlCarteCreditAsync(page: Page): Promise<string> {

        let maxTentative = 3;
        let tentativeEnCours = 1;
        let result = null;


        do {
            try {
                console.log(`🚀 CARTE_CRÉDIT: Tentative ${tentativeEnCours}/${maxTentative}`);

                if (this.ouvrirChrome === false) {
                    await page.goto('https://accesd.mouv.desjardins.com/sommaire-perso/sommaire/detention', { waitUntil: 'networkidle0' });
                }

                page.waitForNetworkIdle();

                const cc = await page.waitForSelector('tiroir-cartes-prets-marges titre-produit a');
                await cc.click();

                // const select = await page.waitForSelector('#groupe-recherche select');
                // await select.type('depuisDernierReleve');


                const tableCCHeader = await (await page.waitForSelector('app-transactions thead')).evaluate(ele => ele.innerHTML);

                await this.autoScroll(page);


                // const tablesCCBodies = await page.$$eval('app-transactions table', tables => tables.map(table => { return { bodyContent: table.innerHTML } }))
                const tablesCCBodies = await page.evaluate(() => Array.from(document.querySelectorAll('app-transactions table tbody'), element => element.innerHTML));

                result = `<table><thead>${tableCCHeader}</thead><tbody>${tablesCCBodies}<tbody></table>`;



            } catch (error) {
                console.log("🚀 recuprerHtmlCarteCreditAsync ~ error", error)
                tentativeEnCours++;

            }
        } while (tentativeEnCours <= maxTentative && result.length === 0);


        console.log("recuprerHtmlCarteCreditAsync ~ result", result);
        return result;

    }


    async autoScroll(page) {
        await page.evaluate(async () => {
            await new Promise<void>((resolve, reject) => {
                var totalHeight = 0;
                var distance = 100;
                var timer = setInterval(() => {
                    var scrollHeight = document.body.scrollHeight;
                    window.scrollBy(0, distance);
                    totalHeight += distance;

                    if (totalHeight >= scrollHeight - window.innerHeight) {
                        clearInterval(timer);
                        resolve();
                    }
                }, 100);
            });
        });
    }


    parseHtmlCarteCredit(html: string, categories: Categorie[]): TrxCarteCredit[] {

        console.log("🚀 ~ parseHtmlCarteCredit ...");

        let $ = cheerio.load(html.replace(/&nbsp;/g, ' '));

        let ths = $('th').get();
        let trs = $('tbody > tr').get();


        let headers: string[] = ths.map(e => { return $(e).text().trim() });

        let trxs: TrxCarteCredit[] = [];

        for (let index = 0; index < trs.length; index++) {
            const e = trs[index];

            let date = $(e).find(`td:nth-child(${headers.indexOf('Date') + 1}) span:nth-child(2)`).text().replace(/\s+/g, ' ').replace(/\\n/g, '').trim();
            let descBrut = $(e).find(`td:nth-child(${headers.indexOf('Description') + 1})`);
            let desc=descBrut.text().replace(/\s+/g, ' ').replace(/\\n/g, '').trim();

            if (descBrut.find('div').hasClass('transactionAvecIcone')==true){
                desc=descBrut.find('div>div span:last-child').text().replace(/\s+/g, ' ').replace(/\\n/g, '').trim();
            }
            


            let celluleMontant = $(e).find(`td:nth-child(${headers.indexOf('Montant') + 1})`).text().replace(/\s+/g, ' ').replace(/\\n/g, '').trim();
            if (celluleMontant.length === 0) {//c'est une cellule 'Paiement'
                continue;
            }
            if (celluleMontant.indexOf('%') > -1) {//c'est une cellule 'Remise'
                celluleMontant = $(e).find(`td:nth-child(${headers.indexOf('Montant') + 2})`).text();
            }
            let montant = celluleMontant.replace(/^0-9]/g, '').trim();

            console.log(`🚀 Crédit: date ${date}, desc:${desc}, montant: ${montant}`);
            trxs.push(TrxCarteCredit.initTrxDuHtml({ date, desc, montant }, categories));
        }

        console.log("🚀 ~ parseHtmlCarteCredit OK");


        return trxs;
    }

    parseHtmlCarteDebit(html: string, categories: Categorie[]): TrxCompteCourant[] {

        let $ = cheerio.load(html.replace(/&nbsp;/g, ' '));
        let ths = $('th').get();
        let headers: string[] = ths.map(e => { return $(e).text().trim() });

        let trs = $('tbody > tr').get();

        let trxs: TrxCompteCourant[] = [];

        for (let index = 0; index < trs.length; index++) {
            const ligne = trs[index];

            console.log("🚀 ~ -------------------- parseHtmlCarteDebit -------------------- ");
            
            let descBrut = $(ligne).find(`td:nth-child(${headers.indexOf('Description') + 1})`);
            
            let desc = descBrut.text().replace(/\s+/g, ' ').replace(/\\n/g, '').trim();//iconCol
            console.log("🚀 ~ file: parseur-web.service.ts:438 ~ ParseurWebService ~ parseHtmlCarteDebit ~ desc:", desc);

            if(descBrut.find('div>p>span').length>0){
                console.log(`🚀 div>p>span length ${descBrut.find('div>p>span').length} !!!!`);
                desc = descBrut.find('div>p span').last().text().replace(/\s+/g, ' ').replace(/\\n/g, '').trim();//iconCol
            }

            let date = $(ligne).find(`td:nth-child(${headers.indexOf('Date') + 1})`).find('span').first().text().replace(/\s+/g, ' ').trim();
            if (!date) continue;
            let montant = $(ligne).find(`td:nth-child(${headers.indexOf('Montant') + 1})`).text().trim()
            .replace(/\s+/g, '')
            .replace(/\,/g, '.')
            .replace('−','-') ;//Le symbole '-' utilisé dans le site desjardins est diff

            // let montant = parseInt($(ligne).find(`td:nth-child(${headers.indexOf('Montant') + 1})`).text().replace(/^0-9]/g, '').trim());
            console.log("🚀 ~ file: parseur-web.service.ts:446 ~ ParseurWebService ~ parseHtmlCarteDebit ~ montant:", montant);
            let montantFloat=parseFloat(montant);
            let montantDebit = montantFloat>0 ?`${montantFloat}`:'0';
            let montantCredit = montantFloat<0  ?`${montantFloat*(-1)}`:'0';

            console.log(`🚀 Débit: date ${date}, desc:${desc}, montantDebit: ${montantDebit}, montantCredit: ${montantCredit}`);
            trxs.push(TrxCompteCourant.initTrxDuHtml({ date, desc, montantDebit, montantCredit }, categories));

        }
        return trxs;
    }
}
