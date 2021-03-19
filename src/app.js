const express = require("express");
const { isBreakStatement } = require("typescript");
const app = express();
const port = process.env.PORT || 8000;

class Customer {   
    constructor(customerName, cutomerId, amount) {
      this.customerName = customerName;
      this.cutomerId = cutomerId;
      this.amount = amount;
    }
}
 
class Investment {
    constructor(clientId,fundId, amount, date) {
        this.clientId = clientId;
        this.fundId = fundId;
        this.amount = amount;
        this.date = date;
      }
}
class Fund {
    constructor(fundId, fundname, returnRate) {
        this.fundId = fundId;
        this.fundname = fundname;
        this.returnRate = returnRate;
    }
}

// creating one Client 
let cust1 = new Customer("Saransh",parseInt(1), parseInt(100));
let customers = [cust1];

let investments = [];

//creating one Fund  in which client can invest
let fund = new Fund(parseInt(321), "Fund_1", parseInt(15));
let funds = [fund];

app.get("/loadAmount/:custId/:amount", (req, res) => {
    let currIndex = null;
    for(var i=0;i<customers.length;i++){
        if(customers[i].cutomerId == req.params.custId){
            currIndex = i;
            break;
        }
    }
    if(currIndex!=null){
        customers[currIndex].amount = parseInt(customers[currIndex].amount) + parseInt(req.params.amount);
        customers[currIndex].amount = parseInt(customers[currIndex].amount);
        res.send(`updated balance ${customers[currIndex].amount}` )
    }
    res.send("no such client exist");
})

app.get("/displaybalance/:custId", (req, res) => {
    let currIndex = null;
    for(var i=0;i<customers.length;i++){
        if(customers[i].cutomerId == req.params.custId){
            currIndex = i;
            break;
        }
    }
    if(currIndex!=null){
        res.send(`current balance for ${customers[currIndex].cutomerId} is ${customers[currIndex].amount}` )
    }
    res.send("no such client exist");
})

app.get("/withdraw/:custId/:amount", (req, res) => {
    let currIndex = null;
    for(var i=0;i<customers.length;i++){
        if(customers[i].cutomerId == req.params.custId){
            currIndex = i;
            break;
        }
    }
    if(currIndex!=null && req.params.amount<parseInt(customers[currIndex].amount)){
        customers[currIndex].amount = customers[currIndex].amount - parseInt(req.params.amount);
        res.send(`remaining balance for ${customers[currIndex].cutomerId} is ${customers[currIndex].amount}` )
    }
    if(currIndex!=null && amount>parseInt(customers[currIndex].amount)){
        res.send("not enough amount");
    }
    res.send("no such client exist");
});

app.get("/invest/:custId/:amount/:fundid", (req, res) => {
    let investment = new Investment(parseInt(req.params.amount));
    let custIndex = null;
    for(var i=0;i<customers.length;i++){
        if(customers[i].cutomerId == req.params.custId){
            custIndex = i;
            break;
        }
    }
    if(custIndex==null){
        res.send("Invalid Clientid, not such client exist");
    }
    let fundId = null;
    for(var i=0;i<funds.length;i++){
        if(funds[i].fundId == parseInt(req.params.fundid)){
            fundId = i;
            break;
        }
    }
    if(fundId==null){
        res.send("Invalid fundId, not such fund exist");
    }

    if(customers[custIndex].amount<req.params.amount)
        res.send("insufficient balance");
    else {
        let trn = new Investment(parseInt(req.params.custId), parseInt(req.params.fundId), parseInt(req.params.amount), new Date);
        investments[investments.length] = trn;
        customers[custIndex].amount = customers[custIndex].amount - parseInt(req.params.amount);
        res.send(`${investments[investments.length-1].amount} amount transaction done for client ${investments[investments.length-1].clientId} on Fund ${funds[fundId].fundname} .
         So the balance left with client is ${customers[custIndex].amount} on ${investments[investments.length-1].date}`);
    }
});



app.get("/getReturn/:custId/:fundId", (req, res) => {
    let custIndex = null;
    for(var i=0;i<customers.length;i++){
        if(customers[i].cutomerId == req.params.custId){
            custIndex = i;
            break;
        }
    }
    if(custIndex==null){
        res.send("Invalid Clientid, not such client exist");
    }
    let fundId = null;
    for(var i=0;i<funds.length;i++){
        if(funds[i].fundId == req.params.fundId){
            fundId = i;
            break;
        }
    }
    if(fundId==null){
        res.send("Invalid fundId, not such fund exist");
    }
    else {
         for(var i=0;i<investments.length;i++){
            if(investments[i].fundId == req.params.fundId && investments[i].clientId == req.params.custId){
                customers[custIndex].amount = customers[custIndex].amount + (funds[fundId].returnRate/100)*((new Date - investments[i].date))
                res.send(`updated amount = ${customers[custIndex].amount}`);
            }
            else
            res.send("client has no money in this fund");
         }
    }
});


app.get("/getHistory/:custId/", (req, res) => {
    let custIndex = null;
    for(var i=0;i<customers.length;i++){
        if(customers[i].cutomerId == req.params.custId){
            custIndex = i;
            break;
        }
    }
    if(custIndex==null){
        res.send("Invalid Clientid, not such client exist");
    }
    else {
        let transaction = [];
        for(var i=0;i<investments.length;i++){
            if(investments[i].custId == req.params.custId)
                transaction[transaction.length-1] = investments[i];
        }
        res.send(transaction);
    }
});




app.listen(port, () =>{
    console.log(`connection is setup ${port}`);
});

