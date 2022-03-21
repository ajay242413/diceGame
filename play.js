const sort = require('./quickSort');

const rl = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
})

let numberOfPlayers, MaxPoints, playerScores =[], playersLastScores =[], flag = false;

players = () => {
    return new Promise((resolve, reject) => {
        rl.question(`Enter Number Of players :`, n => {

            if (Number.isInteger(parseInt(n))) {
                numberOfPlayers = n;
                resolve()
            } else {
                console.log('Invalid input, please enter value in numbers')
                resolve(players());
            }
        })
    })
}

winPoint = () => {
    return new Promise((resolve, reject) => {
        rl.question(`Enter Winning point :`, n => {
            if (Number.isInteger(parseInt(n))) {
                MaxPoints = n;
                resolve()
            } else {
                console.log('Invalid input, please enter value in numbers')
                resolve(winPoint());
            }

        })
    })
}

/**
 *  Each plyer will roll dice here
 *  and their score will be updated in PlayerScores array
 * @param i
 * @returns {Promise<void>}
 */
const play = async (i) => {
    let result = 0;
    if(!checkIfPlayerHasToBePenalized(i))
    {
        result = await rollDice(i + 1);
        if( result === 6){
            await play(i);
        }
        if(playerScores[i]){
            playerScores[i] += result;
        } else {
            playerScores[i] = result;
        }
        storeLastScores(i, result);
        printRank();
    }
}

/**
 * check if player has penalty
 * @param i
 * @returns {boolean}
 */
function checkIfPlayerHasToBePenalized(i){
    if(!playersLastScores[i] || playersLastScores[i].length <= 1){
        return false
    } else {
        if(playersLastScores[i][0] === playersLastScores[i][1] && playersLastScores[i][1] === 1){
            console.log('player' + (i +1) + 'is penalized since he got consecutive 1s');
            return true

        }
    }

}

/**
 * store last 2 scores for each player
 * @param player
 * @param score
 */
function storeLastScores(player, score){
    var individualScore = [];
    if(!playersLastScores[player])
    {

        playersLastScores.push([score]);
    } else if (playersLastScores[player].length <= 1){

        playersLastScores[player].push(score);
    } else {
        playersLastScores[player].shift();
        playersLastScores[player].push(score);
    }

}

/**
 * Prints Players score and rank
 */
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

/**
 * start of the application
 * @returns {Promise<void>}
 */
const main = async () => {
    await players();
    await winPoint();
    while (checkIfAnyPlayerHasWon()){
        for(let i = 0; i < numberOfPlayers; i++) {
            await play(i);
            if(playerScores[i] >= parseInt(MaxPoints))
            {
                console.log('Player' + (i+1) + 'wins');
                break;
            }
        }
    }
    rl.close()
}

/**
 * check if any player has won the game
 * @returns {boolean}
 */
function checkIfAnyPlayerHasWon(){
    let array = playerScores.slice(0),
        n = playerScores.length;
    sort.quickSort(array, 0, n-1);
    return !n || array[n-1] < parseInt(MaxPoints);

}

/*
function to roll dice : which generates random number form 1-6
 */
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
                resolve(rollDice(player));
            }


        })
    });
}


main();





