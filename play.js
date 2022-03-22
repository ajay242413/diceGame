const sort = require('./quickSort');

const rl = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
})

let numberOfPlayers, MaxPoints, playerScores =[], playersLastScores =[], flag = false, dice, playersRank = [];

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

    if(playerScores[i] >= parseInt(MaxPoints))
    {
        //console.log('Player' + (i+1) + 'completes the game');

    } else{
        dice =  await rollDice(i + 1);
        printRank(i);
        if(dice === 6){
            await play(i);
        }
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
 * @param player
 */
function printRank(player){
    let rankTable = [], n, sortedRec;



    if (playerScores[player]) {
        playerScores[player] += dice;
    } else {
        playerScores[player] = dice;
    }
    storeLastScores(player, dice);

    if (checkIfPlayerHasWon(player)){
        playersRank.push(player);
    }
    let rank;

    n = playerScores.length;
    sortedRec =  playerScores.slice(0);

    sort.quickSort(sortedRec, 0, n-1);
    for(let i = 0; i < playerScores.length; i++){
        if(playersRank.indexOf(i) !== -1){
            rank = playersRank.indexOf(i) + 1;
        }else {
            rank = (n - 1) - sortedRec.lastIndexOf(playerScores[i]) + 1;

        }

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
    while (checkIfAllPlayerHasWon()) {
        for (let i = 0; i < numberOfPlayers; i++) {
            dice = 0;
            if(!checkIfPlayerHasWon(i)){
                if (!checkIfPlayerHasToBePenalized(i)) {
                    await play(i);
                } else {
                    printRank(i);
                    continue;
                }
            } else {
                continue;
            }
            if(playerScores[i] >= parseInt(MaxPoints))
            {
                console.log('Player' + (i+1) + 'completes the game');

            }
        }
    }

    rl.close()
}

function checkIfPlayerHasWon(player){
    return playerScores[player] >= parseInt(MaxPoints);
}


/**
 * check if any player has won the game
 * @returns {boolean}
 */
function checkIfAllPlayerHasWon() {
    for (let i = 0; i < numberOfPlayers; i++) {
        if (!checkIfPlayerHasWon(i)) {
            return true;
        }
    }
    return false;
}

/*
function to roll dice : which generates random number form 1-6
 */
rollDice = (player) => {
    return new Promise((resolve, reject) => {
        rl.question(`player` + player + ` press r to roll a dice :`, r => {
            let res;
            if (r === 'r') {
                res = 1;
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





