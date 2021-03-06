"use strict";
/*
map Description:
*   W = Wall
*   G = Goal
*   F = Floor
*   x = Empty (Space outside wall)

*   P = Player
*   B = Box
*/

function mapTerrain(name, isPassable)
{
    this.name = name;
    this.isPassable = isPassable;
}

var G = new mapTerrain("Goal", true);
var F = new mapTerrain("Floor", true);
var W = new mapTerrain("Wall", false);
var x = new mapTerrain("Empty", false);
// specials
var P = new mapTerrain("Player", true);
var B = new mapTerrain("Box", true);

const LEVELS =
[
    {
        map:
        [
             [W, W, W, W, W, W, W, W],
             [W, P, F, F, F, F, F, W],
             [W, G, G, F, F, W, F, W],
             [W, W, F, F, B, B, F, W],
             [x, W, W, F, F, F, F, W],
             [x, W, G, F, B, W, F, W],
             [x, W, F, F, F, F, F, W],
             [x, W, W, W, W, W, W, W]
        ]
    },

    {
         map:
         [
             [x, W, W, W, W, W, W, W, W, W, W, x],
             [x, W, G, F, G, G, G, G, F, G, W, x],
             [x, W, B, W, W, F, F, W, W, B, W, x],
             [W, W, F, F, F, F, F, F, F, F, W, W],
             [W, G, F, F, W, F, F, W, F, F, G, W],
             [W, F, F, F, F, W, W, F, F, F, F, W],
             [x, W, F, F, F, F, F, F, F, F, W, x],
             [x, W, F, B, B, B, B, B, B, F, W, x],
             [x, W, F, F, F, P, F, F, F, F, W, x],
             [x, W, W, W, W, W, W, W, W, W, W, x]

        ]
    }



];


