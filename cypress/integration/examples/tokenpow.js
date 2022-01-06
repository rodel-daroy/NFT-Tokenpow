/// <reference types="cypress" />

Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  return false
})

context('Landing page', () => {
  before(() => {
    cy.visit('/')
  })

  it('message says no auctions found', () => {
    //open
    cy.get("h1.main-heading").should("have.text", " Tokens, NFTs ")
    cy.get("#grid-frontpage-message").contains("There are no active auctions with selected category")
  })
})
