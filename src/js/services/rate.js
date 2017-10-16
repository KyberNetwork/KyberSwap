export default class Rate {
  constructor(name, symbol, icon, address, rate, reserve, balance = 0){
    this.name = name;
    this.symbol = symbol;
    this.icon = icon;
    this.address = address;
    this.rate = rate;
    this.balance = balance;
  }
}
