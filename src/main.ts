import { runSpawnController } from './controller.spawn';
import { runCreepController } from './controller.creep';
import { runTowerController } from './controller.tower';
import { runRoomScheduledTasks, runScheduledTasks } from './scheduled';
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

    // Execute tower logic
    for (const towerId of room.memory.towers) {
      const tower = Game.getObjectById(towerId);
      if (tower) {
        runTowerController(tower);
      }
    }
  }

  // Spawn creeps if necessary
  for (const name in Game.spawns) {
    const spawn = Game.spawns[name];
    runSpawnController(spawn, Game.time);
  }

  // Execute creep logic
  for (const name in Game.creeps) {
    const creep = Game.creeps[name];
    runCreepController(creep);
  }

  console.log(`Used CPU this tick: ${Game.cpu.getUsed()}`);
};
