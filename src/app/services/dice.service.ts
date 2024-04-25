import {Injectable} from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class DiceService {

  constructor() {

  }

  rollD100() {
    let [percentile, n] = this.rollDn(10, 2).map(x => x-1);
    percentile = percentile * 10;
    // 0 - 99
    const result = percentile + n;
    // 1 - 100
    return (result === 0) ? 100 : result;
  }

  rollD20() {
    return this.rollDn(20)[0];
  }

  rollD12() {
    return this.rollDn(12)[0];
  }

  rollD10() {
    return this.rollDn(10)[0];
  }

  rollD8() {
    return this.rollDn(8)[0];
  }

  rollD6() {
    return this.rollDn(6)[0];
  }

  rollD4() {
    return this.rollDn(4)[0];
  }

  rollDn(n: number, length = 1) {
    let array = new Uint32Array(length);
    crypto.getRandomValues(array);
    array = array.map(num => num % n + 1);
    return array;
  }

}
