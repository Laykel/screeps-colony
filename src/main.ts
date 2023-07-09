import { runSpawnController } from './controller.spawn';
import { runCreepController } from './controller.creep';
import { findStructureInRoom } from './shared.logic';

// TODO As soon as level 2 is hit, set up extensions
// Once extensions are built, the new creeps are better
// Then, place a container, then roads
// Maybe the opposite

// TODO Spawn controller calculate body parts

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

  if (Game.time % 20 === 0) {
    // Run memory clean up code
    for (const name in Memory.creeps) {
      if (Game.creeps[name] === undefined) {
        delete Memory.creeps[name];
      }
    }

    // Test notify capability
    const room = Object.values(Game.spawns)[0].room;
    if (room.controller?.level === 3) {
      Game.notify('Controller attained level 3');
    }

    // TEST Set container mode when container is built
    if (findStructureInRoom(room, STRUCTURE_CONTAINER) !== undefined) {
      Memory.mode = 'container';
    }
  }

  // console.log(`Used CPU this tick: ${Game.cpu.getUsed()}`);
};
