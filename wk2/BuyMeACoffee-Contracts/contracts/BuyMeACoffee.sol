// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

//Deplyed to Rinkeby network at 0x8424780625922a6739eB7d4D1481512dC6E522Fd

contract BuyMeACoffee {
    // Event to emit when a Memo is created.
    event NewMemo(
        address indexed from,
        uint256 timestamp,
        string name,
        string message
    );

    //Memo struct
    struct Memo {
        address from;
        uint256 timestamp;
        string name;
        string message;
    }

    // list of all Memos recieved from friends.
    Memo[] memos;

    // Address of the contract deployer.
    address payable owner;

    // deploy logic
    constructor(){
        owner =  payable(msg.sender);
    }

    function buyCoffee(string memory _name, string memory _message) public payable{
        require(msg.value > 0, "You can't buy a coffee with 0 ETH.");

        // Create a new Memo and add it to storage
        memos.push(Memo(
          msg.sender,
          block.timestamp,
          _name,
          _message
        ));

        // Emit the NewMemo event
        emit NewMemo(
          msg.sender,
          block.timestamp,
          _name,
          _message
        );
    }

    function withdrawTips() public{
        require(owner.send(address(this).balance));
    }

    function getMemos() public view returns(Memo[] memory){
        return memos;
    }


}