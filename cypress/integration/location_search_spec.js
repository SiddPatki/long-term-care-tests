const homeObj = Cypress.env('homeObj');
const ltc = Cypress.env('ltcConsolidated');

describe(`Verify Location name on typing Location name, postal and address 1`, () => {

    ['en','fr'].forEach(lang => {
        context(`Test for ${lang} language seaech page`, () => {

        beforeEach(() => {
            cy.visit(lang === 'en' ? 'https://stage.ontariogovernment.ca/locations/longtermcare/search-box/' : 'https://stage.ontariogovernment.ca/fr/page/long-term-care-ontario', {
                auth: {
                    username: 'guest',
                    password: '0nesite'
                }
            });
        });
        let initalIndex = 0;
        ltc.forEach((loc, idx) => {
            it(`${idx + 1 + initalIndex}) Search should yield Location name ${loc['Home Name']}`, () =>{
                let homeName = loc['Home Name'];
                let homeNo = loc['Licensing Home Number'];
                cy.get('#ltc-search-autocomplete-input').click();
                cy.get('#ltc-search-autocomplete-input').type(homeName);
                cy.get('#ltc-search-autocomplete-listbox').contains(loc['Home Name']);
                cy.get('#ltc-search-autocomplete-listbox div').last().click({force: true});
                cy.wait(1000);
                if(lang === 'fr'){
                    cy.url().should('include', lang);
                }
                cy.url().should('include', homeNo);
                cy.get('main').contains(homeName);
            });

            it(`${idx + 1 + initalIndex}) Search should show ${loc['Home Name']} for postal code ${loc['Postal']}`, () =>{
                let homeName = loc['Home Name'];
                let homeNo = loc['Licensing Home Number'];
                cy.get('#ltc-search-autocomplete-input').click();
                cy.get('#ltc-search-autocomplete-input').type(loc['Postal']);
                cy.get('#ltc-search-autocomplete-0').click({force: true});
                cy.wait(1000);
                cy.get('#ltc-search-box form').submit();
                cy.wait(2000);
                cy.get('[data-test-id=virtuoso-item-list]').get(`#sers-${homeNo}`).scrollIntoView();
                cy.get(`#sers-${homeNo} .listItem .header`).contains(homeName);
                cy.get(`#sers-${homeNo} .listItem > a`).should('have.attr', 'href').should('not.be.empty').and('contain', homeNo);
                if(lang === 'fr'){
                    cy.get(`#sers-${homeNo} .listItem > a`).should('have.attr', 'href').should('not.be.empty').and('contain', 'fr');
                }
                cy.go('back', { timeout: 3000 });
            });

            it(`${idx + 1 + initalIndex}) Search should show ${loc['Home Name']} for address1 ${loc['Address1']}`, () =>{
                let homeName = loc['Home Name'];
                let homeNo = loc['Licensing Home Number'];
                cy.get('#ltc-search-autocomplete-input').click();
                cy.get('#ltc-search-autocomplete-input').type(loc['Address1']);
                cy.get('#ltc-search-autocomplete-0').click({force: true});
                cy.wait(1000);
                cy.get('#ltc-search-box form').submit();
                cy.wait(2000);
                cy.get('[data-test-id=virtuoso-item-list]').get(`#sers-${homeNo}`).scrollIntoView();
                cy.get(`#sers-${homeNo} .listItem .header`).contains(homeName);
                cy.get(`#sers-${homeNo} .listItem > a`).should('have.attr', 'href').should('not.be.empty').and('contain', homeNo);
                if(lang === 'fr'){
                    cy.get(`#sers-${homeNo} .listItem > a`).should('have.attr', 'href').should('not.be.empty').and('contain', 'fr');
                }
                cy.go('back', { timeout: 3000 });
            });
        });
        });
    });
});

const resizeObserverLoopErrRe = /^[^(ResizeObserver loop limit exceeded)]/
Cypress.on('uncaught:exception', (err) => {
    /* returning false here prevents Cypress from failing the test */
    if (resizeObserverLoopErrRe.test(err.message)) {
        return false
    }
})