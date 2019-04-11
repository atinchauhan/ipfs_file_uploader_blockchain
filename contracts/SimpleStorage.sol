pragma solidity ^0.5.0;

contract SimpleStorage {
  string public ipfsHash='hi i am atin';

  function set(string memory x) public {
    ipfsHash= x;
  }

  function get() public view returns (string memory) {
    return ipfsHash;
  }
}
