import * as fs from 'fs';
import MetroFare from './MetroFare';

const input = fs.readFileSync('input.csv')
const travels: string[][] = input.toString()
    .split('\n')
    .map(entry => entry.split(','));

const metroFareInstance = new MetroFare(travels)
const travelCost = metroFareInstance.calculateFare()
console.log(`Total Fare applied = $${travelCost}`)
