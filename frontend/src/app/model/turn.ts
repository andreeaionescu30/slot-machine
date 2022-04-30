// "turns": [
//     {
//         "turnId": null,
//         "creationDate": "2022-04-10T15:49:44.372+00:00",
//         "amountBet": 10.0,
//         "symbol1": "*",
//         "symbol2": "7",
//         "symbol3": "_"
//     }
// ]


export class Turn {
    creationDate!: Date;
    amountBet!: number;
    symbol1!: string;
    symbol2!: string;
    symbol3!: string;
}
