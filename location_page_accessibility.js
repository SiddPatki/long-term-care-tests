const ltcList = Cypress.env('locationData');

/**
 * Location properties:
 * [
  'IQS Home Number',
  'Home Name',
  'Licensing Home Number',
  'Address1',
  'City',
  'Postal',
  'Phone',
  'Fax',
  'Email',
  'Website',
  'LHIN',
  'Home Administrator Admin First Name',
  'Admin Last Name',
  'Licensee',
  'Home Type (Sector)',
  'Licensed Beds',
  "Resident's Council",
  'Family Council',
  'Accreditation',
  'Home Designated Under French Language Services Act',
  'Home Profile Link',
  'Inspection Link',
  'X',
  'Y',
  'FID',
  'OGF_ID',
  'MOH_PRO_ID',
  'SERV_TYPE',
  'SERV_DET',
  'EN_NAME',
  'FR_NAME',
  'EN_ALT',
  'FR_ALT',
  'ADDRESS_1',
  'ADDRESS_2',
  'ADDR_DESCR',
  'COMMUNITY',
  'POSTALCODE',
  'GEO_UPT_DT',
  'EFF_DATE',
  'Year_Month',
  'LTC_Home',
  'LTC_Home_Number',
  'PHU',
  '1st_dose_percentage_staff_vaccination_rate',
  '2nd_dose_percentage_staff_vaccination_rate',
  'Home #',
  'Home Address',
  'Bed #',
  'Complaint',
  'Critical Incident System',
  'Director Order Follow Up',
  'Follow up',
  'Other',
  'Total'
]
 */

describe(`Accessibility Tests for ${ltcList.length} Location Pages`, () => {
    ltcList.forEach((location, idx) => {
        context(`${idx + 1}) ${location['Home Name']}: `, () => {
            before(() => {
                cy.visit(location.testUrl);
                cy.injectAxe();
            });
        
            it('Has no detectable a11y violations on load', () => {
                cy.configureAxe({
                    reporter: 'option',
                });

                // Test the page at initial load
                //cy.checkA11y();
                cy.checkA11y(null, null, terminalLog)
            })
        });
    });
});

function terminalLog(violations) {
    cy.task(
      'log',
      `${violations.length} accessibility violation${
        violations.length === 1 ? '' : 's'
      } ${violations.length === 1 ? 'was' : 'were'} detected`
    )
    // pluck specific keys to keep the table readable
    const violationData = violations.map(
      ({ id, impact, description, nodes }) => ({
        id,
        impact,
        description,
        nodes: nodes.length
      })
    )
  
    cy.task('table', violationData)
  }