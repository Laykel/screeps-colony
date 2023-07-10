import { runSpawnController } from './controller.spawn';
import { runCreepController } from './controller.creep';
import { findStructureInRoom } from './shared.logic';

// TODO Porter: if container > 1000 AND spawn and extensions are full AND there are walls, repair them?
// TODO Repairers?, improve spawn controller

// TODO Improve energy fetching
// TODO Adapt number of creeps based on energy level in containers

// TODO Long term: update state periodically (not every tick) and then perform actions based on the state

export const loop = () => {
  // Spawn creeps if applicable
  for (const name in Game.spawns) {
    const spawn = Game.spawns[name];
    runSpawnController(spawn, Game.time);
  }

  // Execute creep logic
  for (const name in Game.creeps) {
    const creep = Game.creeps[name];
    runCreepController(creep);
  }

  if (Game.time % 21 === 0) {
    // Run memory clean up code
    for (const name in Memory.creeps) {
      if (Game.creeps[name] === undefined) {
        delete Memory.creeps[name];
      }
    }

    // Set container mode when container is built
    const room = Object.values(Game.spawns)[0].room;
    if (
      Memory.mode !== 'container' &&
      findStructureInRoom(room, STRUCTURE_CONTAINER) !== undefined
    ) {
      Game.notify('Container built, setting container mode now');
      Memory.mode = 'container';
    }

    console.log(`Used CPU this tick: ${Game.cpu.getUsed()}`);
  }
};
