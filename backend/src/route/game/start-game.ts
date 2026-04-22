import {FastifyInstance, FastifyRequest, FastifyReply} from 'fastify'
import { prisma } from "../../server/prisma.js"
import { Lobby } from "./lobby.js"

interface Player {
    username: string;
    nb_cards: number;
    score: number;
}

interface Game {
    owner: string;
    players: Player[];
    winner?: Player;
    //code: string;
}

function runGame(game: Game)
{

}

export function startGame(lobby: Lobby)
{
    const p1: Player = {username:lobby.users[0], nb_cards: 5, score: 0}
    const p2: Player = {username:lobby.users[1], nb_cards: 5, score: 0}
    const p3: Player = {username:lobby.users[2], nb_cards: 5, score: 0}
    const p4: Player = {username:lobby.users[3], nb_cards: 5, score: 0}

    const game: Game = {owner: lobby.owner, players: [p1, p2, p3, p4]}
    runGame(game);
}