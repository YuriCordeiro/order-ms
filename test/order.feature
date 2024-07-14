Feature: Order Management

  Scenario: Create a new order
    Given I have a cart with ID "cart123"
    When I create an order
    Then I should receive an order with status "pending"

  Scenario: Get all orders
    Given there are orders in the system
    When I get all orders
    Then I should receive a list of orders

  Scenario: Get an order by ID
    Given there is an order with ID "orderId"
    When I get the order by ID "orderId"
    Then I should receive the order with status "pending"