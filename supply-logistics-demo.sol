pragma solidity ^0.4.24;

contract Application {
  function Application() public {}
  enum Assets {
      Shipment, Customer
  }
  Assets _addCustomer = Assets.Customer;
  Assets _generateShipment = Assets.Shipment;
  Assets _updateShipment = Assets.Shipment;

  function addCustomer (
    string assetId,
    string customerId,
    string customerName)
  public {}

  function generateShipment (
    string assetId,
    string shipmentId,
    string sourceCustomerId,
    string destinationCustomerId,
    string sourceCustomerName,
    string destinationCustomerName,
    string sourceLocation,
    string destinationLocation,
    uint transactionDate,
    uint goodsIssuePlan,
    uint customerRequestDel,
    uint estimatedDuration,
    string status)
  public {}

  function updateShipment (
    string assetId,
    string updateId,
    string shipmentId,
    string sourceCustomerId,
    string destinationCustomerId,
    string sourceCustomerName,
    string destinationCustomerName,
    string sourceLocation,
    string destinationLocation,
    uint transactionDate,
    uint goodsIssuePlan,
    uint customerRequestDel,
    uint estimatedDuration,
    string status)
  public {}  
}
