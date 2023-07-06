import { runHarvester } from './roles.harvester';
import roleTransporter from './roles.transporter';
import roleUpgrader from './roles.upgrader';
import roleBuilder from './roles.builder';

// TODO Place for declare and types?

type CreepRole = 'harvester' | 'transporter' | 'upgrader' | 'builder';

declare global {
  // interface Memory {}

  interface CreepMemory {
    role: CreepRole;
    building: boolean;
    upgrading: boolean;
  }

  // interface FlagMemory {}
  // interface SpawnMemory {}
  // interface RoomMemory {}
}

export const loop = () => {
  const tower = Game.getObjectById('128c8f8e6af5f270d1e774f7' as Id<StructureTower>);

  if (tower) {
    const closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
      filter: structure => structure.hits < structure.hitsMax,
    });
    if (closestDamagedStructure) {
      tower.repair(closestDamagedStructure);
    }

    const closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    if (closestHostile) {
      tower.attack(closestHostile);
    }
  }

  for (const name in Game.creeps) {
    const creep = Game.creeps[name];
    if (creep.memory.role == 'harvester') {
      runHarvester(creep);
    }
    if (creep.memory.role == 'transporter') {
      roleTransporter.run(creep);
    }
    if (creep.memory.role == 'upgrader') {
      roleUpgrader.run(creep);
    }
    if (creep.memory.role == 'builder') {
      roleBuilder.run(creep);
    }
  }
};
