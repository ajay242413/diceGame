const sort = require('./quickSort');

const rl = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
})

let numberOfPlayers, MaxPoints, playerScores =[];

players = () => {
    return new Promise((resolve, reject) => {
        rl.question(`Enter Number Of players :`, n => {
            numberOfPlayers = n;
            resolve()
        })
    })
}

winPoint = () => {
    return new Promise((resolve, reject) => {
        rl.question(`Enter Winning point :`, n => {
            MaxPoints = n;
            resolve()
        })
    })
}

const play = async () => {
    let result;
    for(let i = 0; i < numberOfPlayers; i++){

            result = await rollDice(i + 1);
            // give 2nd chance of player gets 6 and he is not yet won
            if( result === 6 && (!playerScores[i] || playerScores[i] + result < parseInt(MaxPoints))){
                result += await rollDice(i + 1);
            }
            if(playerScores[i]){
                playerScores[i] += result;
            } else {
                playerScores[i] = result;
            }

            printRank();

        if(playerScores[i] >= parseInt(MaxPoints))
        {
            console.log('Player' + (i+1) + 'wins');
            playerScores.shift();
            continue;

        }
    }

}

function printRank(){
    let rankTable = [];
    let n = playerScores.length;
    let sortedRec =  playerScores.slice(0);
    sort.quickSort(sortedRec, 0, n-1);

    for(let i = 0; i < playerScores.length; i++){
        let rank = n - sortedRec.findIndex((value) => {
            return value >= playerScores[i]
        });
        rankTable.push( {
            Player: 'Player' + (i + 1),
            score: playerScores[i],
            rank: rank

        })

    }
    rankTable.sort((a , b) => a.rank - b.rank )
    console.table(rankTable)
}


const main = async () => {
    await players()
    await winPoint()
    while (checkIfAnyPlayerHasWon()){
        await play()
    }

    rl.close()
}

function checkIfAnyPlayerHasWon(){
    let array = playerScores.slice(0),
        n = playerScores.length;
    sort.quickSort(array, 0, n-1);
    return !n || array[n-1] < parseInt(MaxPoints);

}

rollDice = (player) => {
    return new Promise((resolve, reject) => {
        rl.question(`player` + player + ` press r to roll a dice :`, r => {
            let res;
            if (r === 'r') {
                res = Math.floor(Math.random() * 6) + 1
                resolve(res);
                console.log(res);
            } else {
                console.log(`wrong input`)
                reject();
            }


        })
    });
}


main();




