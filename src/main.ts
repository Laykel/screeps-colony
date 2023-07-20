import { runSpawnController } from './controller.spawn';
import { runCreepController } from './controller.creep';
import { runTowerController } from './controller.tower';
import { runRoomScheduledTasks, runScheduledTasks } from './scheduled';
import { firstRoomMemory } from './shared.logic';
import { initMemory, initRoomMemory } from './memory';

export const loop = () => {
  if (!Memory.startingTick) {
    initMemory();
  }

  // Execute tasks that don't run every tick
  runScheduledTasks();

  // Run tasks specific to each room
  for (const name in Game.rooms) {
    const room = Game.rooms[name];

    if (!room.memory.sources) {
      initRoomMemory(room);
    }

    runRoomScheduledTasks(room);
  }

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
  for (const towerId of firstRoomMemory().towers) {
    const tower = Game.getObjectById(towerId);
    if (tower) {
      runTowerController(tower);
    }
  }
};
