import { Game , Player , Card , smash_available } from "./websocket.js"
import { randomInt } from "./game-utils.js"


export function triggerBotSmash(game : Game)
{
    for (let i = 0; i < 4; i++)
    {
        if (game.players[i].bot)
        {
            const reactionTime = randomInt(250, 750);

            setTimeout(() =>
                {
                    if(smash_available)
                        game.players[i].ws.send(JSON.stringify({type: 'SMASH', code: game.code, username: game.players[i].username}))
                }, reactionTime);
        }
    }
}