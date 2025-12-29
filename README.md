# BitBurner
Bitburner is a programming-based incremental game that revolves around hacking and cyberpunk themes. The game can be played at https://danielyxie.github.io/bitburner or installed through Steam.

My Journey through Bitburner as a starting programmer in Javascript and barely starting my own journey on coding. And these are my scripts.
Also, I have never beginning in Javascript. But I did manage to make my way around the game as I try my best to 
wrap my head around Javascript. I think I did pretty good so far...

Batcher folder contains programs and scripts that are used to coordinate/schedule multiple actions to automate resources, growth, and stability in a percise order. Each action taken calculates the delay and time needed before the next one starts. Within a batch the three actions are, weaken (reduces instability), grow (restore resources but lowers stability)), hack (extracts resources but lowers stability).

Sequential Batcher: Is used for single targetted automation of one in-game server and adapts to the conditions for that server.

Protohack: Is single targetted but stores scripts on the biggest server after scanning and unlocking each server .

ShotgunHack: Is a multi-targetted automation on all possible servers that manages all of the server conditions and scheduled actions per server. 

GangManager: 
This scripts is an autonomous controller that manages a group of agents that continuosly evaluates eachs agents levels, states, and assigns an action based off its needs. This script is used to train agents, generate revenue, and promote/optimize progression during the game. 




