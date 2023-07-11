import { runSpawnController } from './controller.spawn';
import { runCreepController } from './controller.creep';
import { findStructureInRoom } from './shared.logic';
import { runTowerController } from './controller.tower';

// TODO Long term: update state periodically (not every tick) and then perform actions based on the state, reallocate creeps etc
// TODO Merge Porter, Repairers and builder into Operator who is reallocated based on energy levels and priorities
// TODO Adapt number of creeps based on energy level in containers, and number of extensions (energyCapacityAvailable)

// TODO Have emergency allocation when rampart, container, or other is about to die/under a certain threshold

// TODO Improve energy fetching: if container is empty, go to source!
// TODO Improve spawn controller

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

  // Execute tower logic
  runTowerController();

  if (Game.time % 21 === 0) {
    // Run memory clean up code
    for (const name in Memory.creeps) {
      if (Game.creeps[name] === undefined) {
        delete Memory.creeps[name];
      }
    }

    // TODO Once we arrive at 550 energyCapacityAvailable, activate container mining mode? - there needs to be a container though...
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
